// POST /api/diagnostico-lead  — endpoint same-origin para el Diagnóstico LLC (A y B).
//
// FASE 2b (corte): Supabase `leads-xb` es la ruta principal a Odoo. El insert
// aquí dispara el trigger `diag_leads_xb_sync` (Postgres, vía pg_net) que llama
// al workflow n8n "Paso 1b - leads-xb Odoo Sync", el cual crea/actualiza el lead
// en Odoo y escribe el resultado de vuelta (`diag_mark_synced`). El webhook n8n
// viejo (compartido con Registro Ads V45 y otras landings) ya NO se llama desde
// acá salvo que el insert a Supabase falle — ahí sí se usa como red de seguridad
// para no perder el lead, sin duplicar el push a Odoo (son ramas mutuamente
// excluyentes: si el insert tiene éxito el trigger corre solo; si falla, nunca
// llega a insertarse y por lo tanto el trigger nunca dispara).
//
// La respuesta de este endpoint no se usa en el UI de las landings (fire-and-forget
// en `sendLeadToWebhook`), así que no hace falta esperar a Odoo para responder.

import { normalizeLead, type LeadInput } from "../_lib/normalize.ts";
import { hasSupabase, sbInsert, sbRpc, type SupabaseEnv } from "../_lib/supabase.ts";
import { toLeadRow } from "../_lib/lead-row.ts";
import { json, noContent } from "../_lib/http.ts";

interface Env extends SupabaseEnv {
  N8N_LEADS_WEBHOOK_URL?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

// Red de seguridad: solo se usa si el insert a Supabase falla (Supabase caído,
// fila rechazada, etc.). Mientras el insert funcione, el trigger de Postgres
// es la única vía a Odoo — no reenviar acá también.
const N8N_FALLBACK = "https://n8n.sotomayorconsulting.com/webhook/leads-directos-tiktok-landing";
const MAX_BODY = 32_768;

export function onRequestOptions({ request }: Ctx): Response {
  return noContent(request.headers.get("Origin"));
}

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  const origin = request.headers.get("Origin");

  const raw = await request.text();
  if (!raw || raw.length > MAX_BODY) {
    return json({ ok: false, status: "bad_request", error: raw ? "body_too_large" : "empty_body" }, 400, origin);
  }

  let payload: LeadInput;
  try {
    payload = JSON.parse(raw) as LeadInput;
  } catch {
    return json({ ok: false, status: "bad_request", error: "invalid_json" }, 400, origin);
  }

  const { lead, warnings } = normalizeLead(payload);
  if (!lead.lead_id) {
    return json({ ok: false, status: "validation_failed", error: "lead_id_required" }, 422, origin);
  }
  if (!lead.email && !lead.phone_e164) {
    return json({ ok: false, status: "validation_failed", error: "email_or_phone_required" }, 422, origin);
  }
  if (warnings.length) {
    console.warn("diagnostico-lead normalize warnings", { lead_id: lead.lead_id, warnings });
  }

  if (lead.test) {
    // QA: igual insertamos a Supabase (el trigger ignora filas test=true, no toca Odoo)
    // pero nunca pasa por el fallback de n8n.
    if (hasSupabase(env)) {
      try {
        await sbInsert(env, "leads-xb", [toLeadRow(lead, payload)], { onConflict: "lead_id" });
      } catch (err) {
        console.error("diagnostico-lead supabase upsert failed (test)", err);
      }
    }
    return json({ ok: true, duplicate: false, status: "qa_skipped", warnings }, 200, origin);
  }

  if (!hasSupabase(env)) {
    // Sin Supabase configurado no hay quien dispare el trigger: única vía es el webhook viejo.
    console.warn("diagnostico-lead: Supabase no configurado, usando fallback directo a n8n");
    return forwardToLegacyWebhook(env, raw, origin);
  }

  try {
    await sbInsert(env, "leads-xb", [toLeadRow(lead, payload)], { onConflict: "lead_id" });
    if (lead.session_id) {
      await sbRpc(env, "diag_link_lead", { p_session_id: lead.session_id, p_lead_id: lead.lead_id });
    }
    // Insert exitoso -> el trigger diag_leads_xb_sync ya disparó (o disparará) el
    // push a Odoo vía pg_net. No reenviar también al webhook viejo.
    return json({ ok: true, duplicate: false, status: "leads_xb_insert_ok" }, 200, origin);
  } catch (err) {
    console.error("diagnostico-lead supabase upsert failed, usando fallback n8n", err);
    return forwardToLegacyWebhook(env, raw, origin);
  }
}

async function forwardToLegacyWebhook(env: Env, raw: string, origin: string | null): Promise<Response> {
  const webhook = env.N8N_LEADS_WEBHOOK_URL || N8N_FALLBACK;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    });
    let body: Record<string, unknown> = {};
    try {
      body = (await res.json()) as Record<string, unknown>;
    } catch {
      /* n8n puede responder vacío */
    }
    if (body.duplicate === true) {
      return json({ ok: false, duplicate: true, status: String(body.status || "backend_duplicate") }, 200, origin);
    }
    return json(
      {
        ok: res.ok && body.ok !== false,
        duplicate: false,
        status: String(body.status || (res.ok ? "webhook_fallback_success" : "webhook_fallback_http_error")),
      },
      res.ok ? 200 : 502,
      origin,
    );
  } catch (err) {
    console.error("diagnostico-lead legacy webhook fallback failed", err);
    return json({ ok: false, duplicate: false, status: "webhook_failed" }, 502, origin);
  }
}
