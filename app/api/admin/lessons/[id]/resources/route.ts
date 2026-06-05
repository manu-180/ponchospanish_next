/**
 * GET  /api/admin/lessons/[id]/resources  — list resources for a lesson
 * POST /api/admin/lessons/[id]/resources  — create a new resource
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CreateSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("link"),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(500).optional().nullable(),
    url: z.string().url(),
    is_free_preview: z.boolean().default(false),
  }),
  z.object({
    kind: z.enum(["pdf", "zip", "audio", "video", "image", "doc", "spreadsheet", "presentation", "other"]),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(500).optional().nullable(),
    file_path: z.string().min(1),
    file_size_bytes: z.number().int().positive().optional().nullable(),
    is_free_preview: z.boolean().default(false),
  }),
]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id: lessonId } = await params;
  const admin = getSupabaseAdminClient();

  const { data, error } = await admin
    .from("course_resources")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id: lessonId } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();

  // Get the lesson to obtain course_id
  const { data: lesson, error: lessonErr } = await admin
    .from("lessons")
    .select("module_id, modules!inner(course_id)")
    .eq("id", lessonId)
    .single();

  if (lessonErr || !lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  const courseId = (lesson.modules as { course_id: string }).course_id;

  // Determine next position
  const { count } = await admin
    .from("course_resources")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", lessonId);

  const position = count ?? 0;

  const insertPayload: {
    course_id: string;
    lesson_id: string;
    kind: string;
    title: string;
    description: string | null;
    url: string | null;
    file_path: string | null;
    file_size_bytes: number | null;
    is_free_preview: boolean;
    position: number;
  } =
    parsed.data.kind === "link"
      ? {
          course_id: courseId,
          lesson_id: lessonId,
          kind: "link",
          title: parsed.data.title,
          description: parsed.data.description ?? null,
          url: parsed.data.url,
          file_path: null,
          file_size_bytes: null,
          is_free_preview: parsed.data.is_free_preview,
          position,
        }
      : {
          course_id: courseId,
          lesson_id: lessonId,
          kind: parsed.data.kind,
          title: parsed.data.title,
          description: parsed.data.description ?? null,
          url: null,
          file_path: parsed.data.file_path,
          file_size_bytes: parsed.data.file_size_bytes ?? null,
          is_free_preview: parsed.data.is_free_preview,
          position,
        };

  const { data, error } = await admin
    .from("course_resources")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
