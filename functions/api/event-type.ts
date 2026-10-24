interface Env {
  CALNODE_API_KEY?: string;
  CALNODE_EVENT_TYPE_SLUG?: string;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

const CALNODE_ORIGIN = "https://calnode.sotomayorconsulting.com";
const SLUG_PATTERN = /^[A-Za-z0-9_-]{1,100}$/;
const LANGUAGE_PATTERN = /^[a-z]{2}(?:-[A-Za-z]{2})?$/;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function pickNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

export async function onRequestGet({
  request,
  env,
}: FunctionContext): Promise<Response> {
  const requestUrl = new URL(request.url);
  const requestedSlug = requestUrl.searchParams.get("slug")?.trim() ?? "";
  const requestedLanguage =
    requestUrl.searchParams.get("lang")?.trim() || "es";

  if (requestedSlug && !SLUG_PATTERN.test(requestedSlug)) {
    return json({ error: 'El parámetro "slug" no es válido.' }, 400);
  }
  if (!LANGUAGE_PATTERN.test(requestedLanguage)) {
    return json({ error: 'El parámetro "lang" no es válido.' }, 400);
  }

  const eventTypeSlug =
    requestedSlug || env.CALNODE_EVENT_TYPE_SLUG?.trim() || "test-SCI";
  const calnodeUrl = new URL(
    `/v1/event-types/${encodeURIComponent(eventTypeSlug)}/public`,
    CALNODE_ORIGIN,
  );
  calnodeUrl.searchParams.set("lang", requestedLanguage);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const apiKey = env.CALNODE_API_KEY?.trim();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  try {
    const response = await fetch(calnodeUrl, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await response.json().catch(() => null);

    if (data === null) {
      return json({ error: "Calnode devolvió una respuesta inválida." }, 502);
    }
    if (!response.ok) {
      console.error("Calnode event type request failed", response.status);
      return json(
        {
          error:
            "No fue posible consultar la configuración del agendamiento.",
        },
        response.status >= 500 ? 502 : response.status,
      );
    }
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return json({ error: "Calnode devolvió una respuesta inválida." }, 502);
    }

    const payload = data as Record<string, unknown>;

    return json({
      slug: pickString(payload.slug, eventTypeSlug),
      name: pickString(payload.name),
      description: pickString(payload.description),
      duration_minutes: pickNumber(payload.duration_minutes),
      duration_label: pickString(payload.duration_label),
      location_type: pickString(payload.location_type),
      require_attendee_phone: payload.require_attendee_phone === true,
      max_future_days: pickNumber(payload.max_future_days, 60),
      min_notice_minutes: pickNumber(payload.min_notice_minutes),
      price_cents: pickNumber(payload.price_cents),
      currency: pickString(payload.currency),
      locale: pickString(payload.locale, "es"),
      booking_form_notice: pickString(payload.booking_form_notice),
    });
  } catch (error) {
    console.error("Unable to fetch Calnode event type", error);
    return json(
      { error: "No fue posible consultar la configuración del agendamiento." },
      502,
    );
  }
}
