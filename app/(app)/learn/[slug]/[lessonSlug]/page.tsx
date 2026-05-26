import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Lock } from "lucide-react";
import {
  getCurrentUser,
  getSupabaseServerClient,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import {
  getCourseBySlug,
  getCompletedLessonIds,
  userHasAccessToCourse,
} from "@/lib/supabase/queries";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { signMuxPlaybackToken } from "@/lib/mux/signing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseOutline } from "@/components/learn/course-outline";
import { MuxLessonPlayer } from "@/components/learn/mux-lesson-player";
import { WorkbookViewer } from "@/components/learn/workbook-viewer";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?redirect=/learn/${slug}/${lessonSlug}`);

  const supabase = await getSupabaseServerClient();
  const course = await getCourseBySlug(supabase, slug).catch(() => null);
  if (!course) notFound();

  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      moduleTitle: m.title,
      moduleId: m.id,
      isFree: l.is_free_preview || m.is_free,
    })),
  );
  const index = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (index < 0) notFound();
  const lesson = allLessons[index];
  const prev = index > 0 ? allLessons[index - 1] : null;
  const next = index < allLessons.length - 1 ? allLessons[index + 1] : null;

  const hasAccess = await userHasAccessToCourse(supabase, user.id, course.id).catch(
    () => false,
  );
  const completedIds = await getCompletedLessonIds(supabase, user.id, course.id).catch(
    () => [] as string[],
  );
  const accessibleLesson = hasAccess || lesson.isFree;

  // Mint signed Mux playback + thumbnail tokens server-side. Tokens have a
  // 15 min TTL — fine for a single lesson view.
  const muxReady =
    accessibleLesson &&
    lesson.mux_status === "ready" &&
    !!lesson.mux_playback_id;

  const playbackToken = muxReady
    ? signMuxPlaybackToken({
        playbackId: lesson.mux_playback_id!,
        audience: "video",
        subject: user.id,
      })
    : null;
  const thumbnailToken = muxReady
    ? signMuxPlaybackToken({
        playbackId: lesson.mux_playback_id!,
        audience: "thumbnail",
        subject: user.id,
      })
    : null;
  const storyboardToken = muxReady
    ? signMuxPlaybackToken({
        playbackId: lesson.mux_playback_id!,
        audience: "storyboard",
        subject: user.id,
      })
    : null;

  const admin = getSupabaseAdminClient();
  const { data: workbooks } = accessibleLesson
    ? await admin
        .from("workbooks")
        .select("*")
        .or(`lesson_id.eq.${lesson.id},module_id.eq.${lesson.moduleId}`)
    : { data: [] as Array<{ id: string; title: string; pdf_path: string }> };

  const workbooksResolved = await Promise.all(
    (workbooks ?? []).map(async (wb) => ({
      ...wb,
      pdf_path:
        (await resolveStorageUrl(STORAGE_BUCKETS.workbooks, wb.pdf_path)) ??
        wb.pdf_path,
    })),
  );

  // Existing note for each workbook
  const { data: notes } = await admin
    .from("workbook_notes")
    .select("workbook_id, content")
    .eq("user_id", user.id)
    .in(
      "workbook_id",
      workbooksResolved.map((w) => w.id),
    );

  const noteByWorkbook = new Map<string, string>(
    (notes ?? []).map((n) => [n.workbook_id, n.content]),
  );

  return (
    <div className="container-wide py-8 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="mb-4">
            <Link
              href={`/ondemand/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-charcoal-400 hover:text-mustard-600 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to overview
            </Link>
            <h1 className="font-serif text-xl mt-2 leading-tight">
              {course.title}
            </h1>
          </div>

          <CourseOutline
            courseSlug={course.slug}
            modules={course.modules}
            currentLessonId={lesson.id}
            completedLessonIds={completedIds}
            hasAccess={hasAccess}
          />
        </aside>

        <div className="space-y-8 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="muted">{lesson.moduleTitle}</Badge>
              {lesson.isFree && <Badge variant="free">Free preview</Badge>}
              {!accessibleLesson && (
                <Badge variant="outline">
                  <Lock className="h-3 w-3 mr-1" /> Locked
                </Badge>
              )}
            </div>
            <h2 className="font-serif text-display-md leading-tight">
              {lesson.title}
            </h2>
          </div>

          <MuxLessonPlayer
            playbackId={lesson.mux_playback_id}
            playbackToken={playbackToken}
            thumbnailToken={thumbnailToken}
            storyboardToken={storyboardToken}
            title={lesson.title}
            locked={!accessibleLesson}
            userId={user.id}
            lessonId={lesson.id}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {accessibleLesson ? (
              <MarkCompleteButton
                lessonId={lesson.id}
                userId={user.id}
                initiallyCompleted={completedIds.includes(lesson.id)}
                nextLessonHref={
                  next ? `/learn/${course.slug}/${next.slug}` : null
                }
              />
            ) : (
              <Button asChild>
                <Link href={`/ondemand/${course.slug}`}>
                  Unlock the full course
                </Link>
              </Button>
            )}

            <div className="flex items-center gap-2">
              {prev && (
                <Button asChild variant="soft" size="sm">
                  <Link href={`/learn/${course.slug}/${prev.slug}`}>
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </Link>
                </Button>
              )}
              {next && (
                <Button asChild variant="soft" size="sm">
                  <Link href={`/learn/${course.slug}/${next.slug}`}>
                    Next <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {lesson.description && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-xl mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-mustard-600" />
                  Lesson notes
                </h3>
                <div className="prose-poncho text-charcoal-500 whitespace-pre-line leading-relaxed">
                  {lesson.description}
                </div>
              </CardContent>
            </Card>
          )}

          {accessibleLesson && workbooksResolved.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl">Workbook</h3>
              {workbooksResolved.map((wb) => (
                <WorkbookViewer
                  key={wb.id}
                  workbook={{ id: wb.id, title: wb.title, pdf_path: wb.pdf_path }}
                  initialNote={noteByWorkbook.get(wb.id) ?? null}
                  userId={user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
