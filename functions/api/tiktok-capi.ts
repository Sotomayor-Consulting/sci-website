// POST /api/tiktok-capi — CAPI de TikTok same-origin (Diagnóstico LLC, A y B).
//
// Reemplaza la llamada cross-origin que la landing hacía directo a
// n8n.sotomayorconsulting.com/webhook/pixel-api-conversiones. Ventajas sobre esa ruta:
//  - same-origin: no lo bloquean ad-blockers/ITP/ETP como sí bloquean una llamada a
//    un subdominio de automatización.
//  - no depende de que el navegador siga vivo: se responde rápido al cliente y el
//    POST real a TikTok corre en background vía `waitUntil`.
//  - hashea email/phone acá (SHA-256, Web Crypto) cuando el caller los manda en claro,
//    en vez de dejar esos campos vacíos como pasaba en la ruta vieja.
//  - IP real del visitante tomada de `CF-Connecting-IP` (Cloudflare ya la resuelve).
//
// No toca el pixel del navegador (ttq.track / fbq) — eso sigue disparando aparte,
// esto es solo la mitad server-side (CAPI).

import { buildTikTokEvent, type TikTokEventInput } from "../_lib/tiktok.ts";
import { json, noContent } from "../_lib/http.ts";

interface Env {
  TIKTOK_ACCESS_TOKEN?: string;
  TIKTOK_PIXEL_ID?: string;
}
interface Ctx {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";
const MAX_BODY = 8_192;

export function onRequestOptions({ request }: Ctx): Response {
  return noContent(request.headers.get("Origin"));
}

export async function onRequestPost({ request, env, waitUntil }: Ctx): Promise<Response> {
  const origin = request.headers.get("Origin");

  const raw = await request.text();
  if (!raw || raw.length > MAX_BODY) return noContent(origin); // igual que diagnostico-event: nunca hacer fallar al cliente por esto

  let input: TikTokEventInput;
  try {
    input = JSON.parse(raw) as TikTokEventInput;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, origin);
  }

  if (!env.TIKTOK_ACCESS_TOKEN) {
    console.error("tiktok-capi: TIKTOK_ACCESS_TOKEN no configurado");
    return json({ ok: false, error: "capi_not_configured" }, 200, origin); // 200: no romper el flujo del cliente
  }

  const clientIp =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "";
  const userAgent = request.headers.get("User-Agent") || "";

  const built = await buildTikTokEvent(input, {
    pixelId: env.TIKTOK_PIXEL_ID || "",
    clientIp,
    userAgent,
  });

  if (!built.ok) {
    return json({ ok: false, error: built.error }, 422, origin);
  }

  // Responder rápido al cliente; el POST real a TikTok sigue en background y no
  // depende de que el navegador siga conectado.
  waitUntil(sendToTikTok(built.body, env.TIKTOK_ACCESS_TOKEN, built.meta));

  return json({ ok: true, queued: true, event_name: built.meta.event_name, event_id: built.meta.event_id }, 200, origin);
}

async function sendToTikTok(
  body: Record<string, unknown>,
  accessToken: string,
  meta: { event_name: string; event_id: string },
): Promise<void> {
  try {
    const res = await fetch(TIKTOK_EVENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Token": accessToken },
      body: JSON.stringify(body),
    });
    const resBody = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const code = Number(resBody.code ?? resBody.error_code ?? -1);
    const accepted = res.ok && (code === 0 || resBody.code === undefined);
    if (!accepted) {
      console.error("tiktok-capi rejected", {
        event_name: meta.event_name,
        event_id: meta.event_id,
        http_status: res.status,
        tiktok_code: code,
        tiktok_message: resBody.message || resBody.error_message || "",
      });
    }
  } catch (err) {
    console.error("tiktok-capi request failed", { event_name: meta.event_name, event_id: meta.event_id, err: String(err) });
  }
}
