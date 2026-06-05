import { NextResponse } from "next/server";
import {
  getCurrentUser,
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { resolveStorageUrl, STORAGE_BUCKETS } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();

  const { data: product } = await admin
    .from("digital_products")
    .select("id, file_path, title")
    .eq("id", productId)
    .maybeSingle();
  if (!product || !product.file_path) {
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
  }

  // Access check: owns a purchase OR is an admin
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    const { data: purchase } = await admin
      .from("digital_product_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .limit(1)
      .maybeSingle();
    if (!purchase) {
      return NextResponse.json(
        { ok: false, message: "You don't own this ebook yet." },
        { status: 403 },
      );
    }
  }

  const url = await resolveStorageUrl(
    STORAGE_BUCKETS.digitalProducts,
    product.file_path,
    60 * 5,
  );
  if (!url) {
    return NextResponse.json(
      { ok: false, message: "Couldn't generate the download link." },
      { status: 500 },
    );
  }

  // Proxy the file through our domain so Content-Disposition: attachment is respected
  // (browsers ignore the `download` attribute for cross-origin URLs)
  const fileRes = await fetch(url);
  if (!fileRes.ok) {
    return NextResponse.json(
      { ok: false, message: "Couldn't fetch the file." },
      { status: 502 },
    );
  }

  const ext = product.file_path.split(".").pop() ?? "pdf";
  const filename = `${product.title.replace(/[^a-z0-9]/gi, "_")}.${ext}`;

  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type": fileRes.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
