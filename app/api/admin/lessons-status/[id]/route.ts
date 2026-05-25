/**
 * GET /api/admin/lessons-status/[id]
 *
 * Lightweight polling endpoint used by the Mux uploader to know when a
 * `processing` lesson becomes `ready`. Returns only the fields the UI needs.
 */

import { NextResponse } from "next/server";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    thumbnailUrl: data.mux_thumbnail_url,
    durationSeconds: data.mux_duration_seconds,
    playbackId: data.mux_playback_id,
  });
}
