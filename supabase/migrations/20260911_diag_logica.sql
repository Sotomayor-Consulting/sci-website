-- Lógica de negocio del Diagnóstico LLC movida a Supabase.
-- El Cloudflare Function queda fino (recibe POST, valida, inserta filas crudas,
-- dispara CAPI). Postgres se encarga de: catálogo de preguntas A/B, normalización
-- de la fila, cálculo de intención, consolidación de respuestas y armado +
-- envío del payload a Odoo (vía n8n con pg_net).

create extension if not exists pg_net;

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Config (URL del webhook n8n chico, etc.) — editable sin ALTER DATABASE
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.diagnostico_config (
  key   text primary key,
  value text,
  updated_at timestamptz not null default now()
);
insert into public.diagnostico_config (key, value) values
  ('n8n_odoo_sync_url', 'PENDIENTE'),          -- setear al crear el flujo chico "leads-xb-odoo-sync"
  ('odoo_sync_enabled', 'false')               -- 'true' para activar el trigger AFTER INSERT
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Catálogo relacional de preguntas + opciones (A y B)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.diagnostico_questions (
  landing_variant text not null check (landing_variant in ('a','b')),
  question_key    text not null,                -- 'filter' | 'q2'..'q6'
  question_index  int  not null check (question_index between 1 and 6),
  stem            text not null,
  subtitle        text,
  affects_stage   boolean not null default false, -- entra en el promedio de etapa/riesgo
  primary key (landing_variant, question_key)
);

create table if not exists public.diagnostico_question_options (
  id              bigint generated always as identity primary key,
  landing_variant text not null,
  question_key    text not null,
  sort            int  not null,
  option_value    text not null,                -- valor crudo del radio
  option_label    text not null,
  insight         text,
  score           int,                          -- 1..4 cuando el valor es numérico
  foreign key (landing_variant, question_key)
    references public.diagnostico_questions (landing_variant, question_key) on delete cascade,
  unique (landing_variant, question_key, sort)
);
create index if not exists diag_qopt_lookup_idx
  on public.diagnostico_question_options (landing_variant, question_key, option_value);

-- ── Variante A ──────────────────────────────────────────────────────────────
insert into public.diagnostico_questions (landing_variant, question_key, question_index, stem, subtitle, affects_stage) values
  ('a','filter',1,'¿A qué se dedica (o se va a dedicar) tu negocio?',null,false),
  ('a','q2',2,'¿En qué punto está tu negocio hoy?','De esto depende si necesitas la estructura ya o si puedes esperar.',true),
  ('a','q3',3,'¿Qué es lo que más te apura resolver?','Marca lo que te tiene detenido hoy.',false),
  ('a','q4',4,'¿Cuánto factura (o va a facturar) tu negocio al año?','Un rango aproximado basta. Define qué tan afinada tiene que estar tu parte fiscal.',true),
  ('a','q5',5,'¿Para dónde quieres llevar esto en 3 años?','La estructura de hoy tiene que aguantar el negocio de mañana.',true),
  ('a','q6',6,'Última pregunta: ¿qué parte de tu operación te consume más tiempo?','La estructura resuelve lo legal. Dinos qué más te frena y te decimos si podemos quitártelo de encima.',false)
on conflict do nothing;

