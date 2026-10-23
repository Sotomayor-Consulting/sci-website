-- Bloqueo temporal de acceso a la agenda LLC.
-- Al marcar blacklist=true en cualquier lead histórico, los nuevos intentos
-- con el mismo correo o teléfono normalizado serán rechazados por /api/leads.

alter table public.leads
  add column if not exists blacklist boolean not null default false;

create index if not exists leads_blacklist_email_idx
  on public.leads (email)
  where blacklist is true;

create index if not exists leads_blacklist_phone_idx
  on public.leads (phone_normalized)
  where blacklist is true;
