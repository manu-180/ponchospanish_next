/**
 * Module operations within a course.
 *
 *  POST  /api/admin/courses/[id]/modules           → create module
 *  PATCH /api/admin/courses/[id]/modules/reorder   → bulk reorder
 *
 * The reorder endpoint is handled by /reorder/route.ts.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  is_free: z.boolean().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id: courseId } = await params;

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

  // Get next position
  const { data: last } = await admin
    .from("modules")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;

  // Find a unique slug within the course
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug || `module-${position + 1}`;
  for (let i = 2; i < 50; i++) {
    const { data: clash } = await admin
      .from("modules")
      .select("id")
      .eq("course_id", courseId)
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = `${baseSlug}-${i}`;
  }

  const { data, error } = await admin
    .from("modules")
    .insert({
      course_id: courseId,
      title: parsed.data.title,
      slug,
      description: parsed.data.description ?? null,
      is_free: parsed.data.is_free ?? false,
      position,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json(data);
}
