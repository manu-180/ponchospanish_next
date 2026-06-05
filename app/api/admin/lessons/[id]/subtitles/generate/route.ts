/**
 * POST /api/admin/lessons/[id]/subtitles/generate
 *
 * Manual / retry trigger for the Whisper pipeline. This is the RELIABLE path
 * (the webhook auto-trigger is best-effort): it awaits transcription and
 * returns the final status, so the admin sees the result directly.
 *
 * Body: { language?: "auto" | "en" | "es", force?: boolean }
 *   - language defaults to "auto" (Whisper detects the spoken language).
 *   - force overwrites an existing hand-edited track.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, getSupabaseAdminClient } from "@/lib/supabase/server";
import { features } from "@/lib/env";
import { generateSubtitlesForLesson } from "@/lib/transcription/whisper";

export const dynamic = "force-dynamic";
// Transcription is the long pole here — give it room on platforms that honour
// this (Vercel clamps to the plan max).
export const maxDuration = 300;

const BodySchema = z.object({
  language: z.enum(["auto", "en", "es"]).optional(),
  force: z.boolean().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!features.whisper) {
    return NextResponse.json(
      {
        error: "whisper_disabled",
        message: "Falta configurar OPENAI_API_KEY para generar subtítulos.",
      },
      { status: 503 },
    );
  }

  const { id } = await params;

  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    /* empty body is fine — defaults apply */
  }
  const parsed = BodySchema.safeParse(raw ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data: lesson } = await admin
    .from("lessons")
    .select("id, mux_status, mux_playback_id")
    .eq("id", id)
    .maybeSingle();

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (lesson.mux_status !== "ready" || !lesson.mux_playback_id) {
    return NextResponse.json(
      {
        error: "not_ready",
        message: "El video todavía no terminó de procesarse en Mux.",
      },
      { status: 409 },
    );
  }

  const result = await generateSubtitlesForLesson({
    lessonId: id,
    playbackId: lesson.mux_playback_id,
    language: parsed.data.language ?? "auto",
    forceOverwriteEdits: parsed.data.force ?? false,
  });

  if (result.status === "skipped") {
    return NextResponse.json(
      {
        ...result,
        message:
          "Estos subtítulos fueron editados a mano. Usá 'Regenerar' para reemplazarlos.",
      },
      { status: 409 },
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { ...result, message: result.error ?? "No se pudo generar." },
      { status: 500 },
    );
  }
  return NextResponse.json(result);
}
