// CORS + helpers de respuesta compartidos por los endpoints del Diagnóstico.

const ORIGIN_OK = [
  /^https:\/\/(www\.)?sotomayorconsulting\.com$/,
  /^https:\/\/[a-z0-9-]+\.sci-website-eyh\.pages\.dev$/,
  /^https:\/\/sci-website-eyh\.pages\.dev$/,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
];

export function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ORIGIN_OK.some((re) => re.test(origin)) ? origin : "";
  const h: Record<string, string> = { "Cache-Control": "no-store", Vary: "Origin" };
  if (allow) {
    h["Access-Control-Allow-Origin"] = allow;
    h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
    h["Access-Control-Max-Age"] = "86400";
  }
  return h;
}

export function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export function noContent(origin: string | null): Response {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}
