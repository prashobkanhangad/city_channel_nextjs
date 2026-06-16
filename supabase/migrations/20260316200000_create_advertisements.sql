create table if not exists public.advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  placement text not null check (
    placement in (
      'home-sidebar',
      'home-mid-banner',
      'category-sidebar-top',
      'category-sidebar-bottom'
    )
  ),
  image_url text not null,
  link_url text,
  alt_text text not null default '',
  aspect_class text not null default 'aspect-[16/10]',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists advertisements_placement_idx
  on public.advertisements (placement, is_active, sort_order);

drop trigger if exists advertisements_set_updated_at on public.advertisements;
create trigger advertisements_set_updated_at
  before update on public.advertisements
  for each row
  execute function public.set_updated_at();

alter table public.advertisements enable row level security;

drop policy if exists "Public read active advertisements" on public.advertisements;
create policy "Public read active advertisements"
  on public.advertisements
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.advertisements (
  title,
  placement,
  image_url,
  link_url,
  alt_text,
  aspect_class,
  sort_order
)
values
  (
    'Home Sidebar Ad',
    'home-sidebar',
    '/sample.png',
    'https://citychannel.com',
    'City Channel promotion',
    'aspect-[16/10]',
    1
  ),
  (
    'Home Middle Banner',
    'home-mid-banner',
    '/sample.png',
    'https://citychannel.com',
    'City Channel banner',
    'aspect-[16/5]',
    1
  ),
  (
    'Sidebar Top Ad',
    'category-sidebar-top',
    '/sample.png',
    null,
    'Advertisement',
    'aspect-[4/3]',
    1
  ),
  (
    'Sidebar Bottom Ad',
    'category-sidebar-bottom',
    '/sample.png',
    null,
    'Advertisement',
    'aspect-[4/5]',
    1
  );
