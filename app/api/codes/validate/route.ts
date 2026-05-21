/**
 * POST /api/codes/validate
 *
 * Pre-flight check for a code typed in the checkout box. Tells the client
 * whether the code is a free-access grant OR a discount, the discount %,
 * and any expiry/max-use issues.
 *
 * NEVER trust the response on the server side — re-validate at
 * redeem / capture time. This route is for UX only.
 *
 * Body:
 *   { code: string, courseId?: string, digitalProductId?: string }
 *
 * Response:
 *   { kind: 'free'|'discount', percentOff?: number, scope: string }
 */

import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  rateLimit,
  ipFromRequest,
  RateLimitProfiles,
} from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Rate limit (per IP) — 10/min protects against guessing.
  const ip = ipFromRequest(req);
  const rate = rateLimit({
    key: `codes-validate:${ip}`,
    ...RateLimitProfiles.codeValidate,
  });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rate.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { code?: string; courseId?: string; digitalProductId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }
  if (!body.courseId && !body.digitalProductId) {
    return NextResponse.json(
      { error: "missing_target" },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();

  // Try free-access code first
  const { data: access } = await admin
    .from("access_codes")
    .select(
      "id, code, scope, course_id, digital_product_id, max_uses, uses_count, expires_at",
    )
    .eq("code", code)
    .maybeSingle();

  if (access) {
    const inv = invalidReason(
      access.expires_at,
      access.max_uses,
      access.uses_count,
    );
    if (inv) {
      return NextResponse.json({ error: inv }, { status: 400 });
    }
    if (!matchesTarget(access, body.courseId, body.digitalProductId)) {
      return NextResponse.json({ error: "code_wrong_scope" }, { status: 400 });
    }
    return NextResponse.json({
      kind: "free" as const,
      scope: access.scope,
    });
  }

  // Try discount code
  const { data: discount } = await admin
    .from("discount_codes")
    .select(
      "id, code, scope, course_id, digital_product_id, percent_off, max_uses, uses_count, expires_at",
    )
    .eq("code", code)
    .maybeSingle();

  if (discount) {
    const inv = invalidReason(
      discount.expires_at,
      discount.max_uses,
      discount.uses_count,
    );
    if (inv) {
      return NextResponse.json({ error: inv }, { status: 400 });
    }
    if (!matchesTarget(discount, body.courseId, body.digitalProductId)) {
      return NextResponse.json({ error: "code_wrong_scope" }, { status: 400 });
    }
    return NextResponse.json({
      kind: "discount" as const,
      percentOff: discount.percent_off,
      scope: discount.scope,
    });
  }

  return NextResponse.json({ error: "code_not_found" }, { status: 404 });
}

function invalidReason(
  expiresAt: string | null,
  maxUses: number | null,
  usesCount: number,
): string | null {
  if (expiresAt && new Date(expiresAt) < new Date()) return "code_expired";
  if (maxUses != null && usesCount >= maxUses) return "code_exhausted";
  return null;
}

function matchesTarget(
  code: {
    scope: string;
    course_id: string | null;
    digital_product_id: string | null;
  },
  courseId: string | undefined,
  digitalProductId: string | undefined,
): boolean {
  if (code.scope === "any") return true;
  if (code.scope === "course") {
    if (!courseId) return false;
    if (code.course_id && code.course_id !== courseId) return false;
    return true;
  }
  if (code.scope === "digital_product") {
    if (!digitalProductId) return false;
    if (
      code.digital_product_id &&
      code.digital_product_id !== digitalProductId
    ) {
      return false;
    }
    return true;
  }
  return false;
}
