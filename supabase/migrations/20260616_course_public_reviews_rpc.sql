-- Public, privacy-safe reviews feed for a course.
--
-- The course detail page renders with a cookieless/anon Supabase client (for
-- ISR). Anon can already SELECT visible rows on course_reviews, but the
-- reviewer's name lives in `profiles`, which has NO public SELECT policy
-- (admin + self only). A SECURITY DEFINER function is the correct way to join
-- the two and expose ONLY a safe subset:
--   * rating, title, body, created_at, is_pinned  (already public-readable)
--   * a privacy-safe display name (first name + last initial)
--   * avatar_url (a plain image URL; UI falls back to a monogram)
-- Email and the full surname are never exposed.
create or replace function public.get_course_public_reviews(p_course_id uuid)
returns table (
  id uuid,
  rating int,
  title text,
  body text,
  created_at timestamptz,
  is_pinned boolean,
  reviewer_name text,
  reviewer_avatar text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    cr.id,
    cr.rating,
    cr.title,
    cr.body,
    cr.created_at,
    cr.is_pinned,
    case
      when coalesce(btrim(p.full_name), '') = '' then 'Verified student'
      when strpos(btrim(p.full_name), ' ') = 0 then btrim(p.full_name)
      else split_part(btrim(p.full_name), ' ', 1)
           || ' '
           || upper(left(split_part(btrim(p.full_name), ' ', -1), 1))
           || '.'
    end as reviewer_name,
    nullif(btrim(coalesce(p.avatar_url, '')), '') as reviewer_avatar
  from public.course_reviews cr
  left join public.profiles p on p.id = cr.user_id
  where cr.course_id = p_course_id
    and cr.is_visible = true
  order by cr.is_pinned desc, cr.created_at desc;
$$;

revoke all on function public.get_course_public_reviews(uuid) from public;
grant execute on function public.get_course_public_reviews(uuid) to anon, authenticated;
