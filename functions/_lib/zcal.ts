// Primitivas puras para el ingreso de Zcal y la evaluaci\u00f3n de agenda.

export interface ZcalBooking {
  booking_id: string;
  event_type: "event.created" | "event.rescheduled" | "event.cancelled";
  event_created_at: string;
  full_name: string;
  email: string;
  phone: string;
  start_at: string;
  timezone: string;
  event_name: string;
  invite_id: string;
  meeting_topic: string;
  meeting_url: string;
  reschedule_url: string;
  cancel_url: string;
}

type UnknownRecord = Record<string, unknown>;
const text = (value: unknown) => String(value ?? "").replace(/\s+/g, " ").trim();
export const normalizeEmail = (value: unknown) => text(value).toLowerCase();
export const normalizePhone = (value: unknown) => text(value).replace(/\D/g, "");
export const fold = (value: unknown) => text(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let different = 0;
  for (let index = 0; index < left.length; index += 1) different |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return different === 0;
}

function record(value: unknown): UnknownRecord { return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {}; }
function attendee(data: UnknownRecord): UnknownRecord {
  const attendees = Array.isArray(data.attendees) ? data.attendees : [];
  return record(attendees.find((item) => record(item).type === "invitee") || attendees[0]);
}
function answerFor(attendeeData: UnknownRecord, index: number): string {
  const answers = Array.isArray(attendeeData.customQuestionAnswers) ? attendeeData.customQuestionAnswers : [];
  const answer = record(answers[index]);
  return text(answer.answer);
}

/** Normaliza el contrato publicado por Zcal sin depender de nombres internos de n8n. */
export function normalizeZcalWebhook(payload: unknown): ZcalBooking | null {
  const root = record(payload); const data = record(root.data); const person = attendee(data);
  const booking_id = text(data.id); const event_type = text(root.type);
  if (!booking_id || !["event.created", "event.rescheduled", "event.cancelled"].includes(event_type)) return null;
  const custom = answerFor(person, 2);
  const nestedLinks = record(data.links);
  const management = record(data.managementUrls);
  const location = record(data.location); const online = record(location.onlineMeeting);
  return {
    booking_id, event_type: event_type as ZcalBooking["event_type"], event_created_at: text(root.created_at),
    full_name: text(person.name), email: normalizeEmail(person.email), phone: normalizePhone(person.phoneNumber),
    start_at: text(data.startDate), timezone: text(person.timezone), event_name: text(data.eventName),
    invite_id: text(record(data.invite).id), meeting_topic: custom,
    meeting_url: text(online.url),
    reschedule_url: text(data.rescheduleUrl || nestedLinks.reschedule || management.reschedule),
    cancel_url: text(data.cancelUrl || nestedLinks.cancel || management.cancel),
  };
}

export type TopicDecision = "approved" | "needs_context";
export function evaluateTopic(value: unknown): { decision: TopicDecision; reason: string } {
  const topic = fold(value);
  const generic = new Set(["nada", "no se", "nose", "ninguno", "ninguna", "x", "hola", "informacion", "info", "asesoria", "test"]);
  const hostile = ["no me interesa", "no quiero reunion", "cancelar", "es una broma", "fraude", "estafa", "matar", "muerte", "amenaza", "idiota", "imbecil", "mierda"];
  if (!topic) return { decision: "needs_context", reason: "missing_meeting_topic" };
  if (topic.length < 12 || generic.has(topic) || /(.)\1{5,}/.test(topic)) return { decision: "needs_context", reason: "low_quality_meeting_topic" };
  if (hostile.some((phrase) => topic.includes(phrase))) return { decision: "needs_context", reason: "unsafe_meeting_topic" };
  return { decision: "approved", reason: "" };
}

function decodeKey(encoded: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}
export async function encryptSecret(value: string, key: string): Promise<string> {
  if (!value) return "";
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await decodeKey(key), new TextEncoder().encode(value));
  return `${btoa(String.fromCharCode(...iv))}.${btoa(String.fromCharCode(...new Uint8Array(encrypted)))}`;
}
export async function decryptSecret(value: string, key: string): Promise<string> {
  const [iv64, body64] = value.split("."); if (!iv64 || !body64) throw new Error("invalid encrypted value");
  const iv = Uint8Array.from(atob(iv64), (c) => c.charCodeAt(0)); const body = Uint8Array.from(atob(body64), (c) => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await decodeKey(key), body);
  return new TextDecoder().decode(decrypted);
}

export async function verifyZcalSignature(raw: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const normalized = signature.replace(/^sha256=/i, "").trim().toLowerCase();
  return constantTimeEqual(normalized, hex);
}

export async function signActionToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded)));
  return `${encoded}.${btoa(String.fromCharCode(...sig))}`;
}
export async function verifyActionToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const [encoded, received] = token.split("."); if (!encoded || !received || !secret) return null;
  const expected = await signActionToken(JSON.parse(decodeURIComponent(escape(atob(encoded)))) as Record<string, unknown>, secret);
  const signature = expected.split(".")[1];
  if (!signature || !constantTimeEqual(signature, received)) return null;
  try { const value = JSON.parse(decodeURIComponent(escape(atob(encoded)))) as Record<string, unknown>; return Number(value.exp || 0) > Date.now() ? value : null; } catch { return null; }
}
