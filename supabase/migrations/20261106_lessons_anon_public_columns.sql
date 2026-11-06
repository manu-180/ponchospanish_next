-- anon lee del catálogo solo lo público de cada lección. Afuera: los ids y URLs
-- de Mux y la ruta del video.
--
-- Aplicar DESPUÉS de desplegar el código que deja de pedir `lessons(*)` con la
-- llave anon: con `*` PostgREST pide todas las columnas y el catálogo daría 401.
-- La política RLS de lectura no cambia. `authenticated` queda igual porque el
-- panel de admin lee con la sesión.

revoke select on public.lessons from anon;

grant select (
  id,
  module_id,
  title,
  slug,
  position,
  description,
  is_free_preview,
  is_trailer,
  mux_status,
  mux_duration_seconds,
  video_duration_seconds,
  release_at,
  created_at,
  updated_at
) on public.lessons to anon;
