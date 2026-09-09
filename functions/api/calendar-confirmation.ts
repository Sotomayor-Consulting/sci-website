interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

const MAX_BODY_SIZE = 1_024;
const CALENDAR_EVENT = "lead_agendamiento_confirmado";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getSupabaseLeadsUrl(value: string): string {
  const url = value.trim().replace(/\/+$/, "");
  return url.endsWith("/rest/v1/leads") ? url : `${url}/rest/v1/leads`;
}

export async function onRequestPost({
  request,
  env,
}: FunctionContext): Promise<Response> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing required Cloudflare environment variables");
    return json({ error: "server_configuration_error" }, 500);
  }

  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return json({ error: "payload_too_large" }, 413);
  }

  let submissionId = "";
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_SIZE) {
      return json({ error: "payload_too_large" }, 413);
    }
    const body: unknown = JSON.parse(rawBody);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ error: "invalid_json" }, 400);
    }
    const value = (body as Record<string, unknown>).submissionId;
    submissionId = typeof value === "string" ? value.trim() : "";
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (!UUID_PATTERN.test(submissionId)) {
    return json({ error: "invalid_submission_id" }, 422);
  }

  const leadsUrl = new URL(getSupabaseLeadsUrl(env.SUPABASE_URL));
  leadsUrl.searchParams.set("submission_id", `eq.${submissionId}`);
  leadsUrl.searchParams.set("select", "id");

  let supabaseResponse: Response;
  try {
    supabaseResponse = await fetch(leadsUrl, {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ event_calendar: CALENDAR_EVENT }),
    });
  } catch (error) {
    console.error("Supabase calendar confirmation request failed", error);
    return json({ error: "lead_storage_unavailable" }, 503);
  }

  if (!supabaseResponse.ok) {
    console.error(
      "Supabase calendar confirmation failed",
      supabaseResponse.status,
      await supabaseResponse.text(),
    );
    return json({ error: "lead_update_failed" }, 502);
  }

  const records = (await supabaseResponse.json()) as Array<{ id?: string }>;
  if (records.length === 0) {
    return json({ error: "lead_not_found" }, 404);
  }

  return json({ ok: true, event: CALENDAR_EVENT });
}
