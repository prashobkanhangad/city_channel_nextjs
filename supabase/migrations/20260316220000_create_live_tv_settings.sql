create table if not exists public.live_tv_settings (
  id integer primary key default 1 check (id = 1),
  stream_url text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists live_tv_settings_set_updated_at on public.live_tv_settings;
create trigger live_tv_settings_set_updated_at
  before update on public.live_tv_settings
  for each row
  execute function public.set_updated_at();

alter table public.live_tv_settings enable row level security;

drop policy if exists "Public read live tv settings" on public.live_tv_settings;
create policy "Public read live tv settings"
  on public.live_tv_settings
  for select
  to anon, authenticated
  using (true);

insert into public.live_tv_settings (stream_url)
values ('https://www.youtube.com/channel/UCejYYqhmoga514DGSuz4jsg')
on conflict (id) do nothing;
