-- Featured image for posts
alter table public.posts
  add column if not exists image_url text;

-- Supabase Storage bucket for post images (uploads are optimized to WebP)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  2097152,
  array['image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read post images" on storage.objects;
create policy "Public read post images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'post-images');
