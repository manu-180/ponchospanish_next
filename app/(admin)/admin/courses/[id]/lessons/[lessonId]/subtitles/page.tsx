import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { signMuxPlaybackToken } from "@/lib/mux/signing";
import { DEFAULT_PRESET_ID } from "@/lib/subtitles/presets";
import { SubtitleEditor } from "@/components/admin/subtitle-editor";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; lessonId: string }>;
}

export default async function SubtitleEditorPage({ params }: PageProps) {
  const { id, lessonId } = await params;
  const admin = getSupabaseAdminClient();

  const [{ data: course }, { data: lesson }, { data: cues }, { data: sub }] =
    await Promise.all([
      admin
        .from("courses")
        .select("id, slug, title, caption_style")
        .eq("id", id)
        .maybeSingle(),
      admin
        .from("lessons")
        .select(
          "id, title, mux_playback_id, mux_status, mux_duration_seconds",
        )
        .eq("id", lessonId)
        .maybeSingle(),
      admin
        .from("subtitle_cues")
        .select("id, start_seconds, end_seconds, text, language")
        .eq("lesson_id", lessonId)
        .order("start_seconds", { ascending: true }),
      admin
        .from("lesson_subtitles")
        .select("status, language")
        .eq("lesson_id", lessonId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (!course || !lesson) notFound();

  const playbackId = lesson.mux_playback_id;
  const playbackToken =
    playbackId && lesson.mux_status === "ready"
      ? signMuxPlaybackToken({
          playbackId,
          audience: "video",
          ttlSeconds: 60 * 120, // 2h editing session
        })
      : null;

  const language = sub?.language ?? cues?.[0]?.language ?? "en";

  return (
    <SubtitleEditor
      courseId={course.id}
      courseSlug={course.slug}
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      playbackId={playbackId}
      playbackToken={playbackToken}
      durationSeconds={lesson.mux_duration_seconds}
      initialCues={(cues ?? []).map((c) => ({
        id: c.id,
        start_seconds: c.start_seconds,
        end_seconds: c.end_seconds,
        text: c.text,
      }))}
      language={language}
      initialPreset={course.caption_style ?? DEFAULT_PRESET_ID}
    />
  );
}
