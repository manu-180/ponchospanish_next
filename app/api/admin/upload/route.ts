/**
 * POST /api/admin/upload
 *
 * Generates a signed upload URL for Supabase Storage so the browser can PUT
 * a file directly (no proxying through Next.js). Used for cover images, ebook
 * PDFs, course resources, etc.
 *
 * Body: { bucket: string, path: string }
 *
 * The bucket must be in our allowlist below. The path is namespaced under
 * `admin/{profile.id}/{timestamp}-{filename}` to avoid collisions and keep
 * uploads attributable.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Allowlist — extend as we add features.
const ALLOWED_BUCKETS = new Set([
  "covers",
  "digital-products",
  "course-resources",
]);

const Schema = z.object({
  bucket: z.string().min(1),
  filename: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[\w.\- ()]+$/, "filename has invalid characters"),
  contentType: z.string().min(1).max(120).optional(),
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
  if (!ALLOWED_BUCKETS.has(parsed.data.bucket)) {
    return NextResponse.json({ error: "bucket_not_allowed" }, { status: 400 });
  }

  const cleanName = parsed.data.filename.replace(/\s+/g, "-").toLowerCase();
  const path = `admin/${profile.id}/${Date.now()}-${cleanName}`;

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from(parsed.data.bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: "signed_url_failed", message: error?.message ?? "unknown" },
      { status: 500 },
    );
  }

  // Get the public URL we'll need after upload (or, if bucket is private,
  // the path the client should store).
  const { data: pub } = admin.storage.from(parsed.data.bucket).getPublicUrl(path);

  return NextResponse.json({
    bucket: parsed.data.bucket,
    path,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
  });
}
