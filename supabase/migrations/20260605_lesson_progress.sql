-- Lesson progress tracking
-- Records which lessons a user has completed in a course.

CREATE TABLE lesson_progress (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
  completed_at timestamp with time zone DEFAULT now(),

  PRIMARY KEY (user_id, lesson_id)
);

-- Index for fast lookup: "which lessons has this user completed?"
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress (user_id);

-- RLS: Users can only see/modify their own progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON lesson_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin can see all progress (for analytics/course completion)
CREATE POLICY "Admins can view all progress"
  ON lesson_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
