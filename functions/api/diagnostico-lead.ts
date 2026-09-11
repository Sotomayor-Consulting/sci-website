// POST /api/diagnostico-lead  — endpoint same-origin para el Diagnóstico LLC (A y B).
//
// FASE 2a (esto): proxy. Valida lo mínimo, corre normalizeLead() para observar
// warnings, y reenvía el payload TAL CUAL al webhook n8n actual. Mata el problema
// de CORS/OPTIONS del webhook y deja el resto del pipeline intacto.
// Fases siguientes: mover normalización acá (sacar `clean_dates` de n8n),
// disparar CAPI server-side, y hacer upsert a Supabase `leads-xb`.

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

  // Persistir en Supabase ANTES de n8n: si Odoo/n8n cae, el lead no se pierde.
  // Best-effort: si Supabase falla, seguimos igual al webhook (fase 2a).
  if (hasSupabase(env)) {
    try {
      await sbInsert(env, "leads-xb", [toLeadRow(lead, payload)], { onConflict: "lead_id" });
      if (lead.session_id) {
        await sbRpc(env, "diag_link_lead", { p_session_id: lead.session_id, p_lead_id: lead.lead_id });
      }
    } catch (err) {
      console.error("diagnostico-lead supabase upsert failed", err);
    }
  }

  if (lead.test) {
    return json({ ok: true, duplicate: false, status: "qa_skipped", warnings }, 200, origin);
  }

  const webhook = env.N8N_LEADS_WEBHOOK_URL || N8N_FALLBACK;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw, // fase 2a: reenvío verbatim; `clean_dates` sigue en n8n
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
        status: String(body.status || (res.ok ? "webhook_success" : "webhook_http_error")),
      },
      res.ok ? 200 : 502,
      origin,
    );
  } catch (err) {
    console.error("diagnostico-lead webhook failed", err);
    return json({ ok: false, duplicate: false, status: "webhook_failed" }, 502, origin);
  }
}
