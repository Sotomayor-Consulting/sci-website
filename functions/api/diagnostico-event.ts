// POST /api/diagnostico-event  — telemetría de pasos del quiz (A y B).
//
// La landing lo llama con navigator.sendBeacon en cada cambio de paso y en
// `pagehide` (así se captura a quien abandona sin enviar el gate). sendBeacon
// manda text/plain, así que parseamos el cuerpo crudo. Responde 204 sin body.
//
// Escribe:
//   diagnostico_sessions  (RPC diag_upsert_session, monótono en max_step_index)
//   diagnostico_answers   (upsert por session_id+question_key, si event_type='answer')
//   diagnostico_events    (insert append-only)

import { hasSupabase, sbInsert, sbRpc, type SupabaseEnv } from "../_lib/supabase.ts";
import { json, noContent } from "../_lib/http.ts";

interface Ctx {
  request: Request;
  env: SupabaseEnv;
}

const MAX_BODY = 8_192;
const EVENT_TYPES = new Set([
  "view", "answer", "back", "gate_view", "gate_submit", "result_view", "cta_click", "abandon_beacon",
]);

function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function intOrNull(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export function onRequestOptions({ request }: Ctx): Response {
  return noContent(request.headers.get("Origin"));
}

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  const origin = request.headers.get("Origin");

  const raw = await request.text();
  if (!raw || raw.length > MAX_BODY) return noContent(origin); // beacon: nunca hacemos fallar al cliente

  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return noContent(origin);
  }

  const session_id = str(b.session_id, 80);
  const variant = str(b.landing_variant, 1).toLowerCase() === "b" ? "b" : "a";
  const step_index = intOrNull(b.step_index);
  const step_id = str(b.step_id, 40);
  const event_type = str(b.event_type, 20);

  if (!session_id || step_index === null || !EVENT_TYPES.has(event_type)) {
    return json({ ok: false, error: "bad_event" }, 422, origin);
  }
  if (!hasSupabase(env)) {
    console.warn("diagnostico-event: sin Supabase configurado");
    return noContent(origin);
  }

  const ctx = (b.context && typeof b.context === "object" ? b.context : {}) as Record<string, unknown>;
  const question_key = str(b.question_key, 20);

  try {
    await sbRpc(env, "diag_upsert_session", {
      p_session_id: session_id,
      p_landing_variant: variant,
      p_persona: str(b.persona, 20) || null,
      p_page_name: str(b.page_name, 80) || null,
      p_step_index: step_index,
      p_step_id: step_id || null,
      p_ctx: ctx,
    });

    if (event_type === "answer" && question_key) {
      await sbInsert(
        env,
        "diagnostico_answers",
        [{
          session_id,
          landing_variant: variant,
          question_key,
          question_index: intOrNull(b.question_index) ?? 1,
          question_stem: str(b.question_stem, 300) || null,
          answer_value: str(b.answer_value, 120) || null,
          answer_label: str(b.answer_label, 300) || null,
          answer_text: str(b.answer_text, 300) || null,
        }],
        { onConflict: "session_id,question_key" },
      );
    }

    await sbInsert(env, "diagnostico_events", [{
      session_id,
      landing_variant: variant,
      seq: intOrNull(b.seq) ?? 0,
      step_index,
      step_id: step_id || "",
      event_type,
      question_key: question_key || null,
      answer_value: str(b.answer_value, 120) || null,
      dwell_ms: intOrNull(b.dwell_ms),
    }]);
  } catch (err) {
    console.error("diagnostico-event write failed", err);
  }

  return noContent(origin);
}
