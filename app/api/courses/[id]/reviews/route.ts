import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: courseId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { rating, body: reviewBody } = body as Record<string, unknown>;

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number between 1 and 5" },
      { status: 400 },
    );
  }
  if (reviewBody !== undefined && typeof reviewBody !== "string") {
    return NextResponse.json({ error: "Review body must be a string" }, { status: 400 });
  }
  if (typeof reviewBody === "string" && reviewBody.trim().length > 2000) {
    return NextResponse.json(
      { error: "Review body must not exceed 2000 characters" },
      { status: 400 },
    );
  }

  const supabase = await getSupabaseServerClient();

  // Must be enrolled to leave a review.
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json(
      { error: "You must be enrolled in this course to leave a review" },
      { status: 403 },
    );
  }

  // One review per user per course.
  const { data: existing } = await supabase
    .from("course_reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this course" },
      { status: 409 },
    );
  }

  const { error } = await supabase.from("course_reviews").insert({
    user_id: user.id,
    course_id: courseId,
    rating,
    body: typeof reviewBody === "string" && reviewBody.trim() ? reviewBody.trim() : null,
    is_visible: false, // requires admin approval before going live
  } as never);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
