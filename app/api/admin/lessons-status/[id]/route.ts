/**
 * GET  /api/admin/lessons-status/[id]
 * POST /api/admin/lessons-status/[id]
 *
 * GET is the lightweight poll used by the Mux uploader to know when a
 * `processing` lesson becomes `ready`. It only reads the row, so it depends on
 * the webhook having arrived.
 *
 * POST re-checks the asset against the Mux API and writes the answer back.
 * That's the escape hatch for a lesson the webhook left stuck on `processing`
 * (missed or out-of-order delivery); the uploader fires it on its own once a
 * lesson has been processing longer than Mux normally takes.
 *
 * Both return the same shape so the client can treat them alike.
 */

import { NextResponse } from "next/server";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { buildSignedThumbnailUrl } from "@/lib/mux/signing";
import { reconcileLessonVideo } from "@/lib/mux/reconcile";

export const dynamic = "force-dynamic";

/** Mux assets use a signed playback policy, so the unsigned thumbnail URL
 *  stored in the DB returns 403 in the browser. Sign a fresh one per response. */
function signThumbnail(
  status: string,
  playbackId: string | null,
  stored: string | null,
): string | null {
  return status === "ready" && playbackId
    ? buildSignedThumbnailUrl(playbackId, 5)
    : stored;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("lessons")
    .select(
      "mux_status, mux_thumbnail_url, mux_duration_seconds, mux_playback_id",
    )
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    status: data.mux_status,
    thumbnailUrl: signThumbnail(
      data.mux_status,
      data.mux_playback_id,
      data.mux_thumbnail_url,
    ),
    durationSeconds: data.mux_duration_seconds,
    playbackId: data.mux_playback_id,
  });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;

  let result;
  try {
    result = await reconcileLessonVideo(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[lessons-status] reconcile failed:", message);
    return NextResponse.json(
      { error: "reconcile_failed", message },
      { status: 502 },
    );
  }

  if (result.reason === "lesson_not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    status: result.status,
    thumbnailUrl: signThumbnail(
      result.status,
      result.playbackId ?? null,
      result.thumbnailUrl ?? null,
    ),
    durationSeconds: result.durationSeconds ?? null,
    playbackId: result.playbackId ?? null,
    changed: result.changed,
    reason: result.reason,
  });
}
