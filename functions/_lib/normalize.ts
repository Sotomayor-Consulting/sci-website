// Normalización del payload del Diagnóstico LLC (A y B).
// Port de los nodos n8n `clean_dates` + `Normalize Lead Identity` para poder
// sacarlos del workflow. Función pura, sin I/O — corre igual en Workers y en
// `node --test`.

export interface LeadInput {
  [key: string]: unknown;
}

export interface NormalizedLead {
  // identidad
  lead_id: string;
  session_id: string;
  // contacto
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_e164: string; // WhatsApp-ready (+549…, +521… cuando aplica)
  phone_raw: string;
  country_iso: string;
  consent: boolean;
  // landing
  landing_variant: "a" | "b";
  persona: string;
  page_name: string;
  page_url: string;
  landing_reference: string;
  landing_version: string;
  form_type: string;
  conversion_path: string;
  event_name: string;
  // diagnóstico
  diag_stage_id: number | null;
  diag_stage_title: string;
  lead_temp: string;
  goal: string;
  goal_label: string;
  route: string;
  chosen_path: string;
  diag: Record<string, unknown>;
  // atribución
  source: string; // 'TikTok' | 'Meta' | '' (normalizado)
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  ttclid: string;
  fbclid: string;
  gclid: string;
  ttp: string;
  fbp: string;
  fbc: string;
  ad_id: string;
  adgroup_id: string;
  campaign_id: string;
  // eventos / CAPI
  event_id: string;
  crm_event_name: string;
  crm_event_id: string;
  event_time: number;
  // meta
  test: boolean;
}

export interface NormalizeResult {
  lead: NormalizedLead;
  odooInput: Record<string, string>;
  warnings: string[];
}

const COUNTRY_BY_PHONE_CODE: Record<string, string> = {
  "1": "US", "34": "ES", "51": "PE", "52": "MX", "54": "AR", "55": "BR",
  "56": "CL", "57": "CO", "58": "VE", "502": "GT", "506": "CR", "507": "PA",
  "591": "BO", "593": "EC", "598": "UY",
};
const ORDERED_CODES = Object.keys(COUNTRY_BY_PHONE_CODE).sort((a, b) => b.length - a.length);

// quiz key -> etiqueta legible que Odoo guarda en `objetivo`. Cubre A y B.
const GOAL_LABELS: Record<string, string> = {
  llc_nueva: "Abrir una LLC nueva",
  ordenar_llc: "Ordenar / optimizar una LLC existente",
  inversion_patrimonio: "Proteger patrimonio / inversión",
  banca_pagos: "Facilitar cobros y pagos globales",
  cumplimiento: "Poner al día el cumplimiento (5472 / 1120 / BOI)",
  cambio_estado: "Cambiar el estado de constitución",
  retiros_utilidades: "Retirar utilidades sin problema fiscal",
};

// Odoo (nodo `intension`) hace string-match LITERAL sobre estas frases.
const INTENSION_MEETING = "Sí, quiero analizar mi caso con un experto"; // -> ready_for_meeting
const INTENSION_INFO = "Primero quiero entender un poco más"; // -> needs_info

function norm(v: unknown): string {
  return String(v ?? "").replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();
}
function lower(v: unknown): string {
  return norm(v).toLowerCase();
}
function digits(v: unknown): string {
  return norm(v).replace(/\D+/g, "");
}
function first(...vals: unknown[]): string {
  for (const v of vals) {
    const s = norm(v);
    if (s) return s;
  }
  return "";
}
function firstDigits(...vals: unknown[]): string {
  for (const v of vals) {
    const s = digits(v);
    if (s) return s;
  }
  return "";
}

function coerceInternational(raw: string): string {
  const compact = norm(raw).replace(/[^+\d]/g, "");
  if (!compact) return "";
  if (compact.startsWith("+")) return compact;
  const d = compact.replace(/\D+/g, "");
  if (d.startsWith("00")) return `+${d.slice(2)}`;
  for (const code of ORDERED_CODES) {
    if (d.startsWith(code)) return `+${d}`;
  }
  return d ? `+${d}` : "";
}

