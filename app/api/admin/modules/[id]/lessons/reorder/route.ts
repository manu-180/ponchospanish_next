/**
 * PATCH /api/admin/modules/[id]/lessons/reorder
 * Body: { order: string[] }
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
  const { id: moduleId } = await params;

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
  const updates = await Promise.all(
    parsed.data.order.map((lessonId, idx) =>
      admin
        .from("lessons")
        .update({ position: idx, updated_at: new Date().toISOString() })
        .eq("id", lessonId)
        .eq("module_id", moduleId),
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
