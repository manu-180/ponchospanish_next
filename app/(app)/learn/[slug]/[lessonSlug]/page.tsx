import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Lock } from "lucide-react";
import {
  getCurrentUser,
  getSupabaseServerClient,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import {
  getCourseBySlugCached,
  getCompletedLessonIds,
  userHasAccessToCourse,
} from "@/lib/supabase/queries";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { signMuxPlaybackToken, buildSignedThumbnailUrl } from "@/lib/mux/signing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseOutline } from "@/components/learn/course-outline";
import { MuxLessonPlayer } from "@/components/learn/mux-lesson-player";
import { WorkbookViewer } from "@/components/learn/workbook-viewer";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";
import { LessonResources, type LessonResource } from "@/components/learn/lesson-resources";

interface PageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
  searchParams: Promise<{ autoplay?: string }>;
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug, lessonSlug } = await params;
  const { autoplay } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?redirect=/learn/${slug}/${lessonSlug}`);

  const supabase = await getSupabaseServerClient();
  const course = await getCourseBySlugCached(slug).catch(() => null);
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

  // Independent of each other → fetch in parallel (shorter function duration).
  const [hasAccess, completedIds] = await Promise.all([
    userHasAccessToCourse(supabase, user.id, course.id).catch(() => false),
    getCompletedLessonIds(supabase, user.id, course.id).catch(() => [] as string[]),
  ]);
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

  // "Up next" end card data. The next lesson is accessible when the user owns
  // the course or the lesson is a free preview. Mint a signed thumbnail for a
  // premium card; fall back to the course cover in the component.
  const nextAccessible = next ? hasAccess || next.isFree : false;
  const nextMuxReady =
    !!next && next.mux_status === "ready" && !!next.mux_playback_id;
  const nextUp = next
    ? {
        title: next.title,
        moduleTitle: next.moduleTitle,
        href: nextAccessible ? `/learn/${course.slug}/${next.slug}` : null,
        thumbnailUrl:
          nextAccessible && nextMuxReady
            ? buildSignedThumbnailUrl(next.mux_playback_id!, 5)
            : null,
        durationSeconds:
          next.mux_duration_seconds ?? next.video_duration_seconds ?? null,
        locked: !nextAccessible,
      }
    : null;

  const admin = getSupabaseAdminClient();

  // Typed empty fallbacks for the not-accessible / no-video branches.
  const emptyWorkbooks = {
    data: [] as Array<{ id: string; title: string; pdf_path: string }>,
  };
  const emptyResources = {
    data: [] as Array<{
      id: string; title: string; description: string | null;
      kind: string; file_path: string | null; url: string | null;
      file_size_bytes: number | null;
    }>,
  };
  const emptyCaptions = {
    data: [] as Array<{
      start_seconds: number; end_seconds: number; text: string;
    }>,
  };

  // Three independent reads → run together instead of one-after-another.
  const [
    { data: workbooks },
    { data: rawResources },
    { data: captionRows },
  ] = await Promise.all([
    accessibleLesson
      ? admin
          .from("workbooks")
          .select("*")
          .or(`lesson_id.eq.${lesson.id},module_id.eq.${lesson.moduleId}`)
      : Promise.resolve(emptyWorkbooks),
    accessibleLesson
      ? admin
          .from("course_resources")
          .select("id, title, description, kind, file_path, url, file_size_bytes")
          .eq("lesson_id", lesson.id)
          .order("position", { ascending: true })
      : Promise.resolve(emptyResources),
    muxReady
      ? admin
          .from("subtitle_cues")
          .select("start_seconds, end_seconds, text")
          .eq("lesson_id", lesson.id)
          .order("start_seconds", { ascending: true })
      : Promise.resolve(emptyCaptions),
  ]);

  // Resolve signed URLs for workbooks + resources in parallel.
  const [workbooksResolved, lessonResources] = await Promise.all([
    Promise.all(
      (workbooks ?? []).map(async (wb) => ({
        ...wb,
        pdf_path:
          (await resolveStorageUrl(STORAGE_BUCKETS.workbooks, wb.pdf_path)) ??
          wb.pdf_path,
      })),
    ),
    Promise.all(
      (rawResources ?? []).map(async (r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        kind: r.kind as LessonResource["kind"],
        resolvedUrl: r.file_path
          ? await resolveStorageUrl(STORAGE_BUCKETS.resources, r.file_path)
          : null,
        url: r.url,
        file_size_bytes: r.file_size_bytes,
      })),
    ) as Promise<LessonResource[]>,
  ]);

  const captionCues = (captionRows ?? []).map((c) => ({
    start: c.start_seconds,
    end: c.end_seconds,
    text: c.text,
  }));

  // Notes (needs workbook ids) + caption style (needs cues) → parallel.
  const [{ data: notes }, captionPreset] = await Promise.all([
    admin
      .from("workbook_notes")
      .select("workbook_id, content")
      .eq("user_id", user.id)
      .in(
        "workbook_id",
        workbooksResolved.map((w) => w.id),
      ),
    captionCues.length > 0
      ? admin
          .from("courses")
          .select("caption_style")
          .eq("id", course.id)
          .maybeSingle()
          .then(({ data }) => data?.caption_style ?? "classic")
      : Promise.resolve("classic"),
  ]);

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
            captionCues={captionCues}
            captionPreset={captionPreset}
            nextUp={nextUp}
            courseTitle={course.title}
            coverImage={course.cover_image_path}
            overviewHref={`/ondemand/${course.slug}`}
            autoPlay={autoplay === "1"}
            autoMarkComplete={accessibleLesson}
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

          <LessonResources resources={lessonResources} />
        </div>
      </div>
    </div>
  );
}
