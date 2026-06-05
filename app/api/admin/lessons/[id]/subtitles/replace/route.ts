/**
 * POST /api/admin/lessons/[id]/subtitles/replace → find & replace across all
 * cues in one shot (e.g. fix a name Whisper kept mishearing). Re-renders the
 * VTT once at the end.
 *
 * Body: { find: string, replace?: string, caseSensitive?: boolean }
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  regenerateVttFromCues,
  type SubtitleLanguage,
} from "@/lib/transcription/whisper";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  find: z.string().min(1).max(500),
  replace: z.string().max(500).default(""),
  caseSensitive: z.boolean().optional(),
});

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  const { find, replace, caseSensitive } = parsed.data;

  const admin = getSupabaseAdminClient();
  const { data: cues } = await admin
    .from("subtitle_cues")
    .select("id, language, text")
    .eq("lesson_id", id);

  const re = new RegExp(escapeRegExp(find), caseSensitive ? "g" : "gi");
  let replaced = 0;
  let language: SubtitleLanguage | null = null;

  for (const c of cues ?? []) {
    language = (c.language === "es" ? "es" : "en") as SubtitleLanguage;
    const next = c.text.replace(re, replace);
    if (next !== c.text) {
      await admin
        .from("subtitle_cues")
        .update({
          text: next,
          is_edited: true,
          edited_at: new Date().toISOString(),
          edited_by: auth.profile.id,
        })
        .eq("id", c.id);
      replaced += 1;
    }
  }

  if (replaced > 0 && language) {
    await regenerateVttFromCues({ lessonId: id, language });
  }

  return NextResponse.json({ ok: true, replaced });
}
