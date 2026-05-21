/**
 * Lightweight in-memory rate limiter.
 *
 * Fine for single-instance Next.js dev + low-traffic Vercel deployments.
 * If we ever go multi-instance (or sustained high traffic), swap for
 * `@upstash/ratelimit` + Vercel KV. The API here is intentionally
 * compatible so the switch is one-line.
 *
 * Usage:
 *   const result = await rateLimit({ key: ip, max: 10, windowMs: 60_000 });
 *   if (!result.ok) return Response.json({ error: "Too many" }, { status: 429 });
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Unique key per actor (IP, user id, etc.) and per scope (route name). */
  key: string;
  /** Max requests allowed within the window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

/**
 * Consume one token from the bucket identified by `key`.
 */
export function rateLimit({
  key,
  max,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      ok: true,
      remaining: max - 1,
      retryAfterSeconds: 0,
      resetAt: now + windowMs,
    };
  }

  if (existing.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: max - existing.count,
    retryAfterSeconds: 0,
    resetAt: existing.resetAt,
  };
}

/**
 * Extract a client IP from a request. Best-effort — relies on common
 * proxy headers (`x-forwarded-for`, `x-real-ip`). Falls back to
 * "anonymous" if neither header is present (e.g. local dev).
 */
export function ipFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "anonymous";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anonymous";
}

/**
 * Common rate-limit profiles used across the API.
 */
export const RateLimitProfiles = {
  /** /api/codes/validate — frequent typing, but cap per IP. */
  codeValidate: { max: 10, windowMs: 60_000 },
  /** /api/codes/redeem — burst guard against guessing. */
  codeRedeem: { max: 5, windowMs: 60_000 },
  /** /api/auth/* — login & signup attempts. */
  auth: { max: 10, windowMs: 60_000 },
  /** /api/lessons/[id]/progress — throttled saves (every 5s). */
  progressSave: { max: 30, windowMs: 60_000 },
  /** /api/mux/playback-token — refresh ~every 14 min. */
  playbackToken: { max: 30, windowMs: 60_000 },
} as const;
