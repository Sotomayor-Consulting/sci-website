-- leads-xb : captura de leads del Diagnóstico LLC (variantes A y B)
-- Fuente de verdad previa a Odoo. La escribe functions/api/diagnostico-lead.ts
-- con la SERVICE_ROLE_KEY. Un Database Webhook sobre INSERT (y UPDATE con
-- status='pending') dispara el flujo chico n8n "leads-xb-odoo-sync".
--
-- NOTA: el nombre lleva guion, así que hay que citarlo ("leads-xb") en todo
-- SQL. En PostgREST la ruta es /rest/v1/leads-xb sin comillas.

create extension if not exists moddatetime schema extensions;

-- Rerunnable: descarta el stub vacío creado desde el dashboard.
-- OJO: en producción con datos, quitar este drop y migrar con ALTER.
drop table if exists public."leads-xb" cascade;

create table public."leads-xb" (
  -- identidad / dedup
  id                uuid primary key default gen_random_uuid(),
  lead_id           text unique not null,          -- id de cliente (leadId de la landing)
  session_id        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- contacto
  first_name        text,
  last_name         text,
  full_name         text,
  email             text,
  phone_e164        text,
  phone_raw         text,
  country_iso       text,
  consent           boolean not null default false,

  -- discriminador de landing (distingue A vs B)
  landing_variant   text not null,                 -- 'a' | 'b'
  persona           text,                          -- 'sin_llc' | 'llc_existente'
  page_name         text,
  page_url          text,
  landing_reference text,
  landing_version   text,
  form_type         text,
  conversion_path   text,
  event_name        text,                          -- 'diagnostico_gate_submit', etc.

  -- resultado del diagnóstico (columnas promovidas + blob)
  diag_stage_id     int,
  diag_stage_title  text,
  lead_temp         text,                          -- 'frio' | 'tibio' | 'caliente'
  goal              text,                          -- main_goal (key)
  goal_label        text,                          -- etiqueta legible (objetivo en Odoo)
  route             text,                          -- ruta recomendada por el quiz
  chosen_path       text,
  diag              jsonb,                         -- { industria, etapa, bloqueo, facturacion,
                                                   --   vision, complejidad, tech_interest,
                                                   --   cross_sell, diagnostico_summary }

  -- atribución
  source            text,                          -- 'TikTok' | 'Meta' (normalizado)
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  ttclid            text,
  fbclid            text,
  gclid             text,
  ttp               text,                          -- cookies de pixel (dedup CAPI)
  fbp               text,
  fbc               text,
  ad_id             text,
  adgroup_id        text,
  campaign_id       text,
  campaign_name     text,                          -- lo rellena n8n (enrich) luego

  -- eventos / CAPI server-side
  event_id          text,                          -- compartido pixel navegador <-> CAPI
  crm_event_name    text not null default 'CompleteRegistration',
  crm_event_id      text,
  event_time        bigint,                        -- unix segundos
  client_ip         text,
  client_ua         text,
  capi_tiktok_status text not null default 'pending', -- pending | sent | failed
  capi_meta_status  text not null default 'pending',
  capi_sent_at      timestamptz,

  -- procesamiento downstream (Odoo)
  status            text not null default 'pending',  -- pending | syncing | synced | error
  odoo_lead_id      text,
  odoo_lead_action  text,                          -- create_new | refresh_existing_by_lead_id | ...
  odoo_synced_at    timestamptz,
  sync_error        text,
  sync_attempts     int not null default 0,

  -- calendario (fase posterior, espeja tu-llc-en-usa/confirmed)
  event_calendar    text,                          -- 'lead_agendamiento_confirmado'
  scheduled_at      timestamptz,

  -- crudo para replay / debug
  raw_payload       jsonb not null,

  constraint leads_xb_landing_variant_chk check (landing_variant in ('a','b'))
);

create index leads_xb_status_idx   on public."leads-xb" (status) where status <> 'synced';
create index leads_xb_variant_idx  on public."leads-xb" (landing_variant, created_at desc);
create index leads_xb_email_idx    on public."leads-xb" (email);
create index leads_xb_phone_idx    on public."leads-xb" (phone_e164);
create index leads_xb_capi_idx     on public."leads-xb" (capi_tiktok_status, capi_meta_status)
  where capi_tiktok_status <> 'sent' or capi_meta_status <> 'sent';

create trigger leads_xb_set_updated_at
  before update on public."leads-xb"
  for each row execute function extensions.moddatetime (updated_at);

-- RLS: activado y SIN políticas -> anon/authenticated no ven nada.
-- El Function usa SERVICE_ROLE_KEY, que ignora RLS. El Database Webhook
-- corre como servicio interno, también ignora RLS.
alter table public."leads-xb" enable row level security;
