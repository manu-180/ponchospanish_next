import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { paypalFetch } from "@/lib/paypal/client";

const Schema = z.object({
  orderId: z.string().min(3),
  productId: z.string().uuid(),
});

interface CaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    custom_id?: string;
    reference_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        amount: { value: string; currency_code: string };
        status: string;
        custom_id?: string;
      }>;
    };
  }>;
}

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
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  const { orderId, productId } = parsed.data;
  const admin = getSupabaseAdminClient();

  // Idempotency — already captured & recorded?
  const { data: already } = await admin
    .from("digital_product_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .limit(1)
    .maybeSingle();
  if (already) {
    return NextResponse.json({ ok: true });
  }

  // Capture with PayPal
  let capture: CaptureResponse;
  try {
    capture = await paypalFetch<CaptureResponse>(
      `/v2/checkout/orders/${orderId}/capture`,
      { method: "POST" },
    );
  } catch (err) {
    console.error("[digital-products/capture]", err);
    return NextResponse.json(
      { ok: false, message: "Payment could not be captured." },
      { status: 502 },
    );
  }

  // Verify the order really belongs to this user + product (anti-tamper)
  const unit = capture.purchase_units?.[0];
  const captureRecord = unit?.payments?.captures?.[0];
  const customId = unit?.custom_id ?? captureRecord?.custom_id ?? "";
  const [orderUserId, orderProductId] = customId.split("::");
  if (orderUserId !== user.id || orderProductId !== productId) {
    return NextResponse.json(
      { ok: false, message: "Order does not match this purchase." },
      { status: 403 },
    );
  }

  const amount = Number(captureRecord?.amount?.value ?? 0);

  const { error: insertErr } = await admin
    .from("digital_product_purchases")
    .insert({
      user_id: user.id,
      product_id: productId,
      source: "paypal",
      paypal_order_id: orderId,
      amount_paid_gbp: Number.isFinite(amount) ? amount : 0,
    });
  if (insertErr) {
    console.error("[digital-products/capture] insert", insertErr);
    return NextResponse.json(
      { ok: false, message: "Payment captured but access failed — contact us." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
