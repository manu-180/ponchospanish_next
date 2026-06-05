/**
 * PATCH  /api/admin/lessons/[id]/subtitles/cues/[cueId] → edit text/timing
 * DELETE /api/admin/lessons/[id]/subtitles/cues/[cueId] → remove a cue
 *
 * Every mutation re-renders the VTT from the current cues and flips the track
 * to "edited" (via regenerateVttFromCues) so the auto-pipeline won't clobber
 * hand edits.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  regenerateVttFromCues,
  type SubtitleLanguage,
} from "@/lib/transcription/whisper";

export const dynamic = "force-dynamic";

const PatchSchema = z
  .object({
    text: z.string().max(2000).optional(),
    start_seconds: z.number().min(0).max(360000).optional(),
    end_seconds: z.number().min(0).max(360000).optional(),
  })
  .refine(
    (d) =>
      d.text !== undefined ||
      d.start_seconds !== undefined ||
      d.end_seconds !== undefined,
    { message: "nothing_to_update" },
  );

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; cueId: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id, cueId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();
  const { data: cue, error } = await admin
    .from("subtitle_cues")
    .update({
      ...parsed.data,
      is_edited: true,
      edited_at: new Date().toISOString(),
      edited_by: auth.profile.id,
    })
    .eq("id", cueId)
    .eq("lesson_id", id)
    .select("id, language, position, start_seconds, end_seconds, text")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  if (!cue) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await regenerateVttFromCues({
    lessonId: id,
    language: cue.language as SubtitleLanguage,
  });

  return NextResponse.json(cue);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; cueId: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id, cueId } = await params;

  const admin = getSupabaseAdminClient();
  const { data: cue } = await admin
    .from("subtitle_cues")
    .select("language")
    .eq("id", cueId)
    .eq("lesson_id", id)
    .maybeSingle();

  if (!cue) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await admin.from("subtitle_cues").delete().eq("id", cueId);

  await regenerateVttFromCues({
    lessonId: id,
    language: cue.language as SubtitleLanguage,
  });

  return NextResponse.json({ ok: true });
}
