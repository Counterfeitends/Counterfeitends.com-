begin;

create table if not exists public.sms_subscribers (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null unique
    check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed')),
  subscribed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sms_consent_events (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null
    references public.sms_subscribers(id) on delete restrict,
  event_type text not null check (event_type in ('opt_in', 'opt_out')),
  source text not null,
  consent_version text not null,
  consent_text text not null,
  created_at timestamptz not null default now()
);

alter table public.sms_subscribers enable row level security;
alter table public.sms_consent_events enable row level security;

revoke all on public.sms_subscribers from anon, authenticated;
revoke all on public.sms_consent_events from anon, authenticated;
grant select, insert, update on public.sms_subscribers to service_role;
grant select, insert on public.sms_consent_events to service_role;

create or replace function public.subscribe_sms_number(
  input_phone_e164 text,
  input_source text,
  input_consent_version text,
  input_consent_text text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  subscriber_id uuid;
begin
  insert into public.sms_subscribers (phone_e164, status, subscribed_at, updated_at)
  values (input_phone_e164, 'subscribed', now(), now())
  on conflict (phone_e164) do update
    set status = 'subscribed',
        subscribed_at = now(),
        updated_at = now()
  returning id into subscriber_id;

  insert into public.sms_consent_events (
    subscriber_id,
    event_type,
    source,
    consent_version,
    consent_text
  )
  values (
    subscriber_id,
    'opt_in',
    input_source,
    input_consent_version,
    input_consent_text
  );

  return subscriber_id;
end;
$$;

revoke all on function public.subscribe_sms_number(text, text, text, text) from public, anon, authenticated;
grant execute on function public.subscribe_sms_number(text, text, text, text) to service_role;

commit;