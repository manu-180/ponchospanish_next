-- Allow link-type resources (no file, just a URL)
ALTER TABLE public.course_resources ALTER COLUMN file_path DROP NOT NULL;

-- External link URL for kind = 'link'
ALTER TABLE public.course_resources ADD COLUMN IF NOT EXISTS url text;

-- At least one of file_path or url must be present
ALTER TABLE public.course_resources
  ADD CONSTRAINT course_resources_file_or_url_check
  CHECK (file_path IS NOT NULL OR url IS NOT NULL);