insert into public.diagnostico_question_options (landing_variant, question_key, sort, option_value, option_label, score) values
  ('a','filter',1,'Servicios','Servicios, consultoría o freelance',null),
  ('a','filter',2,'Inversiones','Bienes raíces, trading o inversiones',null),
  ('a','filter',3,'Ecom','E-commerce, dropshipping o Amazon',null),
  ('a','filter',4,'Otro','Otra cosa, o todavía no lo tengo claro',null),
  ('a','q2',1,'4','Ya tengo una empresa en EE. UU. y quiero revisarla o mejorarla',4),
  ('a','q2',2,'3','Opero formal en mi país y quiero expandirme a EE. UU.',3),
  ('a','q2',3,'2','Ya tengo clientes y ventas, pero facturo a nombre propio',2),
  ('a','q2',4,'1','Todavía estoy validando la idea',1),
  ('a','q3',1,'cobros','Poder cobrar en dólares sin trabas',null),
  ('a','q3',2,'orden','Corregir mi empresa antes de que un error me pase factura',null),
  ('a','q3',3,'impuestos','Pagar menos impuestos, de forma legal',null),
  ('a','q3',4,'explorando','Nada urgente — estoy viendo opciones',null),
  ('a','q4',1,'4','Más de USD 250.000',4),
  ('a','q4',2,'3','Entre USD 50.000 y 250.000',3),
  ('a','q4',3,'2','Entre USD 10.000 y 50.000',2),
  ('a','q4',4,'1','Menos de USD 10.000',1),
  ('a','q5',1,'4','Construir una empresa grande, o venderla',4),
  ('a','q5',2,'4','Proteger tu patrimonio y diversificar',4),
  ('a','q5',3,'2','Vivir de esto sin depender de nadie',2),
  ('a','q5',4,'1','Un ingreso extra, sin que te robe tiempo',1),
  ('a','q6',1,'pagos','Cobrar y cuadrar los pagos a mano',null),
  ('a','q6',2,'automatizacion','Dar seguimiento, mandar recordatorios, armar reportes',null),
  ('a','q6',3,'sistema','Saltar entre correos, hojas de cálculo y apps sueltas',null),
  ('a','q6',4,'ninguno','Nada — solo quiero la estructura lista',null)
on conflict do nothing;

-- ── Variante B ──────────────────────────────────────────────────────────────
insert into public.diagnostico_questions (landing_variant, question_key, question_index, stem, subtitle, affects_stage) values
  ('b','filter',1,'¿Qué te preocupa de tu LLC?',null,false),
  ('b','q2',2,'¿Cómo armaste tu LLC?','Esto suele decir mucho de qué tan bien quedó puesta.',true),
  ('b','q3',3,'¿Qué es lo que más te apura resolver?','Marca lo que te tiene con la duda hoy.',false),
  ('b','q4',4,'¿Cuánto factura tu LLC al año?','Un rango aproximado basta. Define el tamaño de la exposición fiscal.',true),
  ('b','q5',5,'¿Qué quieres hacer con tu LLC?','La corrección de hoy depende de a dónde la lleves.',true),
  ('b','q6',6,'Última pregunta: ¿qué parte de tu operación te consume más tiempo?','La revisión resuelve lo legal. Dinos qué más te frena y te decimos si podemos quitártelo de encima.',false)
on conflict do nothing;

insert into public.diagnostico_question_options (landing_variant, question_key, sort, option_value, option_label, score) values
  ('b','filter',1,'Cumplimiento','Reportes o impuestos atrasados (5472, 1120, BOI)',null),
  ('b','filter',2,'Retiros','Sacar dinero de mi LLC para uso personal sin problemas fiscales',null),
  ('b','filter',3,'Estado','Estar en el estado equivocado (franchise tax, costos de más)',null),
  ('b','filter',4,'Banca','Problemas con el banco o las pasarelas de pago',null),
  ('b','filter',5,'Revision','No estoy seguro — quiero que la revisen completa',null),
  ('b','q2',1,'4','Con un servicio online exprés, sin asesoría',4),
  ('b','q2',2,'3','Con un contador o gestor que no era especialista en EE. UU.',3),
  ('b','q2',3,'2','Con una firma, pero ya no me da soporte',2),
  ('b','q2',4,'1','Con una firma que todavía me da mantenimiento',1),
  ('b','q3',1,'multa','Tengo reportes o impuestos atrasados y no sé mi exposición',null),
  ('b','q3',2,'banca','El banco o Stripe me pidieron algo y no sé qué responder',null),
  ('b','q3',3,'estado','Pago costos del estado que creo que no me tocan',null),
  ('b','q3',4,'revision','Nada urgente — quiero que la revisen y me digan',null),
  ('b','q4',1,'4','Más de USD 250.000',4),
  ('b','q4',2,'3','Entre USD 50.000 y 250.000',3),
  ('b','q4',3,'2','Entre USD 10.000 y 50.000',2),
  ('b','q4',4,'1','Poco o nada — casi no la uso',1),
  ('b','q5',1,'4','Ordenarla del todo y dejarla lista para crecer o vender',4),
  ('b','q5',2,'4','Protegerla: que no me la disuelvan ni me bloqueen la banca',4),
  ('b','q5',3,'2','Mantenerla al día sin complicarme',2),
  ('b','q5',4,'1','Cerrarla o migrarla — ya casi no la uso',1),
  ('b','q6',1,'pagos','Cobrar y cuadrar los pagos a mano',null),
  ('b','q6',2,'automatizacion','Dar seguimiento, mandar recordatorios, armar reportes',null),
  ('b','q6',3,'sistema','Saltar entre correos, hojas de cálculo y apps sueltas',null),
  ('b','q6',4,'ninguno','Nada — solo quiero la LLC en orden',null)