function argentinaWhatsapp(raw: string, countryHint: string): string {
  const d = digits(raw);
  const looksAr = countryHint === "AR" || /^\+?54/.test(norm(raw)) || /^0?(11|2\d{2,3}|3\d{2,3})/.test(d);
  if (!d || !looksAr) return "";
  let n = d;
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("54")) n = n.slice(2);
  if (n.startsWith("0")) n = n.slice(1);
  if (n.startsWith("9")) n = n.slice(1);
  for (const areaLen of [2, 3, 4]) {
    if (n.length > areaLen + 2 && n.slice(areaLen, areaLen + 2) === "15") {
      n = n.slice(0, areaLen) + n.slice(areaLen + 2);
      break;
    }
  }
  if (n.length < 10 || n.length > 11) return "";
  return `+549${n}`;
}

function whatsappReady(raw: string, countryHint: string): string {
  if (!norm(raw)) return "";
  const ar = argentinaWhatsapp(raw, countryHint);
  if (ar) return ar;
  const intl = coerceInternational(raw);
  const d = intl.replace(/\D+/g, "");
  const isMx = countryHint === "MX" || /^52/.test(d);
  if (isMx) {
    const rest = d.startsWith("52") ? d.slice(2) : d;
    if (!d.startsWith("521") && rest.length === 10) return `+521${rest}`;
  }
  return intl;
}

function inferCountry(phoneE164: string, countryHint: string): string {
  if (countryHint) return countryHint.toUpperCase();
  const d = norm(phoneE164).replace(/^\+/, "");
  for (const code of ORDERED_CODES) {
    if (d.startsWith(code)) return COUNTRY_BY_PHONE_CODE[code];
  }
  return "";
}

function normalizeSource(input: LeadInput): string {
  if (first(input.ttclid)) return "TikTok";
  if (first(input.fbclid)) return "Meta";
  const raw = lower(first(input.source, input.platform, input.channel));
  if (/tik\s*tok|tiktok|\btt\b/.test(raw)) return "TikTok";
  if (/meta|facebook|\bfb\b/.test(raw)) return "Meta";
  return "";
}

function toUnixSeconds(v: unknown): number {
  const raw = norm(v);
  if (/^\d{10}$/.test(raw)) return Number(raw);
  if (/^\d{13}$/.test(raw)) return Math.floor(Number(raw) / 1000);
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : Math.floor(Date.now() / 1000);
}

function intensionFor(route: string, wantsZoom: string): string {
  const r = lower(route);
  const wz = lower(wantsZoom);
  if (r.includes("advisor") || r === "zcal" || wz === "yes" || wz === "si" || wz === "sí") {
    return INTENSION_MEETING;
  }
  return INTENSION_INFO;
}

