/**
 * POST /api/admin/lessons/[id]/subtitles/cues → add a new cue.
 *
 * Used by the editor's "add line" and "split" actions. Ordering is by
 * start_seconds, so `position` is just a stored sequence value (max + 1).
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  regenerateVttFromCues,
  type SubtitleLanguage,
} from "@/lib/transcription/whisper";

export const dynamic = "force-dynamic";

const PostSchema = z.object({
  start_seconds: z.number().min(0).max(360000),
  end_seconds: z.number().min(0).max(360000),
  text: z.string().max(2000).default(""),
  language: z.enum(["en", "es"]).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();

  // Resolve the track language: explicit > existing cue > subtitle row > "en".
  let language: SubtitleLanguage = parsed.data.language ?? "en";
  if (!parsed.data.language) {
    const { data: anyCue } = await admin
      .from("subtitle_cues")
      .select("language")
      .eq("lesson_id", id)
      .limit(1)
      .maybeSingle();
    let detected = anyCue?.language ?? undefined;
    if (!detected) {
      const { data: row } = await admin
        .from("lesson_subtitles")
        .select("language")
        .eq("lesson_id", id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      detected = row?.language ?? undefined;
    }
    language = detected === "es" ? "es" : "en";
  }

  // position = max + 1 (kept unique; ordering uses start_seconds elsewhere).
  const { data: maxRow } = await admin
    .from("subtitle_cues")
    .select("position")
    .eq("lesson_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (maxRow?.position ?? -1) + 1;

  const { data: cue, error } = await admin
    .from("subtitle_cues")
    .insert({
      lesson_id: id,
      language,
      position,
      start_seconds: parsed.data.start_seconds,
      end_seconds: parsed.data.end_seconds,
      text: parsed.data.text,
      is_edited: true,
      edited_at: new Date().toISOString(),
      edited_by: auth.profile.id,
    })
    .select("id, language, position, start_seconds, end_seconds, text")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }

  await regenerateVttFromCues({ lessonId: id, language });

  return NextResponse.json(cue);
}
