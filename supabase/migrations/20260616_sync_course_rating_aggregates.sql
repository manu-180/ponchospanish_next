-- Keep courses.avg_rating / ratings_count in sync with VISIBLE reviews.
-- Powers: the hero star line, the academy listing card, and the JSON-LD
-- aggregateRating used for Google rich-snippet stars.
create or replace function public.sync_course_rating_aggregates()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected uuid := coalesce(new.course_id, old.course_id);
begin
  update public.courses c
  set
    avg_rating = sub.avg_rating,
    ratings_count = sub.ratings_count
  from (
    select
      round(avg(rating)::numeric, 2) as avg_rating,
      count(*)::int                   as ratings_count
    from public.course_reviews
    where course_id = affected and is_visible = true
  ) sub
  where c.id = affected;
  return null;
end;
$$;

drop trigger if exists course_reviews_sync_aggregates on public.course_reviews;
create trigger course_reviews_sync_aggregates
after insert or update or delete on public.course_reviews
for each row execute function public.sync_course_rating_aggregates();

-- Backfill every course's aggregates from current visible reviews.
update public.courses c
set
  avg_rating = sub.avg_rating,
  ratings_count = sub.ratings_count
from (
  select
    course_id,
    round(avg(rating)::numeric, 2) as avg_rating,
    count(*)::int                   as ratings_count
  from public.course_reviews
  where is_visible = true
  group by course_id
) sub
where c.id = sub.course_id;
