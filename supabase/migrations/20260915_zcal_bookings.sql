-- Registro privado e idempotente de eventos Zcal. Las URLs de gesti\u00f3n se guardan cifradas
-- por la Function (AES-GCM); nunca se exponen desde PostgREST al navegador.
create extension if not exists moddatetime schema extensions;

create table if not exists public.zcal_bookings (
  booking_id text primary key,
  event_type text not null check (event_type in ('event.created','event.rescheduled','event.cancelled')),
  event_created_at timestamptz,
  full_name text,
  email_normalized text,
  phone_normalized text,
  start_at timestamptz,
  timezone text,
  event_name text,
  invite_id text,
  meeting_topic text,
  meeting_url text,
  reschedule_url_encrypted text,
  cancel_url_encrypted text,
  payload_sha256 text not null,
  processing_mode text not null default 'shadow' check (processing_mode in ('shadow','canary','live')),
  status text not null default 'received',
  decision text,
  decision_reason text,
  odoo_lead_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zcal_bookings_match_idx on public.zcal_bookings (email_normalized, start_at);
create index if not exists zcal_bookings_phone_idx on public.zcal_bookings (phone_normalized);
drop trigger if exists zcal_bookings_set_updated_at on public.zcal_bookings;
create trigger zcal_bookings_set_updated_at before update on public.zcal_bookings
for each row execute function extensions.moddatetime(updated_at);
alter table public.zcal_bookings enable row level security;
