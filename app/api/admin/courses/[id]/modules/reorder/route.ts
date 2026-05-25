/**
 * PATCH /api/admin/courses/[id]/modules/reorder
 * Body: { order: string[] }  (array of module IDs in new order)
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const Schema = z.object({
  order: z.array(z.string().uuid()).min(1),
});

export async function PATCH(
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
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();

  // Update positions one by one (could be batched with rpc but this is fine for <100 modules)
  const updates = await Promise.all(
    parsed.data.order.map((moduleId, idx) =>
      admin
        .from("modules")
        .update({ position: idx, updated_at: new Date().toISOString() })
        .eq("id", moduleId)
        .eq("course_id", courseId),
    ),
  );
  const failed = updates.find((u) => u.error);
  if (failed?.error) {
    return NextResponse.json(
      { error: "db_error", message: failed.error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
