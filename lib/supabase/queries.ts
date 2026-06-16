import { cache } from "react";
import type {
  Course,
  Module,
  Lesson,
  Enrollment,
  DigitalProduct,
  DigitalProductPurchase,
} from "@/types/database";
import {
  getSupabaseServerClient,
  getSupabasePublicClient,
} from "@/lib/supabase/server";

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

/**
 * Request-scoped, deduplicated course loader.
 *
 * `getCourseBySlug` runs two DB queries. Pages call it from BOTH
 * `generateMetadata` and the page body on the same request — without
 * deduping that's 4 queries per render. `cache()` collapses repeat calls
 * (same slug) within a single request to one, and creates its own server
 * client so the cache key is just the slug.
 */
export const getCourseBySlugCached = cache(
  async (slug: string): Promise<CourseTree | null> => {
    // Cookieless public client → keeps callers (e.g. the ISR course-detail
    // page) statically renderable. Course catalog data is public. The cast
    // bridges the slightly different generic signature of createClient vs
    // createServerClient — they share the same runtime `.from()` surface.
    const supabase = getSupabasePublicClient() as unknown as Client;
    return getCourseBySlug(supabase, slug);
  },
);

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
    .select("*, course:courses(*, modules(id, lessons(id)))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EnrollmentWithCourse[];
}

/* ------------------------------------------------------------------ *
 * Digital products (ebooks, PDF packs, standalone resources)
 * ------------------------------------------------------------------ */

export type DigitalProductPurchaseWithProduct = DigitalProductPurchase & {
  product: DigitalProduct | null;
};

/** Public — list published digital products (ebooks). */
export async function listPublishedDigitalProducts(
  supabase: Client,
): Promise<DigitalProduct[]> {
  const { data, error } = await supabase
    .from("digital_products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DigitalProduct[];
}

/** Public — single digital product by slug. */
export async function getDigitalProductBySlug(
  supabase: Client,
  slug: string,
): Promise<DigitalProduct | null> {
  const { data, error } = await supabase
    .from("digital_products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as DigitalProduct | null) ?? null;
}

/** Has the user purchased / unlocked this digital product? */
export async function userHasPurchasedProduct(
  supabase: Client,
  userId: string,
  productId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("digital_product_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/** Returns true if the user has already submitted a review for a course. */
export async function getUserReviewForCourse(
  supabase: Client,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("course_reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return Boolean(data);
}

/** A single approved review, shaped for public display. */
export type PublicCourseReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  is_pinned: boolean;
  reviewer_name: string;
  reviewer_avatar: string | null;
};

/**
 * Public — approved reviews for a course (pinned first, then newest).
 *
 * Goes through the `get_course_public_reviews` SECURITY DEFINER RPC so the
 * cookieless anon client (used by the ISR course-detail page) can read the
 * reviewer's display name without `profiles` being publicly readable. Only
 * visible reviews are returned, and only a privacy-safe name (first name +
 * last initial) and avatar are exposed — never email or full surname.
 *
 * Wrapped in `cache()` so a render that touches it more than once on the same
 * request hits the DB only once.
 */
export const listPublicCourseReviews = cache(
  async (courseId: string): Promise<PublicCourseReview[]> => {
    // The RPC isn't in the generated Database types, so narrow the client to
    // just the rpc shape we need (same `as unknown as` bridge this file uses
    // elsewhere for the cookieless public client).
    const supabase = getSupabasePublicClient() as unknown as {
      rpc: (
        fn: "get_course_public_reviews",
        args: { p_course_id: string },
      ) => Promise<{ data: PublicCourseReview[] | null; error: unknown }>;
    };
    const { data, error } = await supabase.rpc("get_course_public_reviews", {
      p_course_id: courseId,
    });
    if (error) throw error;
    return data ?? [];
  },
);

/** All digital products the user owns, newest first. */
export async function listUserPurchases(
  supabase: Client,
  userId: string,
): Promise<DigitalProductPurchaseWithProduct[]> {
  const { data, error } = await supabase
    .from("digital_product_purchases")
    .select("*, product:digital_products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as DigitalProductPurchaseWithProduct[];
}