export function normalizeLead(input: LeadInput): NormalizeResult {
  const warnings: string[] = [];
  const g = (k: string) => first(input[k]);

  const variantRaw = lower(input.landing_variant);
  const landing_variant: "a" | "b" = variantRaw === "b" ? "b" : "a";
  if (variantRaw !== "a" && variantRaw !== "b") warnings.push(`landing_variant inválido: "${variantRaw}" -> "a"`);

  const first_name = first(input.first_name, input.givenName);
  const last_name = first(input.last_name, input.familyName);
  const full_name = first(input.full_name, `${first_name} ${last_name}`.trim());

  // OJO: preferir los campos YA formateados (phone_e164/whatsapp_phone, con código de país)
  // sobre phone_raw (dígitos sueltos, sin código — la landing lo manda aparte del cc).
  // Al revés, whatsappReady() no tiene con qué inferir el país y arma un E.164 roto
  // (bug real visto en producción: "984485408" -> "+984485408" en vez de "+593984485408").
  const phone_source = first(input.phone_e164, input.whatsapp_phone, input.phone_raw, input.phone);
  const phone_raw = first(input.phone_raw, input.phone);
  const country_hint = first(input.country_iso, input.country, input.pais).toUpperCase();
  const phone_e164 = whatsappReady(phone_source, country_hint);
  if (phone_source && !/^\+[1-9]\d{7,14}$/.test(phone_e164)) {
    warnings.push(`phone_e164 no valida E.164: "${phone_e164}"`);
  }
  const country_iso = inferCountry(phone_e164, country_hint);

  const goal = first(input.goal, input.main_goal);
  const goal_label = first(input.goal_label, GOAL_LABELS[goal], goal.replace(/_/g, " "));
  const route = first(input.route);
  const event_time = toUnixSeconds(input.event_time || input.created_at);

  const diag: Record<string, unknown> = {
    industria: g("diag_industria"),
    etapa: g("diag_etapa"),
    bloqueo: g("diag_bloqueo"),
    facturacion: g("diag_facturacion"),
    vision: g("diag_vision"),
    complejidad: g("diag_complejidad"),
    tech_interest: g("tech_interest"),
    cross_sell: g("cross_sell"),
    diagnostico_summary: g("diagnostico"),
  };

  const stageRaw = norm(input.diag_stage_id);
  const lead: NormalizedLead = {
    lead_id: first(input.lead_id, input.id_cliente, input.id_diagnostico),
    session_id: g("session_id"),
    first_name, last_name, full_name,
    email: lower(input.email),
    phone_e164, phone_raw,
    country_iso,
    consent: input.consent === true || lower(input.consent) === "true",
    landing_variant,
    persona: g("persona"),
    page_name: first(input.page_name, input.landing_reference),
    page_url: g("page_url"),
    landing_reference: g("landing_reference"),
    landing_version: g("landing_version"),
    form_type: g("form_type"),
    conversion_path: g("conversion_path"),
    event_name: g("event_name"),
    diag_stage_id: stageRaw ? Number(stageRaw) : null,
    diag_stage_title: g("diag_stage_title"),
    lead_temp: g("lead_temp"),
    goal, goal_label, route,
    chosen_path: g("chosen_path"),
    diag,
    source: normalizeSource(input),
    utm_source: g("utm_source"),
    utm_medium: g("utm_medium"),
    utm_campaign: g("utm_campaign"),
    utm_content: g("utm_content"),
    utm_term: g("utm_term"),
    ttclid: g("ttclid"),
    fbclid: g("fbclid"),
    gclid: g("gclid"),
    ttp: g("ttp"),
    fbp: g("fbp"),
    fbc: g("fbc"),
    ad_id: firstDigits(input.ad_id, input.id_anuncio),
    adgroup_id: firstDigits(input.adgroup_id, input.id_adgroup),
    campaign_id: firstDigits(input.campaign_id, input.id_campaign),
    event_id: first(input.event_id, input.crm_event_id, input.form_submit_event_id),
    crm_event_name: first(input.crm_event_name, "CompleteRegistration"),
    crm_event_id: first(input.crm_event_id, input.event_id),
    event_time,
    test: input.test === true || lower(input.test) === "true",
  };

  // Entrada para el subworkflow Odoo `dfVrD8ave246iDtY` (nodo Start).
  const odooInput: Record<string, string> = {
    Full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone_e164,
    whatsapp_phone: lead.phone_e164,
    objetivo: lead.goal_label,
    intension: intensionFor(lead.route, first(input.wants_zoom_meeting)),
    id_lead_ads: lead.lead_id,
    id_formulario: first(input.id_formulario, input.form_id),
    fuente: lead.source,
    pais: lead.country_iso,
    ad_id: lead.ad_id,
    adgroup_id: lead.adgroup_id,
    campaign_id: lead.campaign_id,
    campaign_name: g("campaign_name"),
    created_time: String(lead.event_time),
    lead_id: lead.lead_id,
    session_id: lead.session_id,
    ab_variant: lead.landing_variant,
    conversion_path: lead.conversion_path,
    form_type: lead.form_type,
    main_goal: lead.goal,
    business_objective: g("business_objective"),
    business_objective_label: g("business_objective_label"),
    business_objective_other: g("business_objective_other"),
    wants_zoom_meeting: first(input.wants_zoom_meeting),
    wants_zoom_meeting_label: g("wants_zoom_meeting_label"),
    landing_reference: lead.landing_reference,
    source: lead.source,
    page_url: lead.page_url,
    page_name: lead.page_name,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content,
    utm_term: lead.utm_term,
    ttclid: lead.ttclid,
    fbclid: lead.fbclid,
    gclid: lead.gclid,
    event_id: lead.event_id,
    crm_event_name: lead.crm_event_name,
    crm_event_id: lead.crm_event_id,
  };

  return { lead, odooInput, warnings };
}
