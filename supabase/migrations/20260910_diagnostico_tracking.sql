-- Tracking del Diagnóstico LLC (A y B): respuestas por lead + embudo de abandono.
--
-- Relación:
--   "leads-xb" (1) ──< diagnostico_sessions (1) ──< diagnostico_answers   (1 por pregunta)
--                                            (1) ──< diagnostico_events   (log append-only, opcional)
--
-- diagnostico_sessions se crea ANTES de tener lead (sesión anónima por session_id),
-- así se mide a quien abandona sin llegar al gate. lead_id se rellena al convertir.
--
-- Índice de pasos (step_index):
--   0 hero · 1 P1 modelo/filter · 2 nombre · 3 P2/q2 · 4 P3/q3 · 5 P4/q4
--   6 P5/q5 · 7 P6/q6 · 8 gate · 9 resultado

create extension if not exists moddatetime schema extensions;

drop view  if exists public.v_diagnostico_funcion_embudo cascade;
drop table if exists public.diagnostico_events   cascade;
drop table if exists public.diagnostico_answers  cascade;
drop table if exists public.diagnostico_sessions cascade;

-- ── columna de QA en leads-xb (test rows fuera de Odoo / CAPI) ──────────────
alter table public."leads-xb" add column if not exists test boolean not null default false;

-- ── 1. sesión del quiz (una por session_id, anónima hasta el gate) ──────────
create table public.diagnostico_sessions (
  session_id        text primary key,               -- getOrCreateSessionId() de la landing
  landing_variant   text not null,                  -- 'a' | 'b'
  persona           text,                           -- 'sin_llc' | 'llc_existente'
  page_name         text,
  lead_id           text references public."leads-xb"(lead_id) on delete set null,

  started_at        timestamptz not null default now(),
  last_seen_at      timestamptz not null default now(),
  completed_at      timestamptz,                    -- set en gate_submit
  last_step_index   int  not null default 0,        -- paso actual (baja con "Atrás")
  last_step_id      text,
  max_step_index    int  not null default 0,        -- paso más lejano alcanzado (monótono)
  max_step_id       text,
  answers_count     int  not null default 0,

  -- contexto capturado al cargar
  source            text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  ttclid text, fbclid text, gclid text,
  hook              text,                           -- ?hook= del message-match
  first_hook_question text,                         -- P1 preseleccionada por el hook
  referrer          text,
  user_agent        text,
  country_iso       text,
  device            text,                           -- 'mobile' | 'desktop'

  test              boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint diag_sessions_variant_chk check (landing_variant in ('a','b'))
);

create index diag_sessions_variant_idx   on public.diagnostico_sessions (landing_variant, created_at desc);
create index diag_sessions_maxstep_idx   on public.diagnostico_sessions (landing_variant, max_step_index);
create index diag_sessions_open_idx      on public.diagnostico_sessions (last_seen_at) where completed_at is null;
create index diag_sessions_lead_idx      on public.diagnostico_sessions (lead_id) where lead_id is not null;

create trigger diag_sessions_set_updated_at
  before update on public.diagnostico_sessions
  for each row execute function extensions.moddatetime (updated_at);

-- ── 2. respuestas consolidadas (1 fila por pregunta; upsert si re-responde) ──
create table public.diagnostico_answers (
  id              bigint generated always as identity primary key,
  session_id      text not null references public.diagnostico_sessions(session_id) on delete cascade,
  landing_variant text not null,                    -- denormalizado
  lead_id         text,                             -- denormalizado, null hasta conversión

  question_key    text not null,                    -- 'filter' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'
  question_index  int  not null,                    -- 1..6
  question_stem   text,                             -- enunciado mostrado (el copy cambia entre fases)
  answer_value    text,                             -- valor crudo del radio ('4', 'Retiros', ...)
  answer_label    text,                             -- etiqueta legible mostrada
  answer_text     text,                             -- el *_text que la landing ya guarda

  answered_at     timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint diag_answers_variant_chk check (landing_variant in ('a','b')),
  constraint diag_answers_qidx_chk    check (question_index between 1 and 6),
  unique (session_id, question_key)
);

create index diag_answers_variant_q_idx on public.diagnostico_answers (landing_variant, question_index);
create index diag_answers_lead_idx      on public.diagnostico_answers (lead_id) where lead_id is not null;
create index diag_answers_value_idx     on public.diagnostico_answers (landing_variant, question_key, answer_value);

create trigger diag_answers_set_updated_at
  before update on public.diagnostico_answers
  for each row execute function extensions.moddatetime (updated_at);

-- ── 3. log de eventos (opcional: tiempo por paso, tasa de "Atrás") ──────────
create table public.diagnostico_events (
  id              bigint generated always as identity primary key,
  session_id      text not null references public.diagnostico_sessions(session_id) on delete cascade,
  landing_variant text not null,
  seq             int  not null,                    -- contador incremental del cliente
  step_index      int  not null,
  step_id         text not null,
  event_type      text not null,                    -- view | answer | back | gate_view |
                                                    -- gate_submit | result_view | cta_click | abandon_beacon
  question_key    text,
  answer_value    text,
  dwell_ms        int,                              -- tiempo en el paso previo
  occurred_at     timestamptz not null default now(),

  constraint diag_events_variant_chk check (landing_variant in ('a','b'))
);

create index diag_events_session_idx on public.diagnostico_events (session_id, seq);
create index diag_events_variant_idx on public.diagnostico_events (landing_variant, step_index, event_type);

-- ── vista de embudo: % que llega y % que abandona en cada paso ──────────────
create view public.v_diagnostico_funcion_embudo as
select
  landing_variant,
  max_step_index,
  coalesce(max_step_id, '') as max_step_id,
  count(*)                                            as sesiones,
  count(*) filter (where completed_at is not null)    as completaron,
  count(*) filter (where completed_at is null)        as abandonaron,
  round(100.0 * count(*) filter (where completed_at is null) / nullif(count(*), 0), 1) as pct_abandono_en_paso
from public.diagnostico_sessions
where not test
group by landing_variant, max_step_index, max_step_id
order by landing_variant, max_step_index;

-- ── RLS: activado, sin políticas. Solo SERVICE_ROLE_KEY (el Function). ──────
alter table public.diagnostico_sessions enable row level security;
alter table public.diagnostico_answers  enable row level security;
alter table public.diagnostico_events   enable row level security;
