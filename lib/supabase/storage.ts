import { getSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * All Supabase Storage buckets used by Poncho.
 *
 * Every bucket is PRIVATE — access is mediated through short-lived signed URLs
 * created server-side via `resolveStorageUrl`.
 *
 * Note: video hosting MOVED to Mux for the on-demand build. `videos` is kept
 * for legacy / backward-compat. New uploads go through Mux Direct Uploads.
 */
export const STORAGE_BUCKETS = {
  /** Legacy MP4 uploads — pre-Mux. Kept for backwards-compat. */
  videos: "course-videos",
  /** Per-lesson / per-module workbook PDFs. */
  workbooks: "course-workbooks",
  /** Course cover images (1200x630 ideal). Public-readable by storage policy. */
  covers: "course-covers",
  /** In-course downloadable resources (PDFs, audio, slides, archives, etc.). */
  resources: "course-resources",
  /** Whisper-generated VTT subtitle files: `{lessonId}/{lang}.vtt`. */
  subtitles: "course-subtitles",
  /** Standalone digital products (ebooks, packs). Sold via storefront. */
  digitalProducts: "digital-products",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Resolve a storage `path` (e.g. "abc/lesson.mp4") to a usable URL.
 *  - If it starts with http(s) or `/`, return it as-is (already a public URL or local file).
 *  - Otherwise, create a short-lived signed URL via the admin client.
 */
export async function resolveStorageUrl(
  bucket: StorageBucket | string,
  path: string | null | undefined,
  expiresIn: number = 60 * 60, // 1h
): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) return path;

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[storage] signed URL failed", { bucket, path, error });
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[storage] resolveStorageUrl error", { bucket, path, err });
    return null;
  }
}

/**
 * Build a deterministic VTT path for a given lesson + language.
 * Used by the Whisper pipeline + the player's text track loader.
 */
export function subtitlesPath(lessonId: string, language: "en" | "es"): string {
  return `${lessonId}/${language}.vtt`;
}

/**
 * Build a deterministic resource path.
 * Layout: `{courseId}/{resourceId}-{fileName}`
 */
export function resourcePath(
  courseId: string,
  resourceId: string,
  fileName: string,
): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${courseId}/${resourceId}-${safeName}`;
}

/**
 * Build a deterministic digital product file path.
 * Layout: `{productId}/{fileName}`
 */
export function digitalProductPath(productId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${productId}/${safeName}`;
}