on conflict do nothing;

-- goal key -> etiqueta legible (columna `objetivo` en Odoo)
create table if not exists public.diagnostico_goals (
  goal_key text primary key,
  label    text not null
);
insert into public.diagnostico_goals (goal_key, label) values
  ('llc_nueva','Abrir una LLC nueva'),
  ('ordenar_llc','Ordenar / optimizar una LLC existente'),
  ('inversion_patrimonio','Proteger patrimonio / inversión'),
  ('banca_pagos','Facilitar cobros y pagos globales'),
  ('cumplimiento','Poner al día el cumplimiento (5472 / 1120 / BOI)'),
  ('cambio_estado','Cambiar el estado de constitución'),
  ('retiros_utilidades','Retirar utilidades sin problema fiscal')
on conflict (goal_key) do update set label = excluded.label;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Funciones de normalización / cálculo
-- ─────────────────────────────────────────────────────────────────────────────

-- Frase LITERAL que el nodo `intension` del subworkflow Odoo string-matchea.
create or replace function public.diag_compute_intension(p_route text, p_wants_zoom text)
returns text language sql immutable as $$
  select case
    when lower(coalesce(p_route,'')) like '%advisor%'
      or lower(coalesce(p_route,'')) = 'zcal'
      or lower(coalesce(p_wants_zoom,'')) in ('yes','si','sí')
      then 'Sí, quiero analizar mi caso con un experto'
    else 'Primero quiero entender un poco más'
  end;
$$;

create or replace function public.diag_normalize_phone(p_raw text, p_country text)
returns text language plpgsql immutable as $$
declare
  d     text := regexp_replace(coalesce(p_raw,''), '\D', '', 'g');
  hint  text := upper(coalesce(p_country,''));
  intl  text;
  rest  text;
  n     text;
  code  text;
  codes text[] := array['591','593','502','506','507','598','1','34','51','52','54','55','56','57','58'];
begin
  if d = '' then return ''; end if;

  -- Argentina WhatsApp: +549 sin el 15
  if hint = 'AR' or p_raw ~ '^\+?54' or d ~ '^0?(11|2\d{2,3}|3\d{2,3})' then
    n := d;
    if left(n,2) = '00' then n := substr(n,3); end if;
    if left(n,2) = '54' then n := substr(n,3); end if;
    if left(n,1) = '0'  then n := substr(n,2); end if;
    if left(n,1) = '9'  then n := substr(n,2); end if;
    if length(n) between 12 and 13 and substr(n,3,2) = '15' then n := substr(n,1,2) || substr(n,5);
    elsif length(n) between 13 and 14 and substr(n,4,2) = '15' then n := substr(n,1,3) || substr(n,6);
    end if;
    if length(n) between 10 and 11 then return '+549' || n; end if;
  end if;

  if p_raw ~ '^\+' then
    intl := '+' || d;
  elsif left(d,2) = '00' then
    intl := '+' || substr(d,3);
  else
    intl := null;
    foreach code in array codes loop
      if left(d, length(code)) = code then intl := '+' || d; exit; end if;
    end loop;
    if intl is null then intl := '+' || d; end if;
  end if;

  -- México WhatsApp: móvil 10 dígitos -> +521
  if hint = 'MX' or intl ~ '^\+52' then
    rest := regexp_replace(intl, '^\+?52', '');
    if left(regexp_replace(intl,'\D','','g'),3) <> '521' and length(rest) = 10 then
      return '+521' || rest;
    end if;
  end if;

  return intl;
