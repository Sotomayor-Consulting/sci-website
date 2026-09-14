-- Renombra el vocabulario de leads-xb.status al lenguaje de negocio pedido:
-- 'lead' (recién capturado, aún no confirmado en Odoo) -> 'syncing' (en camino)
-- -> 'lead_validado' (Odoo confirmó: creó o encontró el registro) | 'error'.
--
-- "Validado" = el subworkflow Odoo dfVrD8ave246iDtY devolvió un resolved_lead_id real,
-- sin importar si fue create_new / refresh_existing / duplicate — esa es la regla del
-- flujo: cualquier resultado con id de Odoo real cuenta como lead validado.

update public."leads-xb" set status = 'lead' where status = 'pending';
update public."leads-xb" set status = 'lead_validado' where status = 'synced';

alter table public."leads-xb" alter column status set default 'lead';

alter table public."leads-xb" drop constraint if exists leads_xb_status_chk;
alter table public."leads-xb" add constraint leads_xb_status_chk
  check (status in ('lead','syncing','lead_validado','error'));

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

select lead_id, status from public."leads-xb" order by created_at;
