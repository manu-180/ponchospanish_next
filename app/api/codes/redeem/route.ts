import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentUser,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

const Schema = z.object({
  code: z.string().min(2).max(64),
  courseId: z.string().uuid().optional(),
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

  // 3. Resolve target course
  let courseId = accessCode.course_id ?? parsed.data.courseId ?? null;
  if (!courseId) {
    // global codes — pick the most recently published course as default
    const { data: course } = await admin
      .from("courses")
      .select("id")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    courseId = course?.id ?? null;
  }
  if (!courseId) {
    return NextResponse.json(
      { ok: false, message: "No course available for this code." },
      { status: 404 },
    );
  }

  // 4. Already enrolled?
  const { data: existing } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { ok: false, message: "You already have access to that course." },
      { status: 409 },
    );
  }

  // 5. Create enrollment & bump counter (no real transaction — best-effort)
  const { error: enrollErr } = await admin.from("enrollments").insert({
    user_id: user.id,
    course_id: courseId,
    source: "access_code",
    access_code_id: accessCode.id,
  });
  if (enrollErr) {
    return NextResponse.json(
      { ok: false, message: "Couldn't unlock access. Try again." },
      { status: 500 },
    );
  }

  await admin
    .from("access_codes")
    .update({ uses_count: accessCode.uses_count + 1 })
    .eq("id", accessCode.id);

  return NextResponse.json({ ok: true, courseId });
}
