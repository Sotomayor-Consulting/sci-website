interface Env {
  CALNODE_API_KEY?: string;
  CALNODE_EVENT_TYPE_SLUG?: string;
}

interface FunctionContext {
  env: Env;
}

const CALNODE_ORIGIN = "https://calnode.sotomayorconsulting.com";

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function onRequestGet({
  env,
}: FunctionContext): Promise<Response> {
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
    `/v1/event-types/${encodeURIComponent(eventTypeSlug)}/questions`,
    CALNODE_ORIGIN,
  );

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
      console.error("Calnode questions request failed", response.status);
      return json(
        { error: "No fue posible consultar las preguntas del agendamiento." },
        response.status >= 500 ? 502 : response.status,
      );
    }

    return json(data);
  } catch (error) {
    console.error("Unable to fetch Calnode questions", error);
    return json(
      { error: "No fue posible consultar las preguntas del agendamiento." },
      502,
    );
  }
}
