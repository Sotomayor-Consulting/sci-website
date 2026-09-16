-- Tokens de gestión de reserva: hash persistido y consumo atómico (un solo uso).
create table if not exists public.zcal_action_tokens (
  token_hash text primary key,
  booking_id text not null,
  action text not null check (action in ('reschedule','cancel')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists zcal_action_tokens_expiry_idx on public.zcal_action_tokens (expires_at);
alter table public.zcal_action_tokens enable row level security;
