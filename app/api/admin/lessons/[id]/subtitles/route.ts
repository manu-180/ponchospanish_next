/**
 * GET /api/admin/lessons/[id]/subtitles
 *
 * Lightweight subtitle status for a lesson — powers the "Subtitles" card in
 * the curriculum builder (and its poll while generating).
 *
 * One track per lesson, so we read the single most-recent row.
 */

import { NextResponse } from "next/server";
import { requireAdmin, getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const admin = getSupabaseAdminClient();

  const { data: row } = await admin
    .from("lesson_subtitles")
    .select("language, status, vtt_path, error, generated_at, updated_at")
    .eq("lesson_id", id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count } = await admin
    .from("subtitle_cues")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", id);

  return NextResponse.json({
    status: row?.status ?? "none",
    language: row?.language ?? null,
    error: row?.error ?? null,
    cuesCount: count ?? 0,
    generatedAt: row?.generated_at ?? null,
    updatedAt: row?.updated_at ?? null,
  });
}
