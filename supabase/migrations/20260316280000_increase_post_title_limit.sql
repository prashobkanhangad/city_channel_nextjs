-- Allow longer post titles (Malayalam headlines)
alter table public.posts
  drop constraint if exists posts_title_check;

alter table public.posts
  add constraint posts_title_check
  check (char_length(title) between 3 and 200);
