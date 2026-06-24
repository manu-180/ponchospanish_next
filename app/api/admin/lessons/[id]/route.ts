/**
 *  PATCH  /api/admin/lessons/[id]
 *  DELETE /api/admin/lessons/[id]
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { STORAGE_BUCKETS, subtitlesPath } from "@/lib/supabase/storage";
import { isChunkedPath, readManifest } from "@/lib/supabase/chunked";

export const dynamic = "force-dynamic";

const Schema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  is_free_preview: z.boolean().optional(),
  is_trailer: z.boolean().optional(),
  release_at: z.string().datetime().nullable().optional(),
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
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("lessons")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
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

  // Collect resource file paths before deleting the DB row.
  const { data: resources } = await admin
    .from("course_resources")
    .select("file_path")
    .eq("lesson_id", id);

  const { error } = await admin.from("lessons").delete().eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }

  // Clean up storage after DB row is gone (best-effort).
  const cleanups: Promise<unknown>[] = [];

  // Delete each downloadable resource (handles chunked files).
  for (const r of resources ?? []) {
    const fp = r.file_path as string | null;
    if (!fp) continue;
    if (isChunkedPath(fp)) {
      cleanups.push(
        readManifest(STORAGE_BUCKETS.resources, fp).then((manifest) => {
          const toDelete = manifest ? [...manifest.parts, fp] : [fp];
          return admin.storage.from(STORAGE_BUCKETS.resources).remove(toDelete);
        }).catch(() => {}),
      );
    } else {
      cleanups.push(admin.storage.from(STORAGE_BUCKETS.resources).remove([fp]).catch(() => {}));
    }
  }

  // Delete the subtitle VTT for this lesson (both langs, ignore if missing).
  cleanups.push(
    admin.storage
      .from(STORAGE_BUCKETS.subtitles)
      .remove([subtitlesPath(id, "en"), subtitlesPath(id, "es")])
      .catch(() => {}),
  );

  await Promise.all(cleanups);

  return NextResponse.json({ ok: true });
}
