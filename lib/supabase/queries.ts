import type { Course, Module, Lesson, Enrollment } from "@/types/database";
import type { getSupabaseServerClient } from "@/lib/supabase/server";

// Derive Client from the actual return type of `getSupabaseServerClient`.
// The admin client (`getSupabaseAdminClient`) has a compatible runtime shape
// even though its generic parameters differ slightly; callers pass it without
// trouble because every helper here only uses `.from()` + chainable methods.
type Client = Awaited<ReturnType<typeof getSupabaseServerClient>>;

export type EnrollmentWithCourse = Enrollment & { course: Course | null };

export type CourseWithCounts = Course & {
  modules_count: number;
  lessons_count: number;
};

export type CourseTree = Course & {
  modules: (Module & {
    lessons: Lesson[];
  })[];
};

/** Public — list published courses. */
export async function listPublishedCourses(
  supabase: Client,
): Promise<CourseWithCounts[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*, modules(id, lessons(id))")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  type Row = Course & {
    modules?: Array<{ id: string; lessons?: Array<{ id: string }> }>;
  };
  const rows = (data ?? []) as unknown as Row[];

  return rows.map((c) => ({
    ...c,
    modules_count: (c.modules ?? []).length,
    lessons_count: (c.modules ?? []).reduce(
      (acc, m) => acc + (m.lessons?.length ?? 0),
      0,
    ),
  }));
}

/** Public — full curriculum tree for a course by slug. */
export async function getCourseBySlug(
  supabase: Client,
  slug: string,
): Promise<CourseTree | null> {
  const { data: courseRaw, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  const course = courseRaw as Course | null;
  if (!course) return null;

  const { data: modulesRaw } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  type ModuleWithLessons = Module & { lessons?: Lesson[] };
  const modules = (modulesRaw ?? []) as unknown as ModuleWithLessons[];

  const sortedModules = modules.map((m) => ({
    ...m,
    lessons: (m.lessons ?? []).sort((a, b) => a.position - b.position),
  }));

  return { ...course, modules: sortedModules };
}

/** Check if a user has access to a given course. */
export async function userHasAccessToCourse(
  supabase: Client,
  userId: string,
  courseId: string,
) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** List of completed lesson ids for the current user. */
export async function getCompletedLessonIds(
  supabase: Client,
  userId: string,
  courseId?: string,
): Promise<string[]> {
  let query = supabase
    .from("lesson_progress")
    .select("lesson_id, lesson:lessons!inner(module:modules!inner(course_id))")
    .eq("user_id", userId);

  if (courseId) {
    query = query.eq("lesson.module.course_id", courseId);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as unknown as Array<{ lesson_id: string }>;
  return rows.map((row) => row.lesson_id);
}

export async function listUserEnrollments(
  supabase: Client,
  userId: string,
): Promise<EnrollmentWithCourse[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EnrollmentWithCourse[];
}
