interface Env {
  CALNODE_API_KEY?: string;
  CALNODE_EVENT_TYPE_SLUG?: string;
}

interface FunctionContext {
  request: Request;
  env: Env;
}

interface BookingAnswer {
  question_id: string;
  value: string;
}

interface BookingInput {
  startAt: Date;
  name: string;
  email: string;
  answers: BookingAnswer[];
}

const CALNODE_BOOKINGS_URL =
  "https://calnode.sotomayorconsulting.com/v1/bookings";
const MAX_BODY_SIZE = 64 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBooking(value: unknown): BookingInput | null {
  if (!isRecord(value)) return null;

  const startAtValue =
    typeof value.start_at === "string" ? value.start_at.trim() : "";
  const startAt = new Date(startAtValue);
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email =
    typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const rawAnswers = value.answers ?? [];

  if (
    !startAtValue ||
    Number.isNaN(startAt.getTime()) ||
    name.length < 2 ||
    name.length > 120 ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    !Array.isArray(rawAnswers) ||
    rawAnswers.length > 100
  ) {
    return null;
  }

  const answers: BookingAnswer[] = [];
  for (const answer of rawAnswers) {
    if (!isRecord(answer)) return null;
    const questionId =
      typeof answer.question_id === "string" ? answer.question_id.trim() : "";
    const answerValue =
      typeof answer.value === "string" ? answer.value.trim() : "";
    if (!questionId || questionId.length > 100 || answerValue.length > 5_000) {
      return null;
    }
    answers.push({ question_id: questionId, value: answerValue });
  }

  return { startAt, name, email, answers };
}

export async function onRequestPost({
  request,
  env,
}: FunctionContext): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "Origen no permitido." }, 403);
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return json({ error: "El cuerpo debe enviarse como JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return json({ error: "La solicitud es demasiado grande." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json({ error: "No fue posible leer la solicitud." }, 400);
  }
  if (rawBody.length > MAX_BODY_SIZE) {
    return json({ error: "La solicitud es demasiado grande." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "El cuerpo debe ser un JSON válido." }, 400);
  }

  const booking = parseBooking(body);
  if (!booking) {
    return json(
      { error: "Nombre, correo y horario válido son requeridos." },
      400,
    );
  }
  if (booking.startAt.getTime() < Date.now() - 60_000) {
    return json(
      { error: "El horario seleccionado ya no está disponible." },
      409,
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

  try {
    const response = await fetch(CALNODE_BOOKINGS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type_slug: eventTypeSlug,
        start_at: booking.startAt.toISOString(),
        name: booking.name,
        email: booking.email,
        answers: booking.answers,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await response.json().catch(() => null);

    if (data === null) {
      return json({ error: "Calnode devolvió una respuesta inválida." }, 502);
    }
    if (!response.ok) {
      console.error("Calnode booking request failed", response.status);
    }

    return json(data, response.status);
  } catch (error) {
    console.error("Unable to create Calnode booking", error);
    return json({ error: "No fue posible confirmar la reserva." }, 502);
  }
}
