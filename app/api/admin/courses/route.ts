/**
 * Admin-only courses CRUD.
 *
 * POST /api/admin/courses   → create
 * (PATCH / DELETE handled in [id]/route.ts)
 */

import { NextResponse } from "next/server";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: {
    title?: string;
    slug?: string;
    level?: string;
    price_gbp?: number;
    subtitle?: string;
    description?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const title = body.title?.trim();
  const slug = body.slug?.trim();
  if (!title || !slug) {
    return NextResponse.json(
      { error: "missing_fields" },
      { status: 400 },
    );
  }

  const validLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const level =
    body.level && validLevels.includes(body.level) ? body.level : "All Levels";

  const price = Number(body.price_gbp ?? 0);
  if (Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "invalid_price" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("courses")
    .insert({
      title,
      slug,
      level,
      price_gbp: price,
      subtitle: body.subtitle?.trim() ?? null,
      description: body.description?.trim() ?? null,
      is_published: false,
      created_by: profile.id,
    })
    .select("id, slug")
    .single();

  if (error) {
    // 23505 = unique_violation (slug clash)
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