end;
$$;

create or replace function public.diag_infer_country(p_phone text)
returns text language plpgsql immutable as $$
declare
  d text := regexp_replace(coalesce(p_phone,''), '^\+', '');
  m text[][] := array[
    array['593','EC'],array['591','BO'],array['502','GT'],array['506','CR'],
    array['507','PA'],array['598','UY'],array['34','ES'],array['51','PE'],
    array['52','MX'],array['54','AR'],array['55','BR'],array['56','CL'],
    array['57','CO'],array['58','VE'],array['1','US']
  ];
  i int;
begin
  if d = '' then return ''; end if;
  for i in 1 .. array_length(m,1) loop
    if left(d, length(m[i][1])) = m[i][1] then return m[i][2]; end if;
  end loop;
  return '';
end;
$$;

create or replace function public.diag_normalize_source(p_ttclid text, p_fbclid text, p_source text)
returns text language sql immutable as $$
  select case
    when coalesce(p_ttclid,'') <> '' then 'TikTok'
    when coalesce(p_fbclid,'') <> '' then 'Meta'
    when lower(coalesce(p_source,'')) ~ 'tik ?tok|tiktok|\mtt\M' then 'TikTok'
    when lower(coalesce(p_source,'')) ~ 'meta|facebook|\mfb\M' then 'Meta'
    else ''
  end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Trigger BEFORE INSERT: completa la fila leads-xb con lo que falte
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.diag_leads_xb_shape()
returns trigger language plpgsql as $$
begin
  new.email := nullif(lower(btrim(coalesce(new.email,''))), '');

  if coalesce(new.full_name,'') = '' then
    new.full_name := nullif(btrim(coalesce(new.first_name,'') || ' ' || coalesce(new.last_name,'')), '');
  end if;

  if new.phone_e164 is null or new.phone_e164 !~ '^\+[1-9]\d{7,14}$' then
    new.phone_e164 := nullif(public.diag_normalize_phone(coalesce(new.phone_raw, new.phone_e164), new.country_iso), '');
  end if;

  if coalesce(new.country_iso,'') = '' then
    new.country_iso := nullif(public.diag_infer_country(new.phone_e164), '');
  end if;

  if coalesce(new.goal_label,'') = '' and coalesce(new.goal,'') <> '' then
    new.goal_label := coalesce((select label from public.diagnostico_goals where goal_key = new.goal),
                               replace(new.goal, '_', ' '));
  end if;

  if coalesce(new.source,'') = '' then
    new.source := nullif(public.diag_normalize_source(new.ttclid, new.fbclid, new.source), '');
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists diag_leads_xb_shape on public."leads-xb";
create trigger diag_leads_xb_shape
  before insert on public."leads-xb"
  for each row execute function public.diag_leads_xb_shape();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Consolidación de respuestas del lead
-- ─────────────────────────────────────────────────────────────────────────────
create or replace view public.v_diagnostico_lead_respuestas as
select
  l.lead_id,
  l.landing_variant,
  l.persona,
  l.email,
  l.phone_e164,
  l.country_iso,
  l.goal,
  l.goal_label,
  l.route,
  l.lead_temp,
  l.diag_stage_id,
  l.status,
  l.odoo_lead_id,
  s.session_id,
  s.max_step_index,
  s.completed_at,
  (
    select jsonb_object_agg(a.question_key, jsonb_build_object(
      'index',  q.question_index,
      'stem',   coalesce(a.question_stem, q.stem),
      'value',  a.answer_value,
      'label',  coalesce(a.answer_label, o.option_label),
      'text',   a.answer_text,
      'score',  o.score
    ) order by q.question_index)
    from public.diagnostico_answers a
    left join public.diagnostico_questions q
      on q.landing_variant = a.landing_variant and q.question_key = a.question_key
    left join lateral (
      select oo.option_label, oo.score
      from public.diagnostico_question_options oo
      where oo.landing_variant = a.landing_variant and oo.question_key = a.question_key
        and oo.option_value = a.answer_value
      order by oo.sort limit 1
    ) o on true
    where a.session_id = s.session_id
  ) as respuestas,
  (
    select round(avg(o.score)::numeric, 2)
    from public.diagnostico_answers a
    join public.diagnostico_questions q
      on q.landing_variant = a.landing_variant and q.question_key = a.question_key and q.affects_stage
    join lateral (
      select oo.score
      from public.diagnostico_question_options oo
      where oo.landing_variant = a.landing_variant and oo.question_key = a.question_key
        and oo.option_value = a.answer_value and oo.score is not null
      order by oo.sort limit 1
    ) o on true
    where a.session_id = s.session_id
  ) as score_promedio
