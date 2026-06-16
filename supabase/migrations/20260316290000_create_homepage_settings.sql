create table if not exists public.homepage_settings (
  id integer primary key default 1 check (id = 1),
  youtube_video_url text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists homepage_settings_set_updated_at on public.homepage_settings;
create trigger homepage_settings_set_updated_at
  before update on public.homepage_settings
  for each row
  execute function public.set_updated_at();

alter table public.homepage_settings enable row level security;

drop policy if exists "Public read homepage settings" on public.homepage_settings;
create policy "Public read homepage settings"
  on public.homepage_settings
  for select
  to anon, authenticated
  using (true);

insert into public.homepage_settings (youtube_video_url)
values ('')
on conflict (id) do nothing;
