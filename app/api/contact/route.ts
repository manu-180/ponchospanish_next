import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const Schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  age: z.string().regex(/^\d+$/).optional(),
  level: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
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

  const data = parsed.data;

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
