-- Sincroniza en git lo que ya está vivo en Supabase pero nunca quedó en una
-- migración (aplicado directo por API, en esta sesión y en otra en paralelo).
-- Sin esto, levantar el proyecto desde los archivos de supabase/migrations/
-- da un esquema incompleto. Todo acá es create-or-replace / if-not-exists:
-- reaplicar no rompe nada.

-- ── status: 'pending'/'synced' -> vocabulario de negocio ────────────────────
update public."leads-xb" set status = 'lead' where status = 'pending';
update public."leads-xb" set status = 'lead_validado' where status = 'synced';
alter table public."leads-xb" alter column status set default 'lead';
alter table public."leads-xb" drop constraint if exists leads_xb_status_chk;
alter table public."leads-xb" add constraint leads_xb_status_chk
  check (status in ('lead','syncing','lead_validado','error'));

-- ── valor_diagnostico: tier (alto/mediano/bajo) para tags de Odoo + WhatsApp ─
alter table public."leads-xb" add column if not exists valor_diagnostico text;

create or replace function public.diag_mark_synced(
  p_lead_id text, p_odoo_lead_id text default null,
  p_action text default null, p_error text default null
) returns void language sql as $$
  update public."leads-xb" set
    status         = case when p_error is not null and p_error <> '' then 'error' else 'lead_validado' end,
    odoo_lead_id   = coalesce(nullif(p_odoo_lead_id,''), odoo_lead_id),
    odoo_lead_action = coalesce(nullif(p_action,''), odoo_lead_action),
    odoo_synced_at = now(),
    sync_error     = nullif(p_error,'')
  where lead_id = p_lead_id;
$$;

-- ── diag_compute_intension: overload con p_valor (tier decide needs_info vs
--    not_ready cuando no hay señal explícita de ruta/zoom) ──────────────────
create or replace function public.diag_compute_intension(p_route text, p_wants_zoom text, p_valor text default null)
returns text language plpgsql immutable as $$
begin
  if lower(coalesce(p_route, '')) like '%advisor%'
     or lower(coalesce(p_route, '')) = 'zcal'
     or lower(coalesce(p_wants_zoom, '')) in ('yes', 'si', 'sí') then
    return 'Sí, quiero analizar mi caso con un experto';
  end if;

  if p_valor = 'alto' then
    return 'Sí, quiero analizar mi caso con un experto';
  elsif p_valor = 'bajo' then
    return 'No estoy listo para agendar, prefiero explorar primero';
  end if;

  return 'Primero quiero entender un poco más';
end;
$$;

-- ── diag_build_odoo_payload: fuente compuesta "Diagnóstico A/B · Red",
--    valor_diagnostico, previous_odoo_lead_id, y diagnostico en texto plano
--    (antes mandaba el jsonb de respuestas -> Odoo mostraba "[object Object]") ─
create or replace function public.diag_build_odoo_payload(p_lead_id text)
returns jsonb language sql stable as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'Full_name',        l.full_name,
    'email',            l.email,
    'phone',            l.phone_e164,
    'whatsapp_phone',   l.phone_e164,
    'objetivo',         l.goal_label,
    'intension',        public.diag_compute_intension(l.route, (l.raw_payload->>'wants_zoom_meeting'), l.valor_diagnostico),
    'id_lead_ads',      l.lead_id,
    'id_formulario',    (l.raw_payload->>'id_formulario'),
    'fuente',           'Diagnóstico ' || upper(l.landing_variant) || (case when coalesce(l.source, '') <> '' then ' · ' || l.source else '' end),
    'pais',             l.country_iso,
    'ad_id',            l.ad_id,
    'adgroup_id',       l.adgroup_id,
    'campaign_id',      l.campaign_id,
    'campaign_name',    l.campaign_name,
    'created_time',     l.event_time::text,
    'lead_id',          l.lead_id,
    'session_id',       l.session_id,
    'ab_variant',       l.landing_variant,
    'conversion_path',  l.conversion_path,
    'form_type',        l.form_type,
    'main_goal',        l.goal,
    'wants_zoom_meeting',(l.raw_payload->>'wants_zoom_meeting'),
    'landing_reference',l.landing_reference,
    'source',           'Diagnóstico ' || upper(l.landing_variant) || (case when coalesce(l.source, '') <> '' then ' · ' || l.source else '' end),
    'page_url',         l.page_url,
    'page_name',        l.page_name,
    'utm_source',       l.utm_source,
    'utm_medium',       l.utm_medium,
    'utm_campaign',     l.utm_campaign,
    'utm_content',      l.utm_content,
    'utm_term',         l.utm_term,
    'ttclid',           l.ttclid,
    'fbclid',           l.fbclid,
    'gclid',            l.gclid,
    'event_id',         l.event_id,
    'crm_event_name',   l.crm_event_name,
    'crm_event_id',     l.crm_event_id,
    'lead_temp',        l.lead_temp,
    'diag_stage_id',    l.diag_stage_id,
    'valor_diagnostico',l.valor_diagnostico,
    'persona',          l.persona,
    'previous_odoo_lead_id', l.odoo_lead_id,
    'diagnostico',      coalesce(l.raw_payload->>'diagnostico', 'Sin respuestas registradas.')
  ))
  from public."leads-xb" l
  where l.lead_id = p_lead_id;
$$;
