-- RPCs de ingesta para el tracking del Diagnóstico. Se llaman por PostgREST:
--   POST /rest/v1/rpc/<fn>   con el body {param: valor, ...}
-- El Function usa SERVICE_ROLE_KEY (ignora RLS); SECURITY DEFINER + search_path
-- fijo por si en el futuro se llama con anon.

-- Upsert de sesión con lógica monótona en el paso más lejano alcanzado.
create or replace function public.diag_upsert_session(
  p_session_id       text,
  p_landing_variant  text,
  p_persona          text default null,
  p_page_name        text default null,
  p_step_index       int  default null,
  p_step_id          text default null,
  p_ctx              jsonb default '{}'::jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into diagnostico_sessions as s (
    session_id, landing_variant, persona, page_name,
    last_step_index, last_step_id, max_step_index, max_step_id,
    source, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    ttclid, fbclid, gclid, hook, first_hook_question,
    referrer, user_agent, country_iso, device, test
  ) values (
    p_session_id,
    case when lower(coalesce(p_landing_variant,'')) = 'b' then 'b' else 'a' end,
    nullif(p_persona,''), nullif(p_page_name,''),
    coalesce(p_step_index,0), nullif(p_step_id,''),
    coalesce(p_step_index,0), nullif(p_step_id,''),
    p_ctx->>'source', p_ctx->>'utm_source', p_ctx->>'utm_medium',
    p_ctx->>'utm_campaign', p_ctx->>'utm_content', p_ctx->>'utm_term',
    p_ctx->>'ttclid', p_ctx->>'fbclid', p_ctx->>'gclid',
    p_ctx->>'hook', p_ctx->>'first_hook_question',
    p_ctx->>'referrer', p_ctx->>'user_agent', p_ctx->>'country_iso', p_ctx->>'device',
    coalesce((p_ctx->>'test')::boolean, false)
  )
  on conflict (session_id) do update set
    last_seen_at    = now(),
    last_step_index = coalesce(p_step_index, s.last_step_index),
    last_step_id    = coalesce(nullif(p_step_id,''), s.last_step_id),
    max_step_index  = greatest(s.max_step_index, coalesce(p_step_index, 0)),
    max_step_id     = case
                        when coalesce(p_step_index, 0) >= s.max_step_index
                          then coalesce(nullif(p_step_id,''), s.max_step_id)
                        else s.max_step_id
                      end,
    persona         = coalesce(s.persona, nullif(p_persona,'')),
    page_name       = coalesce(s.page_name, nullif(p_page_name,''));
end
$$;

-- Vincula la sesión con el lead al pasar el gate (y la marca completada).
create or replace function public.diag_link_lead(
  p_session_id text,
  p_lead_id    text,
  p_completed  boolean default true
) returns void
language sql
security definer
set search_path = public
as $$
  update diagnostico_sessions set
    lead_id        = coalesce(nullif(p_lead_id,''), lead_id),
    completed_at   = case when p_completed then coalesce(completed_at, now()) else completed_at end,
    max_step_index = greatest(max_step_index, case when p_completed then 8 else max_step_index end)
  where session_id = p_session_id;

  update diagnostico_answers set lead_id = coalesce(nullif(p_lead_id,''), lead_id)
  where session_id = p_session_id;
$$;
