import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";
import { isChunkedPath, readManifest, reassembleChunkedFile } from "@/lib/supabase/chunked";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params;

  const admin = getSupabaseAdminClient();

  const { data: product } = await admin
    .from("digital_products")
    .select("id, preview_path, title, is_published")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_published || !product.preview_path) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  // ── Chunked preview: reassemble and stream inline ──────────────────────────
  if (isChunkedPath(product.preview_path)) {
    const manifest = await readManifest(
      STORAGE_BUCKETS.digitalProducts,
      product.preview_path,
    );
    if (!manifest) {
      return NextResponse.json(
        { ok: false, message: "Couldn't read the preview manifest." },
        { status: 500 },
      );
    }
    const { stream, contentType, totalSize } =
      await reassembleChunkedFile(STORAGE_BUCKETS.digitalProducts, manifest);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(totalSize),
        "Content-Disposition": `inline; filename="${manifest.originalName}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  // ── Single object: proxy inline ────────────────────────────────────────────
  const url = await resolveStorageUrl(
    STORAGE_BUCKETS.digitalProducts,
    product.preview_path,
    60 * 10,
  );
  if (!url) {
    return NextResponse.json(
      { ok: false, message: "Couldn't generate the preview link." },
      { status: 500 },
    );
  }

  const fileRes = await fetch(url);
  if (!fileRes.ok) {
    return NextResponse.json(
      { ok: false, message: "Couldn't fetch the preview." },
      { status: 502 },
    );
  }

  const ext = product.preview_path.split(".").pop() ?? "pdf";
  const filename = `${product.title.replace(/[^a-z0-9]/gi, "_")}_sample.${ext}`;

  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type": fileRes.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
