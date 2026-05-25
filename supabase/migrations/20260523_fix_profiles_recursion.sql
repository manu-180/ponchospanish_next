-- =====================================================================
-- Fix infinite recursion in profiles RLS policies
-- =====================================================================
-- Problem: existing policies on `profiles` reference `profiles` from within
-- their USING clause (e.g. "you can see this row if you are an admin"
-- where being-an-admin requires reading profiles). PostgreSQL detects the
-- recursion at query time and aborts with code 42P17.
--
-- Fix: rewrite the policies to:
--   1) Always allow each authenticated user to read their OWN row.
--   2) Use a SECURITY DEFINER function for admin checks so the function
--      bypasses RLS when it inspects profiles internally.
--   3) Allow admins to read/update all rows via that helper.
--
-- Idempotent: drops/replaces existing policies.
-- =====================================================================

-- Helper: is_admin() — runs with creator privileges so it can read
-- profiles even when the caller's role doesn't yet pass the policy.
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

-- Drop any pre-existing policies on profiles (idempotent)
do $$
declare
  pol record;
begin
  for pol in
    select polname from pg_policy
    where polrelid = 'public.profiles'::regclass
  loop
    execute format('drop policy if exists %I on public.profiles', pol.polname);
  end loop;
end $$;

alter table public.profiles enable row level security;

-- Each user can read their own row
create policy "profiles_self_select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Each user can update their own row (except role — controlled by trigger)
create policy "profiles_self_update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Admins can read every profile (uses the SECURITY DEFINER helper so no recursion)
create policy "profiles_admin_select_all"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Admins can update every profile
create policy "profiles_admin_update_all"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Prevent users from promoting themselves to admin via update:
-- the SECURITY-DEFINER trigger below blocks role changes unless the
-- caller is already an admin.
create or replace function public.profiles_prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    raise exception 'You are not allowed to change your role.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row
  execute function public.profiles_prevent_role_escalation();

-- =====================================================================
-- Done. After running, refresh your app — the dashboard should render
-- the admin banner for ponchospanish@gmail.com immediately.
-- =====================================================================
