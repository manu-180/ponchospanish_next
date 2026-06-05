/**
 * POST /api/mux/webhook
 *
 * Mux webhook endpoint. Verifies HMAC, idempotency-checks via
 * `webhook_events` table, then handles each event type.
 *
 * We care primarily about:
 *  - `video.asset.ready` → update lesson with playback IDs + duration,
 *    trigger Whisper transcription.
 *  - `video.asset.errored` → flip lesson to errored state.
 *  - `video.upload.asset_created` → link upload → asset early.
 */

import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { verifyMuxSignature } from "@/lib/mux/webhook";
import { muxThumbnailUrl, muxAudioUrl } from "@/lib/mux/client";
import { generateSubtitlesForLesson } from "@/lib/transcription/whisper";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";
// Transcription can take a while; allow the handler to run long enough for
// the best-effort Whisper job to finish on platforms that honour this.
export const maxDuration = 300;

interface MuxAssetPayload {
  id: string;
  status?: string;
  duration?: number;
  playback_ids?: Array<{ id: string; policy: string }>;
  passthrough?: string;
  upload_id?: string;
  static_renditions?: {
    status: string;
    files?: Array<{ ext: string; name: string }>;
  };
}

interface MuxEvent {
  type: string;
  id: string;
  data: MuxAssetPayload;
  created_at?: string;
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("mux-signature");
  const verification = verifyMuxSignature(raw, sig);
  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.reason ?? "invalid_signature" },
      { status: 401 },
    );
  }

  let event: MuxEvent;
  try {
    event = JSON.parse(raw) as MuxEvent;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();

  // Idempotency: write to webhook_events FIRST.
  // If insert fails on unique (provider, event_id), we've already processed.
  const { error: dupErr } = await admin.from("webhook_events").insert({
    provider: "mux",
    event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Json,
  });
  if (dupErr) {
    // 23505 = unique_violation → already processed, return 200
    if (
      "code" in dupErr &&
      (dupErr as { code?: string }).code === "23505"
    ) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    // eslint-disable-next-line no-console
    console.error("[mux/webhook] failed to insert webhook_events:", dupErr);
    // Don't fail the webhook because of audit log issues
  }

  try {
    switch (event.type) {
      case "video.upload.asset_created": {
        // Mux just finished receiving the upload — link the upload to the
        // asset early so we have the asset id even before processing finishes.
        const uploadId = event.data.upload_id ?? event.data.id;
        const assetId = event.data.id;
        if (uploadId) {
          await admin
            .from("lessons")
            .update({ mux_asset_id: assetId, mux_status: "processing" })
            .eq("mux_upload_id", uploadId);
        }
        break;
      }

      case "video.asset.ready": {
        const playbackId = event.data.playback_ids?.[0]?.id ?? null;
        const lessonId = event.data.passthrough ?? null;
        const duration = event.data.duration ?? null;

        if (!lessonId || !playbackId) {
          // eslint-disable-next-line no-console
          console.warn("[mux/webhook] ready event missing IDs:", { lessonId, playbackId });
          break;
        }

        await admin
          .from("lessons")
          .update({
            mux_asset_id: event.data.id,
            mux_playback_id: playbackId,
            mux_status: "ready",
            mux_duration_seconds: duration,
            // Audio-only rendition (`audio.m4a`); used by the Whisper pipeline.
            mux_static_mp4_url: muxAudioUrl(playbackId),
            mux_thumbnail_url: muxThumbnailUrl(playbackId, 5),
          })
          .eq("id", lessonId);

        // Kick off Whisper in the background (best-effort). The audio-only
        // rendition may not be ready yet at asset.ready time; the pipeline
        // retries the fetch, and the admin can always re-run from the UI.
        // `language: "auto"` lets Whisper detect the spoken language.
        // `skipIfPresent` makes a re-delivered event (or an already-generated
        // track) a no-op instead of paying OpenAI twice.
        generateSubtitlesForLesson({
          lessonId,
          playbackId,
          language: "auto",
          skipIfPresent: true,
        }).catch((err) => {
          // eslint-disable-next-line no-console
          console.error("[mux/webhook] whisper trigger failed:", err);
        });
        break;
      }

      case "video.asset.errored": {
        const lessonId = event.data.passthrough ?? null;
        if (lessonId) {
          await admin
            .from("lessons")
            .update({ mux_status: "errored" })
            .eq("id", lessonId);
        }
        break;
      }

      default:
        // Other events we accept but ignore (analytics, etc.)
        break;
    }

    // Mark processed timestamp
    await admin
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("provider", "mux")
      .eq("event_id", event.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[mux/webhook] handler failed:", message);
    return NextResponse.json(
      { error: "handler_failed", message },
      { status: 500 },
    );
  }
}
