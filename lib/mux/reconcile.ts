/**
 * Reconcile a lesson's video state against the Mux API (server-only).
 *
 * The lesson row is normally kept in sync by the webhook. When a webhook is
 * missed, delivered out of order, or dropped, the row keeps whatever status it
 * had and nobody notices — the admin UI just spins on "Mux está procesando el
 * video…" forever, with no way out except deleting the lesson.
 *
 * This asks Mux directly what happened to the asset and writes the answer back,
 * so a stuck lesson heals itself. The uploader calls it automatically after a
 * lesson has been `processing` for a while, and the admin can also force it
 * from the UI.
 *
 * Resolving the asset is deliberately forgiving: a lesson may carry an asset
 * id, only an upload id, or — for rows written by the pre-2026-10-28 webhook,
 * which stored the upload id in `mux_asset_id` — an upload id in the asset
 * column. All three paths end at the same asset.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getMux, muxThumbnailUrl, muxAudioUrl } from "@/lib/mux/client";
import { generateSubtitlesForLesson } from "@/lib/transcription/whisper";
import type Mux from "@mux/mux-node";

export type LessonVideoStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "errored";

export interface ReconcileResult {
  /** Lesson status after reconciling. */
  status: LessonVideoStatus;
  /** True when the DB row actually changed. */
  changed: boolean;
  /** Short machine-readable note, handy in logs and for the UI copy. */
  reason:
    | "synced"
    | "already_in_sync"
    | "still_processing"
    | "no_video"
    | "asset_not_found"
    | "lesson_not_found";
  playbackId?: string | null;
  durationSeconds?: number | null;
  thumbnailUrl?: string | null;
}

type MuxAsset = Awaited<ReturnType<Mux["video"]["assets"]["retrieve"]>>;

/** Pick the playback id we actually use (signed policy, else whatever exists). */
function pickPlaybackId(asset: MuxAsset): string | null {
  const ids = asset.playback_ids ?? [];
  const signed = ids.find((p) => p.policy === "signed");
  return signed?.id ?? ids[0]?.id ?? null;
}

/**
 * Find the Mux asset behind a lesson, trying every id the row may hold.
 * Returns `null` when Mux has nothing (upload cancelled, asset deleted…).
 */
async function resolveAsset(
  mux: Mux,
  lesson: { mux_asset_id: string | null; mux_upload_id: string | null },
): Promise<MuxAsset | null> {
  const retrieveAsset = async (id: string | null | undefined) => {
    if (!id) return null;
    try {
      return await mux.video.assets.retrieve(id);
    } catch {
      return null;
    }
  };
  const assetIdFromUpload = async (id: string | null | undefined) => {
    if (!id) return null;
    try {
      const upload = await mux.video.uploads.retrieve(id);
      return upload.asset_id ?? null;
    } catch {
      return null;
    }
  };

  const direct = await retrieveAsset(lesson.mux_asset_id);
  if (direct) return direct;

  // `mux_asset_id` may really be an upload id (old webhook bug), and
  // `mux_upload_id` is the upload id by design.
  for (const candidate of [lesson.mux_upload_id, lesson.mux_asset_id]) {
    const assetId = await assetIdFromUpload(candidate);
    const asset = await retrieveAsset(assetId);
    if (asset) return asset;
  }
  return null;
}

/**
 * Ask Mux what really happened to this lesson's video and write it back.
 * Never throws for the "nothing to do" cases — the caller is a UI poll.
 */
export async function reconcileLessonVideo(
  lessonId: string,
): Promise<ReconcileResult> {
  const admin = getSupabaseAdminClient();
  const { data: lesson, error } = await admin
    .from("lessons")
    .select(
      "id, mux_status, mux_asset_id, mux_upload_id, mux_playback_id, mux_duration_seconds, mux_thumbnail_url",
    )
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !lesson) {
    return { status: "idle", changed: false, reason: "lesson_not_found" };
  }

  const current = lesson.mux_status as LessonVideoStatus;

  // Nothing was ever uploaded — there is no asset to ask about.
  if (!lesson.mux_asset_id && !lesson.mux_upload_id) {
    return { status: current, changed: false, reason: "no_video" };
  }

  const asset = await resolveAsset(getMux(), lesson);

  if (!asset) {
    // Mux has no asset: either the upload never completed or it was removed.
    // Don't invent an error state for a lesson that is still uploading.
    return {
      status: current,
      changed: false,
      reason: current === "uploading" ? "still_processing" : "asset_not_found",
    };
  }

  if (asset.status === "preparing") {
    if (current === "processing") {
      return { status: "processing", changed: false, reason: "still_processing" };
    }
    await admin
      .from("lessons")
      .update({ mux_asset_id: asset.id, mux_status: "processing" })
      .eq("id", lessonId);
    return { status: "processing", changed: true, reason: "synced" };
  }

  if (asset.status === "errored") {
    if (current === "errored") {
      return { status: "errored", changed: false, reason: "already_in_sync" };
    }
    await admin
      .from("lessons")
      .update({ mux_asset_id: asset.id, mux_status: "errored" })
      .eq("id", lessonId);
    return { status: "errored", changed: true, reason: "synced" };
  }

  // asset.status === "ready"
  const playbackId = pickPlaybackId(asset);
  if (!playbackId) {
    // Ready without a playback id shouldn't happen; leave the row alone
    // rather than publishing a lesson nobody can play.
    return { status: current, changed: false, reason: "asset_not_found" };
  }

  const thumbnailUrl = muxThumbnailUrl(playbackId, 5);
  const durationSeconds = asset.duration ?? lesson.mux_duration_seconds ?? null;
  const alreadyInSync =
    current === "ready" &&
    lesson.mux_asset_id === asset.id &&
    lesson.mux_playback_id === playbackId;

  if (alreadyInSync) {
    return {
      status: "ready",
      changed: false,
      reason: "already_in_sync",
      playbackId,
      durationSeconds,
      thumbnailUrl,
    };
  }

  await admin
    .from("lessons")
    .update({
      mux_asset_id: asset.id,
      mux_playback_id: playbackId,
      mux_status: "ready",
      mux_duration_seconds: durationSeconds,
      mux_static_mp4_url: muxAudioUrl(playbackId),
      mux_thumbnail_url: thumbnailUrl,
    })
    .eq("id", lessonId);

  // Same best-effort transcription the webhook kicks off. `skipIfPresent`
  // keeps a lesson that already has subtitles from paying for a second run.
  generateSubtitlesForLesson({
    lessonId,
    playbackId,
    language: "auto",
    skipIfPresent: true,
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error("[mux/reconcile] whisper trigger failed:", err);
  });

  return {
    status: "ready",
    changed: true,
    reason: "synced",
    playbackId,
    durationSeconds,
    thumbnailUrl,
  };
}
