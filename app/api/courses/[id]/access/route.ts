/**
 * GET /api/courses/[id]/access
 *
 * Tiny per-user access check used by the <EnrolPanel> island so the course
 * detail page (`/ondemand/[slug]`) can be served as STATIC/ISR HTML instead of
 * rendering dynamically on every anonymous SEO visit.
 *
 * Returns `{ authenticated, hasAccess }`. Anonymous → both false (the island
 * skips even calling this, since it checks the browser session first).
 */

import { NextResponse } from "next/server";
import { getCurrentUser, getSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: courseId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, hasAccess: false });
  }

  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    authenticated: true,
    hasAccess: Boolean(data),
  });
}
