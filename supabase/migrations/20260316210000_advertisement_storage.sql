-- Supabase Storage bucket for advertisement images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'advertisements',
  'advertisements',
  true,
  2097152,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read advertisement images" on storage.objects;
create policy "Public read advertisement images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'advertisements');
