// Cliente PostgREST mínimo para las Functions. Usa SERVICE_ROLE_KEY (ignora RLS).
// Sin dependencias — fetch nativo de Workers.

export interface SupabaseEnv {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export function hasSupabase(env: SupabaseEnv): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

function rest(env: SupabaseEnv): string {
  return `${(env.SUPABASE_URL as string).replace(/\/+$/, "")}/rest/v1`;
}
function headers(env: SupabaseEnv, extra: Record<string, string> = {}): Record<string, string> {
  const key = env.SUPABASE_SERVICE_ROLE_KEY as string;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function orThrow(res: Response, label: string): Promise<void> {
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw new Error(`supabase ${label} ${res.status}: ${text.slice(0, 300)}`);
}

/** INSERT o UPSERT. `onConflict` activa merge-duplicates. Devuelve nada (return=minimal). */
export async function sbInsert(
  env: SupabaseEnv,
  table: string,
  rows: Record<string, unknown>[],
  opts: { onConflict?: string } = {},
): Promise<void> {
  const url = new URL(`${rest(env)}/${table}`);
  const prefer = ["return=minimal"];
  if (opts.onConflict) {
    url.searchParams.set("on_conflict", opts.onConflict);
    prefer.push("resolution=merge-duplicates");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: headers(env, { Prefer: prefer.join(",") }),
    body: JSON.stringify(rows),
  });
  await orThrow(res, `insert ${table}`);
}

/** PATCH con filtro PostgREST (ej: `session_id=eq.s_1`). */
export async function sbPatch(
  env: SupabaseEnv,
  table: string,
  filter: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`${rest(env)}/${table}?${filter}`, {
    method: "PATCH",
    headers: headers(env, { Prefer: "return=minimal" }),
    body: JSON.stringify(patch),
  });
  await orThrow(res, `patch ${table}`);
}

/** Llama una función Postgres: POST /rest/v1/rpc/<fn>. */
export async function sbRpc(env: SupabaseEnv, fn: string, args: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${rest(env)}/rpc/${fn}`, {
    method: "POST",
    headers: headers(env),
    body: JSON.stringify(args),
  });
  await orThrow(res, `rpc ${fn}`);
}
