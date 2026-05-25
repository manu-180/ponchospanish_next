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
import { muxThumbnailUrl, muxStaticMp4Url } from "@/lib/mux/client";
import { generateSubtitlesForLesson } from "@/lib/transcription/whisper";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

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

        const staticMp4 = muxStaticMp4Url(playbackId, "high");

        await admin
          .from("lessons")
          .update({
            mux_asset_id: event.data.id,
            mux_playback_id: playbackId,
            mux_status: "ready",
            mux_duration_seconds: duration,
            mux_static_mp4_url: staticMp4,
            mux_thumbnail_url: muxThumbnailUrl(playbackId, 5),
          })
          .eq("id", lessonId);

        // Kick off Whisper in the background.
        // We don't await — if it fails, the admin can re-run from the UI.
        generateSubtitlesForLesson({
          lessonId,
          audioUrl: staticMp4,
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
