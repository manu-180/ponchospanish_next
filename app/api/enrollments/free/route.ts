import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

const Schema = z.object({ courseId: z.string().uuid() });

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
    return NextResponse.json({ ok: false, message: "Invalid course" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data: course } = await admin
    .from("courses")
    .select("id, price_gbp, is_published")
    .eq("id", parsed.data.courseId)
    .maybeSingle();
  if (!course || !course.is_published) {
    return NextResponse.json({ ok: false, message: "Course unavailable" }, { status: 404 });
  }
  if (course.price_gbp > 0) {
    return NextResponse.json(
      { ok: false, message: "This course requires payment." },
      { status: 400 },
    );
  }

  const { error } = await admin.from("enrollments").upsert(
    {
      user_id: user.id,
      course_id: course.id,
      source: "free",
    },
    { onConflict: "user_id,course_id" },
  );
  if (error) {
    return NextResponse.json(
      { ok: false, message: "Couldn't enroll. Try again." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
