/**
 * Whisper transcription pipeline.
 *
 * Each lesson gets ONE subtitle track. We let Whisper auto-detect the spoken
 * language (Anto's videos mix UK English + Spanish) unless an explicit
 * language is requested. Forcing a language on mixed/foreign audio produces
 * garbage, so "auto" is the default.
 *
 * Output:
 *   - One row in `lesson_subtitles` per lesson (keyed on lesson_id).
 *   - One row per timed segment in `subtitle_cues`.
 *   - A rendered VTT uploaded to the `course-subtitles` bucket at
 *     `{lessonId}/{lang}.vtt`.
 *
 * Triggered by the Mux `video.asset.ready` webhook (best-effort) AND by the
 * admin "Generate subtitles" button (the reliable path — it awaits and shows
 * the result).
 */

import OpenAI from "openai";
import { env } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { buildSignedAudioUrl, buildSignedStaticMp4Url } from "@/lib/mux/signing";
import { STORAGE_BUCKETS, subtitlesPath } from "@/lib/supabase/storage";
import { toErrorMessage } from "@/lib/utils";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  _openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return _openai;
}

/** ISO codes we render/store. Whisper may detect others; we map to these. */
export type SubtitleLanguage = "en" | "es";
/** What a caller can request. "auto" → let Whisper detect. */
export type LanguageChoice = "auto" | SubtitleLanguage;

/** OpenAI Whisper hard limit on uploaded file size. */
const WHISPER_MAX_BYTES = 25 * 1024 * 1024;

interface WhisperSegment {
  id?: number;
  start: number;
  end: number;
  text: string;
}

interface WhisperResponse {
  language?: string;
  duration?: number;
  text: string;
  segments?: WhisperSegment[];
}

/**
 * Whisper's verbose_json returns the language as a full English name
 * ("english", "spanish", …). Map to the ISO code we use for storage / the
 * VTT path / the <track srclang>. Falls back to "en".
 */
export function normalizeWhisperLang(lang: string | undefined): SubtitleLanguage {
  const l = (lang ?? "").toLowerCase();
  if (l.startsWith("es") || l.includes("spanish") || l.includes("castellano")) {
    return "es";
  }
  return "en";
}

/**
 * Fetch the audio source bytes from the first candidate URL that works,
 * retrying a few times per URL. Mux generates static renditions
 * asynchronously, so right after `asset.ready` the URL can briefly 404/412
 * until the rendition is encoded.
 *
 * `candidates` is tried in order: the audio-only `audio.m4a` first (cheap,
 * preferred), then the legacy `low.mp4` for assets created before the
 * audio-only switch.
 */
async function fetchAudioBlob(candidates: string[]): Promise<Blob> {
  const MAX_ATTEMPTS = 4;
  let lastStatus = 0;
  for (const url of candidates) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > WHISPER_MAX_BYTES) {
          throw new Error(
            `El audio pesa ${(blob.size / 1024 / 1024).toFixed(0)} MB y supera el límite de 25 MB de la transcripción. Probá con un video más corto.`,
          );
        }
        return blob;
      }
      lastStatus = res.status;
      // 404/412 → rendition not ready yet; wait and retry. Any other status
      // (e.g. 403) → stop retrying this URL and move to the next candidate.
      if (res.status !== 404 && res.status !== 412) break;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
  throw new Error(
    lastStatus === 403
      ? "No se pudo leer el audio del video (403). Revisá la firma de Mux."
      : `No se pudo leer el audio del video (${lastStatus || "sin respuesta"}). Esperá a que Mux termine de procesar y reintentá.`,
  );
}

/**
 * Transcribe a remote audio/video URL with Whisper.
 * Accepts one URL or an ordered list of candidate URLs (audio-only first,
 * legacy MP4 fallback). When `language` is omitted, Whisper auto-detects
 * (best for mixed speech).
 */
