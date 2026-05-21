/**
 * POST /api/mux/direct-upload
 *
 * Creates a Mux Direct Upload URL for an admin-uploaded lesson video.
 * The client then PUTs the file to that URL using tus.io for resumable
 * uploads. When Mux finishes processing, our webhook fires.
 *
 * Body:
 *   { lessonId: string }
 *
 * Response:
 *   { uploadId: string, uploadUrl: string }
 */

import { NextResponse } from "next/server";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { getMux, DEFAULT_NEW_ASSET_SETTINGS } from "@/lib/mux/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { lessonId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { lessonId } = body;
  if (!lessonId) {
    return NextResponse.json({ error: "missing_lesson_id" }, { status: 400 });
  }

  // Confirm the lesson exists (so we don't grant uploads to arbitrary IDs)
  const admin = getSupabaseAdminClient();
  const { data: lesson, error: lessonErr } = await admin
    .from("lessons")
    .select("id, mux_status")
    .eq("id", lessonId)
    .maybeSingle();
  if (lessonErr || !lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  try {
    const mux = getMux();
    const upload = await mux.video.uploads.create({
      cors_origin: env.NEXT_PUBLIC_SITE_URL,
      new_asset_settings: {
        playback_policy: ["signed"],
        mp4_support: DEFAULT_NEW_ASSET_SETTINGS.mp4_support,
        max_resolution_tier: DEFAULT_NEW_ASSET_SETTINGS.max_resolution_tier,
        encoding_tier: DEFAULT_NEW_ASSET_SETTINGS.encoding_tier,
        passthrough: lessonId, // echoes back in the webhook payload
      },
      timeout: 7200, // 2h to start (rest of upload is resumable forever)
    });

    // Track the upload id so the webhook can correlate
    await admin
      .from("lessons")
      .update({
        mux_upload_id: upload.id,
        mux_status: "uploading",
      })
      .eq("id", lessonId);

    return NextResponse.json({
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("[mux/direct-upload] failed:", message);
    return NextResponse.json(
      { error: "mux_upload_failed", message },
      { status: 500 },
    );
  }
}
