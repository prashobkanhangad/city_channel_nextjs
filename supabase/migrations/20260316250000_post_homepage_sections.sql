-- Homepage section placements for posts (trending, must_read, special)
alter table public.posts
  add column if not exists homepage_sections text[] not null default '{}';

create index if not exists posts_homepage_sections_idx
  on public.posts
  using gin (homepage_sections);
