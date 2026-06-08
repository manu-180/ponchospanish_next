/**
 * POST /api/admin/upload
 *
 * Generates signed upload URL(s) for Supabase Storage so the browser can PUT
 * files directly (no proxying through Next.js). Used for cover images, ebook
 * PDFs, course resources, etc.
 *
 * Two modes:
 *
 *  • Single (default) — body: { bucket, filename, contentType? }
 *      → { mode: "single", bucket, path, token, signedUrl, publicUrl }
 *    For files that fit under Supabase's 50 MB free-tier per-object cap.
 *
 *  • Chunked — body: { bucket, filename, contentType?, parts: N }   (N > 1)
 *      → { mode: "chunked", bucket, manifestPath, manifest: {...},
 *          parts: [{ index, path, signedUrl, token }, ...] }
 *    For large files split client-side into N parts of < 50 MB each, plus a
 *    tiny manifest. All objects share one timestamped base path under the
 *    admin namespace. See lib/supabase/chunked.ts for the download side.
 *
 * Every object is namespaced under `admin/{profile.id}/{timestamp}-{filename}`
 * to avoid collisions and keep uploads attributable.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { MANIFEST_SUFFIX } from "@/lib/supabase/chunked";

export const dynamic = "force-dynamic";

// Allowlist of API-level bucket aliases (what the client sends).
const ALLOWED_BUCKETS = new Set([
  "covers",
  "digital-products",
  "course-resources",
]);

// Maps the API alias → actual Supabase bucket name.
// "covers" is stored in Supabase as "course-covers".
const SUPABASE_BUCKET: Record<string, string> = {
  "covers": "course-covers",
  "digital-products": "digital-products",
  "course-resources": "course-resources",
};

const Schema = z.object({
  bucket: z.string().min(1),
  // Accept any filename — sanitized server-side before use in the storage path.
  // A restrictive regex was causing "invalid_body" errors for files with accented
  // characters (e.g. "Introducción.pdf", "clase 1 – García.pdf").
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(120).optional(),
  // When > 1, return signed URLs for a chunked (multi-part) upload.
  parts: z.number().int().min(1).max(1000).optional(),
});

/** Strip accents from a string (á→a, ñ→n, ü→u, etc.) */
function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

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

  // Sanitize filename for a safe storage path:
  // 1. Strip accent marks (NFD decomposition + remove combining chars)
  // 2. Replace anything that isn't a word char, dot, dash, space, or parens with _
  const sanitized = stripDiacritics(parsed.data.filename)
    .replace(/[^\w.\-\s()]/g, "_")
    .trim();
  const cleanName = (sanitized || "file").replace(/\s+/g, "-").toLowerCase();
  const basePath = `admin/${profile.id}/${Date.now()}-${cleanName}`;

  const storageBucket = SUPABASE_BUCKET[parsed.data.bucket];
  const admin = getSupabaseAdminClient();

  // ── Chunked mode ──────────────────────────────────────────────────────────
  const partCount = parsed.data.parts ?? 1;
  if (partCount > 1) {
    const parts: Array<{
      index: number;
      path: string;
      signedUrl: string;
      token: string;
    }> = [];

    for (let i = 0; i < partCount; i++) {
      const partPath = `${basePath}.part${i}`;
      const { data, error } = await admin.storage
        .from(storageBucket)
        .createSignedUploadUrl(partPath, { upsert: true });
      if (error || !data) {
        return NextResponse.json(
          { error: "signed_url_failed", message: error?.message ?? "unknown" },
          { status: 500 },
        );
      }
      parts.push({
        index: i,
        path: partPath,
        signedUrl: data.signedUrl,
        token: data.token,
      });
    }

    const manifestPath = `${basePath}${MANIFEST_SUFFIX}`;
    const { data: manifestSign, error: manifestErr } = await admin.storage
      .from(storageBucket)
      .createSignedUploadUrl(manifestPath, { upsert: true });
    if (manifestErr || !manifestSign) {
      return NextResponse.json(
        { error: "signed_url_failed", message: manifestErr?.message ?? "unknown" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      mode: "chunked",
      bucket: parsed.data.bucket,
      manifestPath,
      manifest: {
        path: manifestPath,
        signedUrl: manifestSign.signedUrl,
        token: manifestSign.token,
      },
      parts,
    });
  }

  // ── Single-object mode (default) ──────────────────────────────────────────
  const { data, error } = await admin.storage
    .from(storageBucket)
    .createSignedUploadUrl(basePath, { upsert: true });

  if (error || !data) {
    return NextResponse.json(
      { error: "signed_url_failed", message: error?.message ?? "unknown" },
      { status: 500 },
    );
  }

  // Get the public URL we'll need after upload (or, if bucket is private,
  // the path the client should store).
  const { data: pub } = admin.storage.from(storageBucket).getPublicUrl(basePath);

  return NextResponse.json({
    mode: "single",
    bucket: parsed.data.bucket,
    path: basePath,
    token: data.token,
    signedUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
  });
}
