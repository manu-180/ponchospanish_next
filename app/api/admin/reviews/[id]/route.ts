import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, getSupabaseAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return null;
  return profile;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await assertAdmin();
  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  const { is_visible, is_pinned } = body as Record<string, unknown>;

  if (typeof is_visible === "boolean") patch.is_visible = is_visible;
  if (typeof is_pinned === "boolean") patch.is_pinned = is_pinned;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  patch.updated_at = new Date().toISOString();

  const admin = getSupabaseAdminClient();
  const { error } = await admin
    .from("course_reviews")
    .update(patch as never)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await assertAdmin();
  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("course_reviews").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
