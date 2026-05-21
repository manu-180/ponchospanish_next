import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { paypalFetch } from "@/lib/paypal/client";

const Schema = z.object({ courseId: z.string().uuid() });

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
    return NextResponse.json({ ok: false, message: "Invalid course" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data: course, error } = await admin
    .from("courses")
    .select("id, title, price_gbp, slug, is_published")
    .eq("id", parsed.data.courseId)
    .maybeSingle();

  if (error || !course || !course.is_published) {
    return NextResponse.json(
      { ok: false, message: "Course unavailable" },
      { status: 404 },
    );
  }
  if (course.price_gbp <= 0) {
    return NextResponse.json(
      { ok: false, message: "This course is free — no payment needed." },
      { status: 400 },
    );
  }

  // Already enrolled?
  const { data: existing } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "You already have access to this course." },
      { status: 409 },
    );
  }

  const orderPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: course.id,
        description: `Poncho Spanish · ${course.title}`,
        amount: {
          currency_code: "GBP",
          value: course.price_gbp.toFixed(2),
        },
        custom_id: `${user.id}::${course.id}`,
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

    await admin.from("payments").insert({
      user_id: user.id,
      course_id: course.id,
      provider: "paypal",
      provider_order_id: order.id,
      amount: course.price_gbp,
      currency: "GBP",
      status: "created",
    });

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (err) {
    console.error("[paypal/create-order]", err);
    return NextResponse.json(
      { ok: false, message: "PayPal is having a moment. Try again in a sec." },
      { status: 502 },
    );
  }
}
