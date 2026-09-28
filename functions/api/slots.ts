
interface Env {
  CALNODE_API_KEY?: string;
  CALNODE_EVENT_TYPE_SLUG?: string;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

const CALNODE_ORIGIN = "https://calnode.sotomayorconsulting.com";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 62;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function parseDate(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
    ? date
    : null;
}

export async function onRequestGet({
  request,
  env,
}: FunctionContext): Promise<Response> {
  const requestUrl = new URL(request.url);
  const from = requestUrl.searchParams.get("from") ?? "";
  const to = requestUrl.searchParams.get("to") ?? "";
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate || toDate < fromDate) {
    return json(
      {
        error:
          'Los parámetros "from" y "to" deben ser fechas válidas (YYYY-MM-DD).',
      },
      400,
    );
  }

  const rangeDays = (toDate.getTime() - fromDate.getTime()) / 86_400_000;
  if (rangeDays > MAX_RANGE_DAYS) {
    return json(
      { error: `El rango máximo permitido es de ${MAX_RANGE_DAYS} días.` },
      400,
    );
  }

  const apiKey = env.CALNODE_API_KEY?.trim();
  const eventTypeSlug = env.CALNODE_EVENT_TYPE_SLUG?.trim() || "test-SCI";

  if (!apiKey) {
    console.error("CALNODE_API_KEY is not configured");
    return json(
      { error: "El calendario no está configurado temporalmente." },
      503,
    );
  }

  const calnodeUrl = new URL(
    `/v1/event-types/${encodeURIComponent(eventTypeSlug)}/slots`,
    CALNODE_ORIGIN,
  );
  calnodeUrl.searchParams.set("from", from);
  calnodeUrl.searchParams.set("to", to);

  try {
    const response = await fetch(calnodeUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await response.json().catch(() => null);

    if (data === null) {
      return json({ error: "Calnode devolvió una respuesta inválida." }, 502);
    }
    if (!response.ok) {
      console.error("Calnode slots request failed", response.status);
      return json(
        { error: "No fue posible consultar los horarios disponibles." },
        response.status >= 500 ? 502 : response.status,
      );
    }

    return json(data);
  } catch (error) {
    console.error("Unable to fetch Calnode slots", error);
    return json(
      { error: "No fue posible consultar los horarios disponibles." },
      502,
    );
  }
}
