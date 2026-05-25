import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { paypalFetch } from "@/lib/paypal/client";
import type { Json } from "@/types/database";

const Schema = z.object({
  orderId: z.string().min(3),
  courseId: z.string().uuid(),
});

interface CaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        amount: { value: string; currency_code: string };
        status: string;
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

  const { orderId, courseId } = parsed.data;
  const admin = getSupabaseAdminClient();

  // 1. Verify the order belongs to this user
  const { data: payment } = await admin
    .from("payments")
    .select("id, user_id, course_id, amount")
    .eq("provider_order_id", orderId)
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();
  if (!payment) {
    return NextResponse.json(
      { ok: false, message: "Order not found for this user." },
      { status: 404 },
    );
  }

  // 2. Capture with PayPal
  let capture: CaptureResponse;
  try {
    capture = await paypalFetch<CaptureResponse>(
      `/v2/checkout/orders/${orderId}/capture`,
      { method: "POST" },
    );
  } catch (err) {
    console.error("[paypal/capture]", err);
    await admin
      .from("payments")
      .update({ status: "failed", raw_payload: { error: String(err) } })
      .eq("id", payment.id);
    return NextResponse.json(
      { ok: false, message: "Payment could not be captured." },
      { status: 502 },
    );
  }

  const captureRecord = capture.purchase_units[0]?.payments?.captures?.[0];

  // 3. Persist payment + enrollment atomically (best-effort)
  await admin
    .from("payments")
    .update({
      status: capture.status === "COMPLETED" ? "captured" : "approved",
      provider_capture_id: captureRecord?.id ?? null,
      raw_payload: capture as unknown as Json,
    })
    .eq("id", payment.id);

  await admin.from("enrollments").upsert(
    {
      user_id: user.id,
      course_id: courseId,
      source: "paypal",
      paypal_order_id: orderId,
    },
    { onConflict: "user_id,course_id" },
  );

  return NextResponse.json({ ok: true });
}
