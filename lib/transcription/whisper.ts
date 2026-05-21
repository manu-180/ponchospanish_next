/**
 * Whisper transcription pipeline.
 *
 * Triggered by the Mux `video.asset.ready` webhook. For each lesson we
 * generate TWO subtitle tracks (en + es) in parallel by calling Whisper
 * twice with explicit `language` so it doesn't auto-detect.
 *
 * Output:
 *   - One row in `lesson_subtitles` per (lesson_id, language).
 *   - One row per timed segment in `subtitle_cues`.
 *   - A rendered VTT uploaded to the `course-subtitles` bucket at
 *     `{lessonId}/{lang}.vtt`.
 */

import OpenAI from "openai";
import { env } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  STORAGE_BUCKETS,
  subtitlesPath,
} from "@/lib/supabase/storage";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  _openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return _openai;
}

export type SubtitleLanguage = "en" | "es";

interface WhisperSegment {
  id?: number;
  seek?: number;
  start: number;
  end: number;
  text: string;
}

interface WhisperResponse {
  task?: string;
  language?: string;
  duration?: number;
  text: string;
  segments?: WhisperSegment[];
}

/**
 * Transcribe a remote audio/video URL with Whisper for one language.
 *
 * Internally we fetch the bytes (Whisper SDK accepts a File / Blob,
 * not a URL).
 */
export async function transcribeFromUrl(
  url: string,
  language: SubtitleLanguage,
): Promise<WhisperResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch source audio (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // OpenAI SDK accepts a File-like object. We construct one from the
  // buffer so we control the filename hint (extension matters for the
  // server-side detector).
  const file = new File([buffer], "lesson.mp4", { type: "video/mp4" });

  const response = await getOpenAI().audio.transcriptions.create({
    file,
    model: "whisper-1",
    language,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  // The verbose_json response is typed `any` in OpenAI SDK v6, so we cast.
  return response as unknown as WhisperResponse;
}

/**
 * End-to-end pipeline: transcribe both EN+ES, write cues, upload VTT,
 * update lesson_subtitles status. Idempotent on lesson_subtitles via
 * unique (lesson_id, language) — replaces existing rows on re-run.
 *
 * Safe to call multiple times for the same lesson; the caller is
 * responsible for deciding whether to overwrite "edited" subtitles.
 */
export async function generateSubtitlesForLesson(args: {
  lessonId: string;
  audioUrl: string;
  languages?: SubtitleLanguage[];
  /** If true, even subtitles marked "edited" get overwritten. */
  forceOverwriteEdits?: boolean;
}): Promise<{ generated: SubtitleLanguage[]; skipped: SubtitleLanguage[] }> {
  const {
    lessonId,
    audioUrl,
    languages = ["en", "es"],
    forceOverwriteEdits = false,
  } = args;

  const admin = getSupabaseAdminClient();
  const generated: SubtitleLanguage[] = [];
  const skipped: SubtitleLanguage[] = [];

  for (const language of languages) {
    // Check existing row → skip if edited & not forcing
    const { data: existing } = await admin
      .from("lesson_subtitles")
      .select("status")
      .eq("lesson_id", lessonId)
      .eq("language", language)
      .maybeSingle();

    if (existing?.status === "edited" && !forceOverwriteEdits) {
      skipped.push(language);
      continue;
    }

    // Mark "generating" so the admin UI shows a spinner
    await admin
      .from("lesson_subtitles")
      .upsert(
        {
          lesson_id: lessonId,
          language,
          status: "generating",
          error: null,
        },
        { onConflict: "lesson_id,language" },
      );

    try {
      const transcript = await transcribeFromUrl(audioUrl, language);
      const segments = transcript.segments ?? [];

      // Wipe previous cues for this (lesson, language)
      await admin
        .from("subtitle_cues")
        .delete()
        .eq("lesson_id", lessonId)
        .eq("language", language);

      // Bulk-insert new cues
      if (segments.length > 0) {
        const rows = segments.map((seg, idx) => ({
          lesson_id: lessonId,
          language,
          position: idx,
          start_seconds: seg.start,
          end_seconds: seg.end,
          text: seg.text.trim(),
        }));
        await admin.from("subtitle_cues").insert(rows);
      }

      // Render VTT + upload
      const vtt = renderVtt(segments);
      const path = subtitlesPath(lessonId, language);
      await admin.storage
        .from(STORAGE_BUCKETS.subtitles)
        .upload(path, new Blob([vtt], { type: "text/vtt" }), {
          upsert: true,
          contentType: "text/vtt",
        });

      // Mark "auto" (or keep "edited" if forced but caller wants explicit)
      await admin
        .from("lesson_subtitles")
        .update({
          status: "auto",
          vtt_path: path,
          generated_at: new Date().toISOString(),
          error: null,
        })
        .eq("lesson_id", lessonId)
        .eq("language", language);

      generated.push(language);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await admin
        .from("lesson_subtitles")
        .update({ status: "failed", error: message })
        .eq("lesson_id", lessonId)
        .eq("language", language);
      // eslint-disable-next-line no-console
      console.error(`[whisper] failed for ${lessonId}/${language}:`, message);
    }
  }

  return { generated, skipped };
}

/**
 * Render a Whisper segments array to WebVTT.
 * Spec: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
 */
export function renderVtt(segments: WhisperSegment[]): string {
  const header = "WEBVTT\n\n";
  const cues = segments
    .map((seg, i) => {
      const start = formatVttTimestamp(seg.start);
      const end = formatVttTimestamp(seg.end);
      const text = seg.text.trim();
      return `${i + 1}\n${start} --> ${end}\n${text}\n`;
    })
    .join("\n");
  return header + cues;
}

function formatVttTimestamp(seconds: number): string {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return (
    `${String(hh).padStart(2, "0")}:` +
    `${String(mm).padStart(2, "0")}:` +
    `${String(ss).padStart(2, "0")}.` +
    `${String(ms).padStart(3, "0")}`
  );
}

/**
 * Re-render a VTT from the current `subtitle_cues` rows in the DB.
 * Used by the per-cue editor endpoint after an admin edit.
 */
export async function regenerateVttFromCues(args: {
  lessonId: string;
  language: SubtitleLanguage;
}): Promise<{ path: string }> {
  const { lessonId, language } = args;
  const admin = getSupabaseAdminClient();

  const { data: cues } = await admin
    .from("subtitle_cues")
    .select("position, start_seconds, end_seconds, text")
    .eq("lesson_id", lessonId)
    .eq("language", language)
    .order("position", { ascending: true });

  const vtt = renderVtt(
    (cues ?? []).map((c) => ({
      start: c.start_seconds,
      end: c.end_seconds,
      text: c.text,
    })),
  );

  const path = subtitlesPath(lessonId, language);
  await admin.storage
    .from(STORAGE_BUCKETS.subtitles)
    .upload(path, new Blob([vtt], { type: "text/vtt" }), {
      upsert: true,
      contentType: "text/vtt",
    });

  await admin
    .from("lesson_subtitles")
    .update({
      status: "edited",
      vtt_path: path,
      updated_at: new Date().toISOString(),
    })
    .eq("lesson_id", lessonId)
    .eq("language", language);

  return { path };
}
