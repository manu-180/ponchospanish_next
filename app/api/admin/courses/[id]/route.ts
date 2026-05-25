/**
 * Admin-only single course operations.
 *
 *  PATCH  /api/admin/courses/[id]   → update course fields
 *  DELETE /api/admin/courses/[id]   → delete a course (and cascade modules/lessons via DB FK)
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, "slug can only contain letters, numbers, dashes")
    .optional(),
  subtitle: z.string().trim().max(280).nullable().optional(),
  description: z.string().trim().max(8000).nullable().optional(),
  level: z
    .enum(["Beginner", "Intermediate", "Advanced", "All Levels"])
    .optional(),
  price_gbp: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  cover_image_path: z.string().nullable().optional(),
  trailer_video_path: z.string().nullable().optional(),
  learning_outcomes: z.array(z.string().trim().min(1).max(180)).max(20).optional(),
  is_published: z.boolean().optional(),
  money_back_enabled: z.boolean().optional(),
  money_back_days: z.number().int().min(0).max(365).optional(),
});

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { ok: false as const };
  }
  return { ok: true as const, profile };
}

export async function PATCH(
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
  const parsed = PatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("courses")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, slug, is_published")
    .single();

  if (error) {
    if ("code" in error && (error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "slug_taken", message: "That URL slug is already in use." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;

  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("courses").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
