// POST /api/schedule-validation. La landing nunca decide ni recibe enlaces Zcal reales.
import { evaluateTopic, normalizeEmail, normalizePhone, signActionToken } from "../_lib/zcal.ts";
import { odooEligibility, upsertScheduledLead, type OdooEnv } from "../_lib/odoo.ts";
import { hasSupabase, sbPatch, sbSelect, type SupabaseEnv } from "../_lib/supabase.ts";
import { json, noContent } from "../_lib/http.ts";

interface Env extends SupabaseEnv, OdooEnv { ZCAL_ACTION_TOKEN_SECRET?: string; SCHEDULE_MODE?: string; SCHEDULE_CANARY_BOOKING_IDS?: string; N8N_SCHEDULE_NOTIFICATION_URL?: string; }
interface Ctx { request: Request; env: Env; }
interface BookingRow { booking_id: string; full_name: string | null; email_normalized: string | null; phone_normalized: string | null; start_at: string | null; timezone: string | null; event_name: string | null; meeting_topic: string | null; reschedule_url_encrypted: string | null; cancel_url_encrypted: string | null; }
const MAX_BODY = 8_192;

export function onRequestOptions({ request }: Ctx): Response { return noContent(request.headers.get("Origin")); }
export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  const origin = request.headers.get("Origin");
  if (!hasSupabase(env) || !env.ZCAL_ACTION_TOKEN_SECRET) return json({ status: "manual_review", reason: "server_configuration_error" }, 503, origin);
  const raw = await request.text(); if (!raw || raw.length > MAX_BODY) return json({ status: "manual_review", reason: "invalid_request" }, 400, origin);
  let input: Record<string, unknown>; try { input = JSON.parse(raw) as Record<string, unknown>; } catch { return json({ status: "manual_review", reason: "invalid_json" }, 400, origin); }
  const email = normalizeEmail(input.email); const phone = normalizePhone(input.phone); const start_at = String(input.start_date || "").trim();
  const bookingId = typeof input.booking_id === "string" ? input.booking_id.trim() : "";
  if (!email || phone.length < 7 || !start_at) return json({ status: "manual_review", reason: "invalid_request" }, 422, origin);
  let matches: BookingRow[];
  try {
    matches = await sbSelect<BookingRow>(env, "zcal_bookings", bookingId
      ? { select: "booking_id,full_name,email_normalized,phone_normalized,start_at,timezone,event_name,meeting_topic,reschedule_url_encrypted,cancel_url_encrypted", booking_id: `eq.${bookingId}`, limit: "1" }
      : { select: "booking_id,full_name,email_normalized,phone_normalized,start_at,timezone,event_name,meeting_topic,reschedule_url_encrypted,cancel_url_encrypted", email_normalized: `eq.${email}`, start_at: `eq.${start_at}`, limit: "3" });
    if (!bookingId) matches = matches.filter((row) => normalizePhone(row.phone_normalized) === phone);
  } catch (error) { console.error("schedule-validation booking lookup failed", String(error)); return json({ status: "manual_review", reason: "booking_lookup_unavailable" }, 503, origin); }
  if (matches.length !== 1) return json({ status: "manual_review", reason: matches.length ? "ambiguous_booking" : "booking_not_found" }, 200, origin);
  const booking = matches[0]; const topic = String(input.meeting_topic || input.preparation_answer || booking.meeting_topic || "");
  const topicResult = evaluateTopic(topic);
  if (topicResult.decision === "needs_context") {
    const exp = Date.now() + 10 * 60_000;
    const makeAction = (action: "reschedule" | "cancel") => signActionToken({ booking_id: booking.booking_id, action, exp }, env.ZCAL_ACTION_TOKEN_SECRET!);
    const [reschedule_token, cancel_token] = await Promise.all([makeAction("reschedule"), makeAction("cancel")]);
    await recordDecision(env, booking.booking_id, "needs_context", topicResult.reason);
    return json({ status: "needs_context", reason: topicResult.reason, request_id: booking.booking_id, actions: { reschedule_token, cancel_token } }, 200, origin);
  }
  let eligibility;
  try { eligibility = await odooEligibility(env, email, phone, booking.start_at || start_at); }
  catch (error) { console.error("schedule-validation Odoo lookup failed", String(error)); return json({ status: "manual_review", reason: "odoo_lookup_unavailable" }, 503, origin); }
  if (eligibility.status !== "approved") {
    await recordDecision(env, booking.booking_id, eligibility.status, eligibility.reason);
    return json({ status: eligibility.status, reason: eligibility.reason, request_id: booking.booking_id }, 200, origin);
  }
  let leadId = eligibility.lead_id;
  if (isCanary(env, booking.booking_id)) {
    try {
      leadId = await upsertScheduledLead(env, { lead_id: leadId, full_name: booking.full_name || String(input.full_name || ""), email, phone, start_at: booking.start_at || start_at, timezone: booking.timezone || "America/Guayaquil", event_name: booking.event_name || "Agenda Zcal" });
      await notifyN8n(env, booking.booking_id, leadId, "approved");
    } catch (error) { console.error("schedule-validation canary upsert failed", String(error)); return json({ status: "manual_review", reason: "odoo_upsert_failed", request_id: booking.booking_id }, 503, origin); }
  }
  await recordDecision(env, booking.booking_id, "approved", "", leadId);
  return json({ status: "approved", reason: "", request_id: booking.booking_id, agenda: { full_name: booking.full_name || "", email, phone, timezone: booking.timezone || "America/Guayaquil", start_date: booking.start_at || start_at, preparation_answer: topic } }, 200, origin);
}

function isCanary(env: Env, bookingId: string): boolean { return env.SCHEDULE_MODE === "canary" && (env.SCHEDULE_CANARY_BOOKING_IDS || "").split(",").map((id) => id.trim()).includes(bookingId); }
async function recordDecision(env: Env, bookingId: string, decision: string, reason: string, leadId: number | null = null): Promise<void> {
  try { await sbPatch(env, "zcal_bookings", `booking_id=eq.${encodeURIComponent(bookingId)}`, { status: "validated", decision, decision_reason: reason || null, odoo_lead_id: leadId }); }
  catch (error) { console.error("schedule-validation decision audit failed", String(error)); }
}
async function notifyN8n(env: Env, bookingId: string, leadId: number | null, decision: string): Promise<void> {
  if (!env.N8N_SCHEDULE_NOTIFICATION_URL) return;
  const response = await fetch(env.N8N_SCHEDULE_NOTIFICATION_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: bookingId, lead_id: leadId, decision }) });
  if (!response.ok) throw new Error(`n8n notification ${response.status}`);
}
