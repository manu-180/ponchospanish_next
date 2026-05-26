-- =====================================================================
-- Fix RLS so /ondemand (anon) can read published courses
-- =====================================================================
-- Problem detected 2026-05-25: querying public.courses as anon returns
--   code 42P17 "infinite recursion detected in policy for relation
--   profiles", because at least one policy on courses/modules/lessons
--   referenced profiles and the profiles policies had self-references.
--
-- Fix:
--   1. Recreate is_admin() as SECURITY DEFINER so it bypasses RLS when
--      it inspects profiles internally (no recursion).
--   2. Reset profiles policies (self-read/update + admin-via-helper).
--   3. Add explicit "anon can read published" policies on courses,
--      modules, lessons — no profile lookup, no recursion.
--   4. Keep an admin override on each via is_admin().
--   5. Enrollments: each authenticated user reads own; admins read all.
--
-- Idempotent: drops/replaces existing policies. Safe to re-run.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. is_admin() — SECURITY DEFINER helper
-- ---------------------------------------------------------------------
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid
      and role = 'admin'
  );
$$;
grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Drop the parameterless overload if it exists (admin_editor_setup.sql created one)
drop function if exists public.is_admin();

-- ---------------------------------------------------------------------
-- Helper: drop every policy on a table (idempotent reset)
-- ---------------------------------------------------------------------
create or replace function public._reset_policies(target_table regclass)
returns void
language plpgsql
as $$
declare
  pol record;
begin
  for pol in
    select polname from pg_policy where polrelid = target_table
  loop
    execute format('drop policy if exists %I on %s', pol.polname, target_table::text);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 2. profiles — sane policies, no recursion
-- ---------------------------------------------------------------------
select public._reset_policies('public.profiles');
alter table public.profiles enable row level security;

create policy "profiles_self_select"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "profiles_self_update"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_admin_select_all"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "profiles_admin_update_all"
  on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. courses — anon can read published; admins anything
-- ---------------------------------------------------------------------
select public._reset_policies('public.courses');
alter table public.courses enable row level security;

create policy "courses_public_select_published"
  on public.courses for select to anon, authenticated
  using (is_published = true);

create policy "courses_admin_all"
  on public.courses for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. modules — anon can read modules whose course is published
-- ---------------------------------------------------------------------
select public._reset_policies('public.modules');
alter table public.modules enable row level security;

create policy "modules_public_select_when_course_published"
  on public.modules for select to anon, authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = modules.course_id
        and c.is_published = true
    )
  );

create policy "modules_admin_all"
  on public.modules for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. lessons — anon can read lessons whose module's course is published
-- ---------------------------------------------------------------------
select public._reset_policies('public.lessons');
alter table public.lessons enable row level security;

create policy "lessons_public_select_when_course_published"
  on public.lessons for select to anon, authenticated
  using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = lessons.module_id
        and c.is_published = true
    )
  );

create policy "lessons_admin_all"
  on public.lessons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 6. enrollments — user reads own, admin reads all
-- ---------------------------------------------------------------------
select public._reset_policies('public.enrollments');
alter table public.enrollments enable row level security;

create policy "enrollments_self_select"
  on public.enrollments for select to authenticated
  using (user_id = auth.uid());

create policy "enrollments_admin_all"
  on public.enrollments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Cleanup helper
-- ---------------------------------------------------------------------
drop function if exists public._reset_policies(regclass);

-- =====================================================================
-- Done. Re-test querying courses as anon — should return published rows
-- =====================================================================
