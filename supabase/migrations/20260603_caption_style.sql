-- Per-course subtitle design preset.
--
-- Anto picks how subtitles look (font, colour, background, position) from a
-- set of presets; the choice is applied both in the admin editor preview and
-- in the student player via a custom caption overlay. Defaults to 'classic'.

alter table public.courses
  add column if not exists caption_style text not null default 'classic';
