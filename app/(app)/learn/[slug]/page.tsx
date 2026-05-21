import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getSupabaseServerClient,
} from "@/lib/supabase/server";
import {
  getCourseBySlug,
  getCompletedLessonIds,
  userHasAccessToCourse,
} from "@/lib/supabase/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Hitting /learn/[slug] redirects to the first available lesson:
 *   - Next not-completed lesson if user has access
 *   - First free preview lesson otherwise
 */
export default async function LearnCourseEntry({ params }: PageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?redirect=/learn/${slug}`);

  const supabase = await getSupabaseServerClient();
  const course = await getCourseBySlug(supabase, slug).catch(() => null);
  if (!course) redirect(`/ondemand`);

  const hasAccess = await userHasAccessToCourse(supabase, user.id, course.id).catch(
    () => false,
  );

  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      isFree: l.is_free_preview || m.is_free,
    })),
  );

  if (allLessons.length === 0) redirect(`/ondemand/${slug}`);

  if (!hasAccess) {
    const firstFree = allLessons.find((l) => l.isFree);
    if (firstFree) redirect(`/learn/${slug}/${firstFree.slug}`);
    redirect(`/ondemand/${slug}`);
  }

  const completedIds = await getCompletedLessonIds(
    supabase,
    user.id,
    course.id,
  ).catch(() => [] as string[]);
  const nextLesson =
    allLessons.find((l) => !completedIds.includes(l.id)) ?? allLessons[0];

  redirect(`/learn/${slug}/${nextLesson.slug}`);
}
