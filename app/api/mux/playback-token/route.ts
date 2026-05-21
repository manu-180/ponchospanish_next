/**
 * GET /api/mux/playback-token?lessonId=...
 *
 * Mints a short-lived signed playback token (JWT) for a Mux playback id.
 *
 * Access rules:
 *  - Lesson is a trailer (`is_trailer = true`) → anyone (TTL 1h, suitable for
 *    embedding on the public course detail page).
 *  - Lesson is a free preview (`is_free_preview` or parent module
 *    `is_free`) → any authenticated user (TTL 15 min).
 *  - Otherwise → user must be enrolled in the lesson's course (TTL 15 min)
 *    OR be an admin.
 */

import { NextResponse } from "next/server";
import {
  getCurrentUser,
  getSupabaseAdminClient,
  getCurrentProfile,
} from "@/lib/supabase/server";
import {
  buildSignedPlaybackUrl,
  DEFAULT_TTL_SECONDS,
  TRAILER_TTL_SECONDS,
} from "@/lib/mux/signing";
import { rateLimit, ipFromRequest, RateLimitProfiles } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lessonId = url.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "missing_lesson_id" }, { status: 400 });
  }

  // Rate limit on IP — refresh is ~every 14 min so 30/min cap is generous.
  const ip = ipFromRequest(req);
  const rate = rateLimit({
    key: `playback-token:${ip}`,
    ...RateLimitProfiles.playbackToken,
  });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rate.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const admin = getSupabaseAdminClient();

  // Pull the lesson + parent module + course to determine free/preview/trailer
  // and whether the course is published.
  const { data: lesson } = await admin
    .from("lessons")
    .select(
      "id, mux_playback_id, mux_status, is_free_preview, is_trailer, modules!inner(course_id, is_free, courses!inner(id, is_published))",
    )
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson || !lesson.mux_playback_id) {
    return NextResponse.json({ error: "video_not_ready" }, { status: 404 });
  }
  if (lesson.mux_status !== "ready") {
    return NextResponse.json({ error: "video_not_ready" }, { status: 409 });
  }

  const moduleRow = Array.isArray(lesson.modules)
    ? lesson.modules[0]
    : lesson.modules;
  const courseRow = Array.isArray(moduleRow?.courses)
    ? moduleRow.courses[0]
    : moduleRow?.courses;
  const courseId = moduleRow?.course_id;
  const isPublished = courseRow?.is_published;
  const moduleIsFree = moduleRow?.is_free === true;

  if (!courseId || !isPublished) {
    return NextResponse.json({ error: "course_unavailable" }, { status: 404 });
  }

  const isTrailer = lesson.is_trailer === true;
  const isFreePreview = lesson.is_free_preview === true || moduleIsFree;

  // Trailer: anyone, longer TTL
  if (isTrailer) {
    const { url: signedUrl, expiresAt } = buildSignedPlaybackUrl(
      lesson.mux_playback_id,
      { ttlSeconds: TRAILER_TTL_SECONDS, subject: `trailer:${lessonId}` },
    );
    return NextResponse.json({
      url: signedUrl,
      expiresAt,
      ttlSeconds: TRAILER_TTL_SECONDS,
    });
  }

  // Below this point requires auth.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Admin can always play
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  // Free preview: any signed-in user
  if (isFreePreview || isAdmin) {
    const { url: signedUrl, expiresAt } = buildSignedPlaybackUrl(
      lesson.mux_playback_id,
      { subject: user.id },
    );
    return NextResponse.json({
      url: signedUrl,
      expiresAt,
      ttlSeconds: DEFAULT_TTL_SECONDS,
    });
  }

  // Otherwise must be enrolled
  const { data: enrolment } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrolment) {
    return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
  }

  const { url: signedUrl, expiresAt } = buildSignedPlaybackUrl(
    lesson.mux_playback_id,
    { subject: user.id },
  );
  return NextResponse.json({
    url: signedUrl,
    expiresAt,
    ttlSeconds: DEFAULT_TTL_SECONDS,
  });
}
