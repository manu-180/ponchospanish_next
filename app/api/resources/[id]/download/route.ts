/**
 * GET /api/resources/[id]/download
 *
 * Student-facing download proxy for course resources. Used for CHUNKED
 * resources (stored as a manifest + parts) which can't be served by a plain
 * signed URL — the server reads the manifest and streams the parts back
 * concatenated. Single-object resources are proxied too, for a consistent
 * attachment download.
 *
 * Access: admin, OR the resource is a free preview, OR the user is enrolled in
 * the resource's course.
 */

import { NextResponse } from "next/server";
import {
  getCurrentUser,
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import {
  isChunkedPath,
  readManifest,
  reassembleChunkedFile,
} from "@/lib/supabase/chunked";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function safeName(title: string, originalName: string): string {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : "bin";
  return `${title.replace(/[^a-z0-9]/gi, "_")}.${ext}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: resourceId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();

  const { data: resource } = await admin
    .from("course_resources")
    .select("id, title, file_path, course_id, is_free_preview")
    .eq("id", resourceId)
    .maybeSingle();
  if (!resource || !resource.file_path) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  // ── Access check ──────────────────────────────────────────────────────────
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin && !resource.is_free_preview) {
    const { data: enrollment } = await admin
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", resource.course_id)
      .limit(1)
      .maybeSingle();
    if (!enrollment) {
      return NextResponse.json(
        { ok: false, message: "You don't have access to this resource." },
        { status: 403 },
      );
    }
  }

  // ── Chunked: reassemble from manifest ─────────────────────────────────────
  if (isChunkedPath(resource.file_path)) {
    const manifest = await readManifest(STORAGE_BUCKETS.resources, resource.file_path);
    if (!manifest) {
      return NextResponse.json(
        { ok: false, message: "Couldn't read the file manifest." },
        { status: 500 },
      );
    }
    const { stream, contentType, totalSize, originalName } =
      await reassembleChunkedFile(STORAGE_BUCKETS.resources, manifest);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(totalSize),
        "Content-Disposition": `attachment; filename="${safeName(resource.title, originalName)}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // ── Single object: proxy with attachment header ───────────────────────────
  const url = await resolveStorageUrl(
    STORAGE_BUCKETS.resources,
    resource.file_path,
    60 * 5,
  );
  if (!url) {
    return NextResponse.json(
      { ok: false, message: "Couldn't generate the download link." },
      { status: 500 },
    );
  }

  const fileRes = await fetch(url);
  if (!fileRes.ok || !fileRes.body) {
    return NextResponse.json(
      { ok: false, message: "Couldn't fetch the file." },
      { status: 502 },
    );
  }

  const originalName = resource.file_path.split("/").pop() ?? resource.title;
  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type":
        fileRes.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName(resource.title, originalName)}"`,
      "Cache-Control": "no-store",
    },
  });
}
