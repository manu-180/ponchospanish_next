/**
 * PATCH  /api/admin/resources/[id]  — update title, description, position, is_free_preview
 * DELETE /api/admin/resources/[id]  — delete resource (and optionally its storage file)
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  position: z.number().int().min(0).optional(),
  is_free_preview: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;

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
  const { data, error } = await admin
    .from("course_resources")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getSupabaseAdminClient();

  // Fetch before deleting so we can clean up storage
  const { data: resource } = await admin
    .from("course_resources")
    .select("file_path")
    .eq("id", id)
    .single();

  const { error } = await admin.from("course_resources").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }

  // Best-effort storage cleanup (don't fail the request if this errors)
  if (resource?.file_path) {
    await admin.storage.from("course-resources").remove([resource.file_path]).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
