-- "Fuente" en Odoo perdía la red (mostraba solo "Diagnóstico B" en vez de
-- "Diagnóstico B · TikTok") cada vez que no había ttclid/fbclid — por ejemplo
-- tráfico de otra red de ads que todavía no reconocíamos. Se pide reforzar
-- esto antes de sumar una red nueva: nunca perder la trazabilidad.
--
-- Fix: reconoce también Google (gclid), y si ninguna red conocida matchea,
-- cae al utm_source crudo de la campaña en vez de dejarlo vacío. Cuando se
-- sume una red nueva, basta con taggear utm_source=<red> en el anuncio y
-- ya queda atribuido, aunque todavía no tenga un nombre bonito acá.

create or replace function public.diag_normalize_source(
  p_ttclid text, p_fbclid text, p_source text,
  p_gclid text default null, p_utm_source text default null
)
returns text language sql immutable as $$
  select coalesce(
    case
      when coalesce(p_ttclid,'') <> '' then 'TikTok'
      when coalesce(p_fbclid,'') <> '' then 'Meta'
      when coalesce(p_gclid,'')  <> '' then 'Google'
      when lower(coalesce(p_utm_source,'')) ~ 'tik ?tok|tiktok' then 'TikTok'
      when lower(coalesce(p_utm_source,'')) ~ 'meta|facebook|instagram' then 'Meta'
      when lower(coalesce(p_utm_source,'')) ~ 'google|adwords' then 'Google'
      when lower(coalesce(p_utm_source,'')) ~ 'snap' then 'Snapchat'
      when lower(coalesce(p_source,''))     ~ 'tik ?tok|tiktok' then 'TikTok'
      when lower(coalesce(p_source,''))     ~ 'meta|facebook'   then 'Meta'
      else null
    end,
    nullif(trim(p_utm_source), ''),  -- red desconocida: mejor el nombre crudo que nada
    ''
  );
$$;

create or replace function public.diag_leads_xb_shape()
returns trigger
language plpgsql
as $function$
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
    new.source := nullif(public.diag_normalize_source(new.ttclid, new.fbclid, new.source, new.gclid, new.utm_source), '');
  end if;

  new.updated_at := now();
  return new;
end;
$function$;