export async function transcribeFromUrl(
  url: string | string[],
  language?: SubtitleLanguage,
): Promise<WhisperResponse> {
  const candidates = Array.isArray(url) ? url : [url];
  const blob = await fetchAudioBlob(candidates);

  // OpenAI SDK accepts a File-like object. The filename extension hints the
  // server-side format detector; .m4a is one of Whisper's supported formats.
  const file = new File([blob], "lesson.m4a", { type: "audio/mp4" });

  const response = await getOpenAI().audio.transcriptions.create({
    file,
    model: "whisper-1",
    // Only pin the language when explicitly requested.
    ...(language ? { language } : {}),
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  // verbose_json is typed `any` in the OpenAI SDK, so we cast.
  return response as unknown as WhisperResponse;
}

export interface GenerateResult {
  ok: boolean;
  status: "auto" | "skipped" | "failed";
  language?: SubtitleLanguage;
  cues?: number;
  error?: string;
}

/**
 * End-to-end pipeline for ONE lesson: sign the audio URL, transcribe,
 * write cues, render+upload the VTT, and update `lesson_subtitles`.
 *
 * One track per lesson: stale non-edited rows/cues are cleared first so a
 * re-run never leaves duplicates. An "edited" track is preserved unless
 * `forceOverwriteEdits` is set.
 */
export async function generateSubtitlesForLesson(args: {
  lessonId: string;
  playbackId: string;
  language?: LanguageChoice;
  /** If true, even subtitles marked "edited" get overwritten. */
  forceOverwriteEdits?: boolean;
  /**
   * If true, skip (without calling Whisper) when a track already exists or is
   * in flight. The webhook auto-trigger passes this so a re-delivered event —
   * or a track the admin already generated — never pays for a second
   * transcription. The manual admin button leaves it false (intentional regen).
   */
  skipIfPresent?: boolean;
}): Promise<GenerateResult> {
  const {
    lessonId,
    playbackId,
    language = "auto",
    forceOverwriteEdits = false,
    skipIfPresent = false,
  } = args;

  const admin = getSupabaseAdminClient();

  // Guard: don't blow away hand-edited subtitles unless forced.
  const { data: existingRows } = await admin
    .from("lesson_subtitles")
    .select("status")
    .eq("lesson_id", lessonId);

  if (
    !forceOverwriteEdits &&
    (existingRows ?? []).some((r) => r.status === "edited")
  ) {
    return { ok: false, status: "skipped" };
  }

  // Cost guard for the auto (webhook) path: a finished or in-flight track
  // already exists → don't pay OpenAI again. Statuses we treat as "present":
  // auto / edited / generating.
  if (
    skipIfPresent &&
    (existingRows ?? []).some(
      (r) =>
        r.status === "auto" ||
        r.status === "edited" ||
        r.status === "generating",
    )
  ) {
    return { ok: false, status: "skipped" };
  }

  // Clear any previous track for a clean single-track regeneration.
  await admin.from("subtitle_cues").delete().eq("lesson_id", lessonId);
  await admin.from("lesson_subtitles").delete().eq("lesson_id", lessonId);

  // Provisional "generating" row so the admin UI shows a spinner immediately.
  const provisionalLang: SubtitleLanguage = language === "auto" ? "en" : language;
  await admin.from("lesson_subtitles").insert({
    lesson_id: lessonId,
    language: provisionalLang,
    status: "generating",
    error: null,
  });

  try {
    // Prefer the cheap audio-only rendition; fall back to the legacy low.mp4
    // for assets created before the audio-only switch.
    const audioCandidates = [
      buildSignedAudioUrl(playbackId),
      buildSignedStaticMp4Url(playbackId, "low"),
    ];
    const transcript = await transcribeFromUrl(
      audioCandidates,
      language === "auto" ? undefined : language,
    );
    const detectedLang =
      language === "auto" ? normalizeWhisperLang(transcript.language) : language;
    const segments = transcript.segments ?? [];

    if (segments.length === 0) {
      // Whisper returned no timed segments — usually silent/empty audio. Don't
      // mark the track "auto" with zero cues; surface a clear, actionable error.
      throw new Error(
        "La transcripción no devolvió texto. ¿El video tiene audio audible?",
      );
    }

    // Insert cues
    const rows = segments.map((seg, idx) => ({
      lesson_id: lessonId,
      language: detectedLang,
      position: idx,
      start_seconds: seg.start,
      end_seconds: seg.end,
      text: seg.text.trim(),
    }));
    const { error: cuesError } = await admin
      .from("subtitle_cues")
      .insert(rows);
    if (cuesError) {
      throw new Error(`No se pudieron guardar las líneas: ${cuesError.message}`);
    }

    // Render VTT + upload
    const vtt = renderVtt(segments);
    const path = subtitlesPath(lessonId, detectedLang);
    const { error: uploadError } = await admin.storage
      .from(STORAGE_BUCKETS.subtitles)
      .upload(path, new Blob([vtt], { type: "text/vtt" }), {
        upsert: true,
        contentType: "text/vtt",
      });
    if (uploadError) {
      throw new Error(`No se pudo subir el VTT: ${uploadError.message}`);
    }

    // Finalize the row (update language from the provisional value).
    await admin
      .from("lesson_subtitles")
      .update({
        language: detectedLang,
        status: "auto",
        vtt_path: path,
        generated_at: new Date().toISOString(),
        error: null,
      })
      .eq("lesson_id", lessonId);

    return {
      ok: true,
      status: "auto",
      language: detectedLang,
      cues: segments.length,
    };
  } catch (err) {
    const message = toErrorMessage(err, "No se pudo generar la transcripción.");
    await admin
      .from("lesson_subtitles")
      .update({ status: "failed", error: message })
      .eq("lesson_id", lessonId);
    // eslint-disable-next-line no-console
    console.error(`[whisper] failed for ${lessonId}:`, message);
    return { ok: false, status: "failed", error: message };
  }
}

/**
 * Render a Whisper segments array (or DB cues) to WebVTT.
 * Spec: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
 */
export function renderVtt(
  segments: Array<{ start: number; end: number; text: string }>,
): string {
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
  const safe = Math.max(0, seconds);
  const hh = Math.floor(safe / 3600);
  const mm = Math.floor((safe % 3600) / 60);
  const ss = Math.floor(safe % 60);
  const ms = Math.round((safe - Math.floor(safe)) * 1000);
  return (
    `${String(hh).padStart(2, "0")}:` +
    `${String(mm).padStart(2, "0")}:` +
    `${String(ss).padStart(2, "0")}.` +
    `${String(ms).padStart(3, "0")}`
  );
}

/**
 * Re-render the VTT from the current `subtitle_cues` rows. Called by the
 * per-cue editor after an admin edit; marks the track "edited" so the
 * auto-pipeline won't overwrite it.
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
    // Order by time, not position — so inserting/deleting cues never needs a
    // position renumber to keep the VTT in the right order.
    .order("start_seconds", { ascending: true });

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
