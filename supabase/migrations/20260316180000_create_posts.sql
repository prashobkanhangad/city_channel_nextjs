-- Posts table for City Channel news portal
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  content text not null check (char_length(content) between 10 and 2000),
  author text not null check (char_length(author) between 2 and 80),
  city text not null check (char_length(city) between 2 and 80),
  view_count bigint not null default 0 check (view_count >= 0),
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_view_count_idx on public.posts (view_count desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

create or replace function public.increment_post_view(post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set view_count = view_count + 1
  where id = post_id;
end;
$$;

grant execute on function public.increment_post_view(uuid) to anon, authenticated, service_role;

alter table public.posts enable row level security;

drop policy if exists "Public read published posts" on public.posts;
create policy "Public read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

insert into public.posts (title, content, author, city, view_count)
values
  (
    'നഗര മധ്യത്തിൽ മെട്രോ വിപുലീകരണം അംഗീകരിച്ചു',
    'നഗരസഭാ കൗൺസിൽ ഡൗൺടൗൺ കോറിഡോറിലൂടെ മെട്രോ ലൈൻ വിപുലീകരിക്കാൻ അംഗീകാരം നൽകി. അടുത്ത പാദത്തിൽ നിർമാണം ആരംഭിക്കും.',
    'വെബ് ഡെസ്ക്',
    'കൊച്ചി',
    1284
  ),
  (
    'വാരാന്ത്യ കർഷക മാർക്കറ്റ് തിരിച്ചുവരുന്നു',
    'നദിക്കരയിലെ കർഷക മാർക്കറ്റ് ഈ ശനിയാഴ്ച 40-ലധികം വിൽപ്പനക്കാരുമായി തുറക്കും. സംഗീത പരിപാടിയും പുതിയ പുനരുപയോഗ സംവിധാനവും ഉണ്ട്.',
    'ഇവന്റ്സ് ടീം',
    'തിരുവനന്തപുരം',
    756
  )
;
