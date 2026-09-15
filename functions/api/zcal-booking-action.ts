// GET /api/zcal-booking-action?token=...: canjea un token corto por una URL Zcal permitida.
import { decryptSecret, verifyActionToken } from "../_lib/zcal.ts";
import { hasSupabase, sbSelect, type SupabaseEnv } from "../_lib/supabase.ts";

interface Env extends SupabaseEnv { ZCAL_ACTION_TOKEN_SECRET?: string; ZCAL_LINK_ENCRYPTION_KEY?: string; ZCAL_ALLOWED_HOSTS?: string; }
interface Ctx { request: Request; env: Env; }
interface BookingRow { reschedule_url_encrypted: string | null; cancel_url_encrypted: string | null; }

export async function onRequestGet({ request, env }: Ctx): Promise<Response> {
  if (!hasSupabase(env) || !env.ZCAL_ACTION_TOKEN_SECRET || !env.ZCAL_LINK_ENCRYPTION_KEY) return Response.json({ error: "server_configuration_error" }, { status: 500 });
  const token = new URL(request.url).searchParams.get("token") || "";
  const claims = await verifyActionToken(token, env.ZCAL_ACTION_TOKEN_SECRET);
  const booking_id = typeof claims?.booking_id === "string" ? claims.booking_id : "";
  const action = claims?.action === "reschedule" || claims?.action === "cancel" ? claims.action : "";
  if (!booking_id || !action) return Response.json({ error: "invalid_or_expired_action" }, { status: 400 });
  const rows = await sbSelect<BookingRow>(env, "zcal_bookings", { select: "reschedule_url_encrypted,cancel_url_encrypted", booking_id: `eq.${booking_id}`, limit: "1" });
  const cipher = action === "reschedule" ? rows[0]?.reschedule_url_encrypted : rows[0]?.cancel_url_encrypted;
  if (!cipher) return Response.json({ error: "action_not_available" }, { status: 404 });
  let target = ""; try { target = await decryptSecret(cipher, env.ZCAL_LINK_ENCRYPTION_KEY); } catch { return Response.json({ error: "action_unavailable" }, { status: 503 }); }
  const hosts = (env.ZCAL_ALLOWED_HOSTS || "zcal.co").split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
  let url: URL; try { url = new URL(target); } catch { return Response.json({ error: "invalid_action_url" }, { status: 502 }); }
  if (url.protocol !== "https:" || !hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return Response.json({ error: "untrusted_action_url" }, { status: 502 });
  return Response.redirect(url.toString(), 302);
}
