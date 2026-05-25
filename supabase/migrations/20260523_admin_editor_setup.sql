-- =====================================================================
-- Poncho Admin Editor — Storage buckets + RLS policies
-- =====================================================================
-- Run this once in the Supabase SQL Editor (Production project
-- ceramicaapp-9abd8 / poncho — project id wdpgkhghigaowtdtjztz).
--
-- Idempotent: safe to re-run. Uses ON CONFLICT DO NOTHING / IF NOT EXISTS.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Buckets
--    `covers`           — course + product cover images (public read)
--    `digital-products` — ebook PDFs (private; signed URLs at download)
--    `course-resources` — workbook PDFs / lesson resources (private)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('covers', 'covers', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('digital-products', 'digital-products', false, 524288000, null),
  ('course-resources', 'course-resources', false, 524288000, null)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------
-- 2. RLS policies — only admin profiles can write; reads depend on bucket.
-- ---------------------------------------------------------------------
-- Helper: is_admin() — checks the current auth.uid()'s profile.role
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Allow admins to upload/update/delete in any of the three buckets
drop policy if exists "admin can write covers" on storage.objects;
create policy "admin can write covers"
  on storage.objects
  for all
  to authenticated
  using (bucket_id in ('covers', 'digital-products', 'course-resources') and public.is_admin())
  with check (bucket_id in ('covers', 'digital-products', 'course-resources') and public.is_admin());

-- Public bucket: anyone can read covers (image src in <img>)
drop policy if exists "public read covers" on storage.objects;
create policy "public read covers"
  on storage.objects
  for select
  to public
  using (bucket_id = 'covers');

-- Private buckets: only admins read directly; end users access via
-- signed URLs minted by our server.
drop policy if exists "admin read private" on storage.objects;
create policy "admin read private"
  on storage.objects
  for select
  to authenticated
  using (bucket_id in ('digital-products', 'course-resources') and public.is_admin());

-- ---------------------------------------------------------------------
-- Done.
-- =====================================================================
