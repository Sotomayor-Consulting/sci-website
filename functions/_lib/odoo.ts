// Cliente JSON-RPC m\u00ednimo de Odoo. Solo la ruta canaria llama create/write.
export interface OdooEnv { ODOO_URL?: string; ODOO_DB?: string; ODOO_USERNAME?: string; ODOO_PASSWORD?: string; }
interface Lead { id: number; stage_id?: number | [number, string]; active?: boolean; lost_reason_id?: unknown; won_status?: string; is_blacklisted?: boolean; phone_blacklisted?: boolean; phone_sanitized_blacklisted?: boolean; partner_is_blacklisted?: boolean; x_studio_fecha_agenda_dt?: string; }
interface RpcResponse { result?: unknown; error?: { message?: string; data?: { message?: string } }; }

function stageId(value: Lead["stage_id"]): number { return Array.isArray(value) ? Number(value[0]) : Number(value || 0); }
function restricted(lead: Lead): boolean { return stageId(lead.stage_id) === 17 || lead.active === false || Boolean(lead.lost_reason_id) || lead.is_blacklisted === true || lead.phone_blacklisted === true || lead.phone_sanitized_blacklisted === true || lead.partner_is_blacklisted === true || ["lost", "perdido"].includes(String(lead.won_status || "").toLowerCase()); }
function hasFutureBooking(lead: Lead, incoming: string): boolean {
  const previous = Date.parse(String(lead.x_studio_fecha_agenda_dt || "").replace(" ", "T") + "Z"); const target = Date.parse(incoming);
  return Number.isFinite(previous) && previous > Date.now() - 300_000 && (!Number.isFinite(target) || Math.abs(previous - target) > 300_000);
}

export async function odooEligibility(env: OdooEnv, email: string, phone: string, startAt: string): Promise<{ status: "approved" | "rejected" | "manual_review"; reason: string; lead_id: number | null }> {
  if (!env.ODOO_URL || !env.ODOO_DB || !env.ODOO_USERNAME || !env.ODOO_PASSWORD) return { status: "manual_review", reason: "odoo_not_configured", lead_id: null };
  const uid = await rpc(env, "common", "authenticate", [env.ODOO_DB, env.ODOO_USERNAME, env.ODOO_PASSWORD, {}]);
  if (!Number(uid)) throw new Error("odoo authentication failed");
  const last7 = phone.slice(-7);
  const fields = ["id", "stage_id", "active", "lost_reason_id", "won_status", "is_blacklisted", "phone_blacklisted", "phone_sanitized_blacklisted", "partner_is_blacklisted", "x_studio_fecha_agenda_dt"];
  const leads = await execute<Lead[]>(env, Number(uid), "crm.lead", "search_read", [["|", ["email_from", "=ilike", email], ["phone_sanitized", "ilike", last7]]], { fields, limit: 20 });
  const emailBlacklisted = await execute<number>(env, Number(uid), "mail.blacklist", "search_count", [["email", "=ilike", email], ["active", "=", true]]);
  const phoneBlacklisted = await execute<number>(env, Number(uid), "phone.blacklist", "search_count", [["number", "ilike", last7], ["active", "=", true]]);
  if (emailBlacklisted || phoneBlacklisted || leads.some(restricted)) return { status: "rejected", reason: "restricted_history", lead_id: null };
  if (leads.some((lead) => hasFutureBooking(lead, startAt))) return { status: "rejected", reason: "existing_booking", lead_id: leads[0]?.id || null };
  if (leads.length > 1) return { status: "manual_review", reason: "multiple_similar_leads", lead_id: null };
  return { status: "approved", reason: "", lead_id: leads[0]?.id || null };
}

export async function upsertScheduledLead(env: OdooEnv, booking: { lead_id: number | null; full_name: string; email: string; phone: string; start_at: string; timezone: string; event_name: string }): Promise<number> {
  const uid = await rpc(env, "common", "authenticate", [env.ODOO_DB, env.ODOO_USERNAME, env.ODOO_PASSWORD, {}]); if (!Number(uid)) throw new Error("odoo authentication failed");
  const values = { name: booking.full_name || booking.email, contact_name: booking.full_name, email_from: booking.email, phone: booking.phone, x_studio_asesoria: booking.event_name, x_studio_fecha_agenda_dt: booking.start_at, x_studio_timezone: booking.timezone, team_id: 1, stage_id: 1 };
  if (booking.lead_id) { await execute<boolean>(env, Number(uid), "crm.lead", "write", [[booking.lead_id], values]); return booking.lead_id; }
  return Number(await execute<number>(env, Number(uid), "crm.lead", "create", [values]));
}

async function execute<T>(env: OdooEnv, uid: number, model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
  return rpc(env, "object", "execute_kw", [env.ODOO_DB, uid, env.ODOO_PASSWORD, model, method, args, kwargs]) as Promise<T>;
}
async function rpc(env: OdooEnv, service: string, method: string, args: unknown[]): Promise<unknown> {
  const response = await fetch(`${env.ODOO_URL!.replace(/\/+$/, "")}/jsonrpc`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: crypto.randomUUID() }) });
  const body = await response.json().catch(() => ({})) as RpcResponse;
  if (!response.ok || body.error) throw new Error(body.error?.data?.message || body.error?.message || `odoo rpc ${response.status}`);
  return body.result;
}