from public."leads-xb" l
left join public.diagnostico_sessions s on s.lead_id = l.lead_id
where not l.test;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Payload de Odoo (input exacto del Start de dfVrD8ave246iDtY) + envío a n8n
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.diag_build_odoo_payload(p_lead_id text)
returns jsonb language sql stable as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'Full_name',        l.full_name,
    'email',            l.email,
    'phone',            l.phone_e164,
    'whatsapp_phone',   l.phone_e164,
    'objetivo',         l.goal_label,
    'intension',        public.diag_compute_intension(l.route, (l.raw_payload->>'wants_zoom_meeting')),
    'id_lead_ads',      l.lead_id,
    'id_formulario',    (l.raw_payload->>'id_formulario'),
    'fuente',           l.source,
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
    'source',           l.source,
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
    'persona',          l.persona,
    'diagnostico',      (select respuestas from public.v_diagnostico_lead_respuestas r where r.lead_id = l.lead_id)
  ))
  from public."leads-xb" l
  where l.lead_id = p_lead_id;
$$;

-- Dispara el flujo n8n chico (Odoo). pg_net es async: no bloquea el commit.
create or replace function public.diag_push_to_odoo(p_lead_id text)
returns bigint language plpgsql as $$
declare
  v_url text := (select value from public.diagnostico_config where key = 'n8n_odoo_sync_url');
  v_on  text := (select value from public.diagnostico_config where key = 'odoo_sync_enabled');
  v_req bigint;
begin
  if coalesce(v_on,'false') <> 'true' or coalesce(v_url,'PENDIENTE') = 'PENDIENTE' then
    return null; -- dormido hasta configurar
  end if;
  select net.http_post(
    url     := v_url,
    body    := public.diag_build_odoo_payload(p_lead_id),
    headers := '{"Content-Type": "application/json"}'::jsonb
  ) into v_req;
  update public."leads-xb"
     set status = 'syncing', sync_attempts = sync_attempts + 1
   where lead_id = p_lead_id;
  return v_req;
end;
$$;

-- El flujo n8n chico llama esto al terminar (RPC) para cerrar el ciclo.
create or replace function public.diag_mark_synced(
  p_lead_id text, p_odoo_lead_id text default null,
  p_action text default null, p_error text default null
) returns void language sql as $$
  update public."leads-xb" set
    status         = case when p_error is not null and p_error <> '' then 'error' else 'synced' end,
    odoo_lead_id   = coalesce(nullif(p_odoo_lead_id,''), odoo_lead_id),
    odoo_lead_action = coalesce(nullif(p_action,''), odoo_lead_action),
    odoo_synced_at = now(),
    sync_error     = nullif(p_error,'')
  where lead_id = p_lead_id;
$$;

-- Trigger AFTER INSERT: encola el envío a Odoo (inerte hasta odoo_sync_enabled='true').
create or replace function public.diag_leads_xb_sync()
returns trigger language plpgsql as $$
begin
  if not new.test then
    perform public.diag_push_to_odoo(new.lead_id);
  end if;
  return null;
end;
$$;

drop trigger if exists diag_leads_xb_sync on public."leads-xb";
create trigger diag_leads_xb_sync
  after insert on public."leads-xb"
  for each row execute function public.diag_leads_xb_sync();
