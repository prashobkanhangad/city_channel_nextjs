-- Categories for City Channel news portal
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 2 and 80),
  title_ml text not null check (char_length(title_ml) between 2 and 80),
  nav_label text not null check (char_length(nav_label) between 2 and 40),
  description text not null default '' check (char_length(description) <= 500),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists categories_sort_order_idx on public.categories (sort_order asc);
create index if not exists categories_is_active_idx on public.categories (is_active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

alter table public.categories enable row level security;

drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.categories (slug, title, title_ml, nav_label, description, sort_order)
values
  (
    'kasaragod',
    'Kasaragod',
    'കാസർഗോഡ്',
    'KASARAGOD',
    'കാസർഗോഡ് ജില്ലാ വാർത്തകളും അപ്ഡേറ്റുകളും',
    1
  ),
  (
    'kerala',
    'Kerala',
    'കേരളം',
    'KERALA',
    'കേരളത്തിലെ പ്രധാന വാർത്തകൾ',
    2
  ),
  (
    'national',
    'National',
    'ദേശീയം',
    'NATIONAL',
    'ദേശീയ വാർത്തകളും വിശകലനങ്ങളും',
    3
  );
