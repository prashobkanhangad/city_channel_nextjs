-- Video library for /videos and homepage highlights
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  youtube_video_id text check (
    youtube_video_id is null or char_length(youtube_video_id) between 6 and 20
  ),
  thumbnail_url text,
  is_active boolean not null default true,
  show_on_homepage boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_active_sort_idx
  on public.videos (is_active, sort_order, created_at desc);

create index if not exists videos_homepage_idx
  on public.videos (show_on_homepage, is_active, sort_order);

drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at
  before update on public.videos
  for each row
  execute function public.set_updated_at();

alter table public.videos enable row level security;

drop policy if exists "Public read active videos" on public.videos;
create policy "Public read active videos"
  on public.videos
  for select
  to anon, authenticated
  using (is_active = true);
