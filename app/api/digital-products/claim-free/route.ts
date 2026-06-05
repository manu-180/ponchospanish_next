import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

const Schema = z.object({ productId: z.string().uuid() });

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
    return NextResponse.json({ ok: false, message: "Invalid product" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data: product } = await admin
    .from("digital_products")
    .select("id, price_gbp, is_published")
    .eq("id", parsed.data.productId)
    .maybeSingle();

  if (!product || !product.is_published) {
    return NextResponse.json(
      { ok: false, message: "Ebook unavailable" },
      { status: 404 },
    );
  }
  if (product.price_gbp > 0) {
    return NextResponse.json(
      { ok: false, message: "This ebook isn't free." },
      { status: 400 },
    );
  }

  // Already owns it?
  const { data: existing } = await admin
    .from("digital_product_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: true });
  }

  const { error: insertErr } = await admin
    .from("digital_product_purchases")
    .insert({
      user_id: user.id,
      product_id: product.id,
      source: "free",
      amount_paid_gbp: 0,
    });
  if (insertErr) {
    return NextResponse.json(
      { ok: false, message: "Couldn't unlock this ebook. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
