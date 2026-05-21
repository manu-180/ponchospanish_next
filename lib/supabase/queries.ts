import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Course, Module, Lesson } from "@/types/database";

type Client = SupabaseClient<Database>;

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
export async function listPublishedCourses(supabase: Client) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, modules(id, lessons(id))")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((c) => ({
    ...c,
    modules_count: (c.modules ?? []).length,
    lessons_count: (c.modules ?? []).reduce(
      (acc, m: { lessons?: { id: string }[] }) =>
        acc + (m.lessons?.length ?? 0),
      0,
    ),
    modules: undefined,
  })) as unknown as CourseWithCounts[];
}

/** Public — full curriculum tree for a course by slug. */
export async function getCourseBySlug(
  supabase: Client,
  slug: string,
): Promise<CourseTree | null> {
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  const sortedModules = (modules ?? []).map((m) => ({
    ...m,
    lessons: ((m as { lessons?: Lesson[] }).lessons ?? []).sort(
      (a, b) => a.position - b.position,
    ),
  }));

  return { ...course, modules: sortedModules } as CourseTree;
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
  return (data ?? []).map((row) => row.lesson_id);
}

export async function listUserEnrollments(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
