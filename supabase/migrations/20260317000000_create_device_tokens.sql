create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  platform text not null check (platform in ('android', 'ios')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists device_tokens_platform_idx
  on public.device_tokens (platform);

alter table public.device_tokens enable row level security;

drop policy if exists "Public insert device tokens" on public.device_tokens;
create policy "Public insert device tokens"
  on public.device_tokens
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public update device tokens" on public.device_tokens;
create policy "Public update device tokens"
  on public.device_tokens
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Public select device tokens" on public.device_tokens;
create policy "Public select device tokens"
  on public.device_tokens
  for select
  to anon, authenticated
  using (true);

create or replace function public.set_device_tokens_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists device_tokens_updated_at on public.device_tokens;
create trigger device_tokens_updated_at
  before update on public.device_tokens
  for each row
  execute function public.set_device_tokens_updated_at();
