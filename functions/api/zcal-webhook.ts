// POST /api/zcal-webhook. Punto de entrada firmado para event.created/rescheduled/cancelled.
import { encryptSecret, normalizeZcalWebhook, verifyZcalSignature } from "../_lib/zcal.ts";
import { hasSupabase, sbInsert, type SupabaseEnv } from "../_lib/supabase.ts";

interface Env extends SupabaseEnv { ZCAL_WEBHOOK_SECRET?: string; ZCAL_LINK_ENCRYPTION_KEY?: string; SCHEDULE_MODE?: string; }
interface Ctx { request: Request; env: Env; }
const MAX_BODY = 65_536;
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  if (!env.ZCAL_WEBHOOK_SECRET || !env.ZCAL_LINK_ENCRYPTION_KEY || !hasSupabase(env)) return reply({ ok: false, error: "server_configuration_error" }, 500);
  const raw = await request.text();
  if (!raw || raw.length > MAX_BODY) return reply({ ok: false, error: "invalid_payload" }, 400);
  try {
    if (!await verifyZcalSignature(raw, request.headers.get("x-zcal-webhook-signature"), env.ZCAL_WEBHOOK_SECRET)) return reply({ ok: false, error: "invalid_signature" }, 401);
    const booking = normalizeZcalWebhook(JSON.parse(raw));
    if (!booking) return reply({ ok: false, error: "unsupported_event" }, 422);
    const [reschedule_url_encrypted, cancel_url_encrypted] = await Promise.all([
      encryptSecret(booking.reschedule_url, env.ZCAL_LINK_ENCRYPTION_KEY),
      encryptSecret(booking.cancel_url, env.ZCAL_LINK_ENCRYPTION_KEY),
    ]);
    await sbInsert(env, "zcal_bookings", [{
      booking_id: booking.booking_id, event_type: booking.event_type, event_created_at: booking.event_created_at || null,
      full_name: booking.full_name || null, email_normalized: booking.email || null, phone_normalized: booking.phone || null,
      start_at: booking.start_at || null, timezone: booking.timezone || null, event_name: booking.event_name || null,
      invite_id: booking.invite_id || null, meeting_topic: booking.meeting_topic || null, meeting_url: booking.meeting_url || null,
      reschedule_url_encrypted: reschedule_url_encrypted || null, cancel_url_encrypted: cancel_url_encrypted || null,
      payload_sha256: await digest(raw), processing_mode: env.SCHEDULE_MODE || "shadow", status: "received",
    }], { onConflict: "booking_id" });
    // En shadow no se consulta/escribe Odoo ni se reenvía n8n: solo se conserva evidencia verificable.
    return reply({ ok: true, booking_id: booking.booking_id, status: "received", mode: env.SCHEDULE_MODE || "shadow" }, 202);
  } catch (error) {
    console.error("zcal-webhook failed", String(error));
    return reply({ ok: false, error: "webhook_processing_failed" }, 502);
  }
}

async function digest(value: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
