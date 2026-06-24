/**
 * PATCH /api/admin/digital-products/[id]
 * DELETE /api/admin/digital-products/[id]
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { isChunkedPath, readManifest } from "@/lib/supabase/chunked";

export const dynamic = "force-dynamic";

const PatchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i)
    .optional(),
  subtitle: z.string().trim().max(280).nullable().optional(),
  description: z.string().trim().max(8000).nullable().optional(),
  price_gbp: z.number().min(0).optional(),
  file_path: z.string().min(1).optional(),
  cover_image_path: z.string().nullable().optional(),
  preview_path: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
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
    .from("digital_products")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
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
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const admin = getSupabaseAdminClient();

  // Fetch file paths before deleting the DB row so we can clean up storage.
  const { data: product } = await admin
    .from("digital_products")
    .select("file_path")
    .eq("id", id)
    .single();

  const { error } = await admin.from("digital_products").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }

  // Clean up storage after DB row is gone (best-effort, non-blocking).
  if (product?.file_path) {
    const filePath = product.file_path;
    if (isChunkedPath(filePath)) {
      const manifest = await readManifest(STORAGE_BUCKETS.digitalProducts, filePath);
      const toDelete = manifest ? [...manifest.parts, filePath] : [filePath];
      await admin.storage.from(STORAGE_BUCKETS.digitalProducts).remove(toDelete).catch(() => {});
    } else {
      await admin.storage.from(STORAGE_BUCKETS.digitalProducts).remove([filePath]).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
