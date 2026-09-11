// NormalizedLead -> fila de la tabla Supabase "leads-xb".

import type { NormalizedLead } from "./normalize.ts";

export function toLeadRow(lead: NormalizedLead, rawPayload: unknown): Record<string, unknown> {
  return {
    lead_id: lead.lead_id,
    session_id: lead.session_id || null,
    first_name: lead.first_name || null,
    last_name: lead.last_name || null,
    full_name: lead.full_name || null,
    email: lead.email || null,
    phone_e164: lead.phone_e164 || null,
    phone_raw: lead.phone_raw || null,
    country_iso: lead.country_iso || null,
    consent: lead.consent,

    landing_variant: lead.landing_variant,
    persona: lead.persona || null,
    page_name: lead.page_name || null,
    page_url: lead.page_url || null,
    landing_reference: lead.landing_reference || null,
    landing_version: lead.landing_version || null,
    form_type: lead.form_type || null,
    conversion_path: lead.conversion_path || null,
    event_name: lead.event_name || null,

    diag_stage_id: lead.diag_stage_id,
    diag_stage_title: lead.diag_stage_title || null,
    lead_temp: lead.lead_temp || null,
    goal: lead.goal || null,
    goal_label: lead.goal_label || null,
    route: lead.route || null,
    chosen_path: lead.chosen_path || null,
    diag: lead.diag,

    source: lead.source || null,
    utm_source: lead.utm_source || null,
    utm_medium: lead.utm_medium || null,
    utm_campaign: lead.utm_campaign || null,
    utm_content: lead.utm_content || null,
    utm_term: lead.utm_term || null,
    ttclid: lead.ttclid || null,
    fbclid: lead.fbclid || null,
    gclid: lead.gclid || null,
    ttp: lead.ttp || null,
    fbp: lead.fbp || null,
    fbc: lead.fbc || null,
    ad_id: lead.ad_id || null,
    adgroup_id: lead.adgroup_id || null,
    campaign_id: lead.campaign_id || null,

    event_id: lead.event_id || null,
    crm_event_name: lead.crm_event_name,
    crm_event_id: lead.crm_event_id || null,
    event_time: lead.event_time,

    status: "pending",
    test: lead.test,
    raw_payload: rawPayload,
  };
}
