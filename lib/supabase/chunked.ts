/**
 * Chunked storage — split large files past Supabase's 50 MB free-tier per-object
 * cap into <50 MB parts, then reassemble them transparently on download.
 *
 * ── Why ─────────────────────────────────────────────────────────────────────
 * Supabase's Free plan enforces a global 50 MB max object size that *overrides*
 * the bucket's own `file_size_limit`. A single big ebook/video therefore can't
 * be stored as one object. Instead we:
 *   1. (client) slice the file into N parts of ≤ CHUNK_SIZE and upload each as
 *      `{base}.partK`, plus a tiny `{base}.manifest.json` describing the set.
 *   2. (server) on download, read the manifest and stream every part back to
 *      the client concatenated — byte-for-byte identical to the original file.
 *
 * The reassembly is a true stream: we never buffer the whole file in the
 * serverless function's memory, we pipe one part at a time.
 *
 * A file whose final (post-compression) size is ≤ the single-object threshold is
 * NOT chunked — it's stored as a normal object and `file_path` points straight
 * at it. Chunked files are identified by the `.manifest.json` suffix on their
 * stored `file_path`.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/server";

/** Stored `file_path` of a chunked file ends with this. */
export const MANIFEST_SUFFIX = ".manifest.json";

/**
 * Per-part size, in bytes. Kept comfortably below the 50 MB free-tier ceiling
 * so there's headroom for any storage-side accounting overhead.
 */
export const CHUNK_SIZE = 45 * 1024 * 1024; // 45 MB

/** Files at or below this (after optional compression) upload as a single object. */
export const SINGLE_OBJECT_MAX = CHUNK_SIZE;

export interface ChunkManifest {
  /** Schema version. */
  v: 1;
  /** Original filename as chosen by the user (for Content-Disposition). */
  originalName: string;
  /** MIME type of the reassembled file. */
  contentType: string;
  /** Total byte length of the reassembled file. */
  totalSize: number;
  /** Ordered list of storage object paths to concatenate. */
  parts: string[];
}

/** True when a stored path refers to a chunked file (a manifest). */
export function isChunkedPath(path: string | null | undefined): boolean {
  return typeof path === "string" && path.endsWith(MANIFEST_SUFFIX);
}

/** Download + parse a chunk manifest. Returns null if missing/invalid. */
export async function readManifest(
  bucket: string,
  manifestPath: string,
): Promise<ChunkManifest | null> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.storage.from(bucket).download(manifestPath);
  if (error || !data) return null;
  try {
    const parsed = JSON.parse(await data.text()) as ChunkManifest;
    if (!Array.isArray(parsed.parts) || parsed.parts.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export interface ReassembledFile {
  stream: ReadableStream<Uint8Array>;
  contentType: string;
  totalSize: number;
  originalName: string;
}

/**
 * Build a streaming ReadableStream that concatenates every part of a chunked
 * file, in order. Parts are fetched one at a time via short-lived signed URLs
 * and piped through — memory stays flat regardless of total file size.
 */
export async function reassembleChunkedFile(
  bucket: string,
  manifest: ChunkManifest,
): Promise<ReassembledFile> {
  const admin = getSupabaseAdminClient();

  // Pre-sign every part up front (30 min is plenty for a sequential download).
  const signedUrls: string[] = [];
  for (const partPath of manifest.parts) {
    const { data, error } = await admin.storage
      .from(bucket)
      .createSignedUrl(partPath, 60 * 30);
    if (error || !data?.signedUrl) {
      throw new Error(`Could not sign part: ${partPath}`);
    }
    signedUrls.push(data.signedUrl);
  }

  let partIdx = 0;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        // Loop until we enqueue one chunk or finish all parts.
        // (A finished part with no bytes falls through to the next part.)
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (!reader) {
            if (partIdx >= signedUrls.length) {
              controller.close();
              return;
            }
            const res = await fetch(signedUrls[partIdx]);
            if (!res.ok || !res.body) {
              throw new Error(`Part ${partIdx} fetch failed (${res.status})`);
            }
            reader = res.body.getReader();
            partIdx += 1;
          }

          const { done, value } = await reader.read();
          if (done) {
            reader = null;
            continue; // move to the next part
          }
          controller.enqueue(value);
          return;
        }
      } catch (err) {
        controller.error(err);
      }
    },
    async cancel() {
      await reader?.cancel().catch(() => {});
    },
  });

  return {
    stream,
    contentType: manifest.contentType || "application/octet-stream",
    totalSize: manifest.totalSize,
    originalName: manifest.originalName,
  };
}
