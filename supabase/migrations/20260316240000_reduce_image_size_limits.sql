-- Tighten storage bucket limits for optimized WebP uploads (512 KB)
update storage.buckets
set
  file_size_limit = 524288,
  allowed_mime_types = array['image/webp']
where id in ('advertisements', 'post-images');
