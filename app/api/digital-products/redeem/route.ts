import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

const Schema = z.object({
  code: z.string().min(2).max(64),
  productId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Sign in first" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid code" }, { status: 400 });
  }

  const code = parsed.data.code.trim().toUpperCase();
  const admin = getSupabaseAdminClient();

  // 1. Find code
  const { data: accessCode, error } = await admin
    .from("access_codes")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error || !accessCode) {
    return NextResponse.json(
      { ok: false, message: "That code doesn't look right." },
      { status: 404 },
    );
  }

  // This endpoint only handles ebook codes — course codes go through /api/codes/redeem
  if (!accessCode.digital_product_id && !parsed.data.productId) {
    return NextResponse.json(
      { ok: false, message: "This code isn't for an ebook." },
      { status: 400 },
    );
  }

  // 2. Validate
  if (accessCode.expires_at && new Date(accessCode.expires_at).getTime() < Date.now()) {
    return NextResponse.json(
      { ok: false, message: "This code has expired." },
      { status: 410 },
    );
  }
  if (
    accessCode.max_uses !== null &&
    accessCode.uses_count >= accessCode.max_uses
  ) {
    return NextResponse.json(
      { ok: false, message: "This code has been fully redeemed." },
      { status: 410 },
    );
  }

  // 3. Resolve target product
  const productId = accessCode.digital_product_id ?? parsed.data.productId ?? null;
  if (!productId) {
    return NextResponse.json(
      { ok: false, message: "No ebook available for this code." },
      { status: 404 },
    );
  }
  if (
    accessCode.digital_product_id &&
    parsed.data.productId &&
    accessCode.digital_product_id !== parsed.data.productId
  ) {
    return NextResponse.json(
      { ok: false, message: "This code is for a different ebook." },
      { status: 400 },
    );
  }

  const { data: product } = await admin
    .from("digital_products")
    .select("id, is_published")
    .eq("id", productId)
    .maybeSingle();
  if (!product || !product.is_published) {
    return NextResponse.json(
      { ok: false, message: "Ebook unavailable." },
      { status: 404 },
    );
  }

  // 4. Already owns it?
  const { data: existing } = await admin
    .from("digital_product_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "You already own this ebook." },
      { status: 409 },
    );
  }

  // 5. Grant access & bump counter (best-effort)
  const { error: insertErr } = await admin
    .from("digital_product_purchases")
    .insert({
      user_id: user.id,
      product_id: productId,
      source: "access_code",
      access_code_id: accessCode.id,
      amount_paid_gbp: 0,
    });
  if (insertErr) {
    return NextResponse.json(
      { ok: false, message: "Couldn't unlock access. Try again." },
      { status: 500 },
    );
  }

  await admin
    .from("access_codes")
    .update({ uses_count: accessCode.uses_count + 1 })
    .eq("id", accessCode.id);

  return NextResponse.json({ ok: true, productId });
}
