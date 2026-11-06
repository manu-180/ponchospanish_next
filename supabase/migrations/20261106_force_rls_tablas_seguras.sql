-- FORCE RLS solo en las tablas que ninguna función SECURITY DEFINER toca.
-- Quedan afuera a propósito:
--   profiles: is_admin() y profiles_prevent_role_escalation() la leen siendo
--             dueñas de la tabla; con FORCE, is_admin() entra en recursión.
--   courses:  sync_course_rating_aggregates() la actualiza como dueña y las
--             reglas de update son solo de admin.
-- service_role tiene BYPASSRLS, así que el webhook de PayPal y los route
-- handlers con cliente admin no cambian.
alter table public.lessons force row level security;
alter table public.modules force row level security;
alter table public.enrollments force row level security;
alter table public.lesson_progress force row level security;
