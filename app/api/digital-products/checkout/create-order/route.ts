import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { paypalFetch } from "@/lib/paypal/client";

const Schema = z.object({ productId: z.string().uuid() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Sign in first" },
      { status: 401 },
    );
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
  const { data: product, error } = await admin
    .from("digital_products")
    .select("id, title, price_gbp, slug, is_published")
    .eq("id", parsed.data.productId)
    .maybeSingle();

  if (error || !product || !product.is_published) {
    return NextResponse.json(
      { ok: false, message: "Ebook unavailable" },
      { status: 404 },
    );
  }
  if (product.price_gbp <= 0) {
    return NextResponse.json(
      { ok: false, message: "This ebook is free — no payment needed." },
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
    return NextResponse.json(
      { ok: false, message: "You already own this ebook." },
      { status: 409 },
    );
  }

  const orderPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: product.id,
        description: `Poncho Spanish · ${product.title}`,
        amount: {
          currency_code: "GBP",
          value: product.price_gbp.toFixed(2),
        },
        custom_id: `${user.id}::${product.id}`,
      },
    ],
    application_context: {
      brand_name: "Poncho Spanish",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
    },
  };

  try {
    const order = await paypalFetch<{ id: string }>("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error("[digital-products/create-order]", err);
    return NextResponse.json(
      { ok: false, message: "PayPal is having a moment. Try again in a sec." },
      { status: 502 },
    );
  }
}
