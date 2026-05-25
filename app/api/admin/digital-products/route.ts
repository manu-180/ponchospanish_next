/**
 * POST /api/admin/digital-products → create
 * (single-item PATCH/DELETE in [id]/route.ts)
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
  subtitle: z.string().trim().max(280).nullable().optional(),
  description: z.string().trim().max(8000).nullable().optional(),
  price_gbp: z.number().min(0),
  file_path: z.string().min(1), // storage path inside `digital-products` bucket
  cover_image_path: z.string().nullable().optional(),
  preview_path: z.string().nullable().optional(),
  file_size_bytes: z.number().int().min(0).nullable().optional(),
});

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

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

  // Auto-slug, ensure unique
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug || "product";
  for (let i = 2; i < 50; i++) {
    const { data: clash } = await admin
      .from("digital_products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = `${baseSlug}-${i}`;
  }

  const { data, error } = await admin
    .from("digital_products")
    .insert({
      title: parsed.data.title,
      slug,
      subtitle: parsed.data.subtitle ?? null,
      description: parsed.data.description ?? null,
      price_gbp: parsed.data.price_gbp,
      file_path: parsed.data.file_path,
      cover_image_path: parsed.data.cover_image_path ?? null,
      preview_path: parsed.data.preview_path ?? null,
      file_size_bytes: parsed.data.file_size_bytes ?? null,
      is_published: false,
      created_by: profile.id,
    })
    .select("id, slug")
    .single();
  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json(data);
}
