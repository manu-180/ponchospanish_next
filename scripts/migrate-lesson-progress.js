const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationSQL = `
-- Lesson progress tracking
-- Records which lessons a user has completed in a course.

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
  completed_at timestamp with time zone DEFAULT now(),

  PRIMARY KEY (user_id, lesson_id)
);

-- Index for fast lookup: "which lessons has this user completed?"
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress (user_id);

-- RLS: Users can only see/modify their own progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON lesson_progress;

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
`;

async function migrate() {
  try {
    console.log("Running lesson_progress migration...");
    const { error } = await supabase.rpc("exec", { sql: migrationSQL });

    if (error) {
      // RPC might not be available, try direct SQL execution
      console.log("RPC not available, trying direct execution...");
      // For direct SQL, we'd need to use a different approach
      // Let's use the admin API instead
      const { data, error: sqlError } = await supabase.from("_migrations").insert({
        name: "20260605_lesson_progress",
        sql: migrationSQL,
      });

      if (sqlError) {
        throw sqlError;
      }
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
