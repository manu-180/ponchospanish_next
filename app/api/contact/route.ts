import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { ipFromRequest, rateLimit, RateLimitProfiles } from "@/lib/ratelimit";

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  age: z.string().regex(/^\d{1,3}$/).optional(),
  level: z.string().max(60).optional(),
  interest: z.string().max(60).optional(),
  message: z.string().max(2000).optional(),
  website: z.string().max(200).optional(),
});

const MAX_PER_EMAIL_PER_HOUR = 3;

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  }

  const rate = rateLimit({
    key: `contact:${ipFromRequest(request)}`,
    ...RateLimitProfiles.contact,
  });
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, message: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid form data",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;
  // Honeypot: the field is hidden from people, so only bots fill it. Answer ok so they don't retry.
  if (website) return NextResponse.json({ ok: true });

  // The in-memory limiter is per instance; this check holds across all of them.
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await getSupabaseAdminClient()
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
      return NextResponse.json(
        { ok: false, message: "We already got your messages. Anto will write back soon." },
        { status: 429 },
      );
    }
  } catch (err) {
    console.warn("[contact] email throttle check failed:", err);
  }

  // 1. Best-effort persistence in `contacts` (won't fail the request).
  try {
    const supabase = getSupabaseAdminClient();
    await supabase.from("contacts").insert({
      name: data.name,
      email: data.email,
      age: data.age ? Number(data.age) : null,
      level: data.level ?? null,
      interest: data.interest ?? null,
      message: data.message ?? null,
    });
  } catch (err) {
    console.warn("[contact] DB insert failed:", err);
  }

  // 2. Forward to the existing `anto-send-email` Supabase Edge Function.
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.functions.invoke("anto-send-email", {
      body: data,
    });
    if (error) throw error;
  } catch (err) {
    console.error("[contact] edge-function failed:", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We saved your message but couldn't deliver the email right now. Anto will still see it.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
