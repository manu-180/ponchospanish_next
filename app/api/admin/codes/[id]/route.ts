/**
 * Admin-only single code ops.
 *
 *  DELETE /api/admin/codes/[id]?kind=free|discount  → delete one
 */

import { NextResponse } from "next/server";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { ok: false as const };
  }
  return { ok: true as const, profile };
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");

  if (kind !== "free" && kind !== "discount") {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const table = kind === "free" ? "access_codes" : "discount_codes";
  const { error } = await admin.from(table).delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
