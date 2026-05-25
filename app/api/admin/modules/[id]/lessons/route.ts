/**
 * POST /api/admin/modules/[id]/lessons
 *   → create a lesson placeholder. The Mux video is uploaded separately via
 *     /api/mux/direct-upload using the returned lesson id.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Schema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  is_free_preview: z.boolean().optional(),
});

export async function POST(
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
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();

  const { data: last } = await admin
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (last?.position ?? -1) + 1;

  // Lessons need a slug unique within their module
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug || `lesson-${position + 1}`;
  for (let i = 2; i < 50; i++) {
    const { data: clash } = await admin
      .from("lessons")
      .select("id")
      .eq("module_id", moduleId)
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = `${baseSlug}-${i}`;
  }

  const { data, error } = await admin
    .from("lessons")
    .insert({
      module_id: moduleId,
      title: parsed.data.title,
      slug,
      description: parsed.data.description ?? null,
      is_free_preview: parsed.data.is_free_preview ?? false,
      position,
      mux_status: "idle",
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
