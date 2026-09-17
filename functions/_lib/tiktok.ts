// TikTok Events API (CAPI) — construcción del payload y hash de identificadores.
// Puerto del nodo n8n "Normalize & Build TikTok Event" (workflow "Pixel API TikTok v2"),
// para correr same-origin en Cloudflare en vez de una llamada cross-origin a n8n.
//
// El whitelist original se copió tal cual del workflow viejo, que sirve a las otras 13
// landings (SubmitForm/SubmitApplication/Purchase). Nunca se cruzó contra los eventos que
// el propio diagnóstico A/B dispara (ver NATIVE en trackAdsEvent, landing HTML): faltaban
// "Subscribe" (gate en Etapa 1) e "InitiateCheckout" (camino plataforma) — esos dos
// llegaban con 422 "evento no autorizado" y nunca salían hacia TikTok.

export const TIKTOK_ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "SubmitForm",
  "CompleteRegistration",
  "Contact",
  "Schedule",
  "SubmitApplication",
  "Purchase",
  "Subscribe",
  "InitiateCheckout",
  "Lead", // diagnóstico A/B manda esto en vez de CompleteRegistration — ver trackAdsEvent
  "StartScheduling", // intención explícita: abrió la agenda desde la CTA del diagnóstico
]);

export interface TikTokEventInput {
  event_name?: unknown;
  event_id?: unknown;
  event_time?: unknown;
  pixel_id?: unknown;
  ttclid?: unknown;
  ttp?: unknown;
  email?: unknown;
  phone?: unknown;
  external_id?: unknown;
  page_url?: unknown;
  referrer?: unknown;
  content_type?: unknown;
  content_id?: unknown;
  content_name?: unknown;
  content_category?: unknown;
  currency?: unknown;
  value?: unknown;
  test_event_code?: unknown;
}

function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** TikTok pide el hash en minúsculas/trim; el teléfono en formato E.164 antes de hashear. */
async function hashIdentifier(raw: string, kind: "email" | "phone" | "external_id"): Promise<string> {
  if (!raw) return "";
  const normalized = kind === "email" ? raw.trim().toLowerCase() : raw.trim();
  // Ya viene hasheado (64 hex) desde algún caller -> no rehashear.
  if (/^[a-f0-9]{64}$/i.test(normalized)) return normalized.toLowerCase();
  return sha256Hex(normalized);
}

function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

export interface BuildResult {
  ok: true;
  body: Record<string, unknown>;
  meta: { event_name: string; event_id: string; pixel_id: string };
}
export interface BuildError {
  ok: false;
  error: string;
}

export async function buildTikTokEvent(
  input: TikTokEventInput,
  ctx: { pixelId: string; clientIp: string; userAgent: string },
): Promise<BuildResult | BuildError> {
  const eventName = str(input.event_name, 40);
  if (!eventName) return { ok: false, error: "event_name ausente" };
  if (!TIKTOK_ALLOWED_EVENTS.has(eventName)) return { ok: false, error: `evento no autorizado (${eventName})` };

  const eventId = str(input.event_id, 120);
  if (!eventId) return { ok: false, error: "event_id ausente" };

  const eventTimeRaw = Number(input.event_time);
  const eventTime = Number.isFinite(eventTimeRaw) && eventTimeRaw > 0 ? Math.floor(eventTimeRaw) : Math.floor(Date.now() / 1000);

  const pixelId = str(input.pixel_id) || ctx.pixelId;
  if (!pixelId) return { ok: false, error: "pixel_id ausente" };

  const [emailHash, phoneHash, externalIdHash] = await Promise.all([
    hashIdentifier(str(input.email, 200), "email"),
    hashIdentifier(str(input.phone, 40), "phone"),
    hashIdentifier(str(input.external_id, 200), "external_id"),
  ]);

  const user = compact({
    ip: ctx.clientIp,
    user_agent: ctx.userAgent,
    ttclid: str(input.ttclid, 200),
    ttp: str(input.ttp, 200),
    email: emailHash,
    phone: phoneHash,
    external_id: externalIdHash,
  });

  const page = compact({
    url: str(input.page_url, 500),
    referrer: str(input.referrer, 500),
  });

  // TikTok valida content_type contra un enum cerrado ("product" | "product_group") —
  // "service" (el default que teníamos) lo rechaza con "El tipo de contenido no es válido".
  // No vendemos productos individuales; "product_group" es lo que TikTok recomienda para
  // negocios de servicios/leads sin catálogo. content_id también es obligatorio (no puede
  // ir vacío) aunque no tengamos SKUs reales — usamos un identificador estable de la landing.
  //
  // "value" ya NO tiene default en 0: mandar 0 en eventos sin valor real (ViewContent) dispara
  // "El valor de compra no es válido" en TikTok. Se omite si el caller no manda uno de verdad —
  // en gate_submit/Schedule la landing sí manda un valor dinámico real (ver trackAdsEvent).
  const rawValue = Number(input.value);
  const properties = compact({
    content_type: str(input.content_type) || "product_group",
    content_id: str(input.content_id) || str(input.content_name) || "diagnostico-llc",
    content_name: str(input.content_name) || "Diagnostico LLC",
    content_category: str(input.content_category) || "LLC USA",
    currency: str(input.currency) || "USD",
    value: Number.isFinite(rawValue) && rawValue > 0 ? rawValue : undefined,
  });

  const body: Record<string, unknown> = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      compact({
        event: eventName,
        event_time: eventTime,
        event_id: eventId,
        user,
        page,
        properties,
      }),
    ],
  };

  const testCode = str(input.test_event_code, 60);
  if (testCode) body.test_event_code = testCode;

  return { ok: true, body, meta: { event_name: eventName, event_id: eventId, pixel_id: pixelId } };
}
