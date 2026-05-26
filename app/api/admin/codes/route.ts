/**
 * Admin-only access/discount codes.
 *
 *  GET  /api/admin/codes        → list both kinds, newest first
 *  POST /api/admin/codes        → create one
 *
 * Body for POST:
 *   {
 *     kind: "free" | "discount",
 *     code?: string,                 // omit to auto-generate
 *     scope: "any" | "course" | "digital_product",
 *     course_id?: string | null,
 *     digital_product_id?: string | null,
 *     percent_off?: number,          // required when kind = "discount"
 *     max_uses?: number | null,      // null = unlimited
 *     expires_at?: string | null,    // ISO date string
 *     notes?: string | null,
 *   }
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentProfile,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const CreateSchema = z.object({
  kind: z.enum(["free", "discount"]),
  code: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers, and dashes only")
    .optional(),
  scope: z.enum(["any", "course", "digital_product"]),
  course_id: z.string().uuid().nullable().optional(),
  digital_product_id: z.string().uuid().nullable().optional(),
  percent_off: z.number().int().min(1).max(100).optional(),
  max_uses: z.number().int().min(1).max(1_000_000).nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  notes: z.string().max(280).nullable().optional(),
});

function generateCode(): string {
  // Friendly readable code: 3 groups of 4 chars, no confusing characters
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from(
      { length: 4 },
      () => alphabet[Math.floor(Math.random() * alphabet.length)],
    ).join("");
  return `${block()}-${block()}-${block()}`;
}

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { ok: false as const };
  }
  return { ok: true as const, profile };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdminClient();
  const [{ data: free }, { data: discount }] = await Promise.all([
    admin
      .from("access_codes")
      .select(
        "id, code, scope, course_id, digital_product_id, max_uses, uses_count, expires_at, notes, created_at",
      )
      .order("created_at", { ascending: false }),
    admin
      .from("discount_codes")
      .select(
        "id, code, scope, course_id, digital_product_id, percent_off, max_uses, uses_count, expires_at, notes, created_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    free: (free ?? []).map((c) => ({ ...c, kind: "free" as const })),
    discount: (discount ?? []).map((c) => ({ ...c, kind: "discount" as const })),
  });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const body = parsed.data;

  if (body.kind === "discount" && body.percent_off == null) {
    return NextResponse.json(
      { error: "percent_off_required" },
      { status: 400 },
    );
  }
  if (body.scope === "course" && !body.course_id) {
    return NextResponse.json({ error: "course_id_required" }, { status: 400 });
  }
  if (body.scope === "digital_product" && !body.digital_product_id) {
    return NextResponse.json(
      { error: "digital_product_id_required" },
      { status: 400 },
    );
  }

  const code = (body.code ?? generateCode()).toUpperCase();
  const admin = getSupabaseAdminClient();

  if (body.kind === "free") {
    const { data, error } = await admin
      .from("access_codes")
      .insert({
        code,
        scope: body.scope,
        course_id: body.scope === "course" ? body.course_id! : null,
        digital_product_id:
          body.scope === "digital_product" ? body.digital_product_id! : null,
        max_uses: body.max_uses ?? null,
        expires_at: body.expires_at ?? null,
        notes: body.notes ?? null,
        created_by: auth.profile.id,
      })
      .select(
        "id, code, scope, course_id, digital_product_id, max_uses, uses_count, expires_at, notes, created_at",
      )
      .single();

    if (error) {
      if ("code" in error && (error as { code?: string }).code === "23505") {
        return NextResponse.json(
          { error: "code_already_exists" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "db_error", message: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ ...data, kind: "free" as const });
  }

  // discount
  const { data, error } = await admin
    .from("discount_codes")
    .insert({
      code,
      scope: body.scope,
      course_id: body.scope === "course" ? body.course_id! : null,
      digital_product_id:
        body.scope === "digital_product" ? body.digital_product_id! : null,
      percent_off: body.percent_off!,
      max_uses: body.max_uses ?? null,
      expires_at: body.expires_at ?? null,
      notes: body.notes ?? null,
      created_by: auth.profile.id,
    })
    .select(
      "id, code, scope, course_id, digital_product_id, percent_off, max_uses, uses_count, expires_at, notes, created_at",
    )
    .single();

  if (error) {
    if ("code" in error && (error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "code_already_exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "db_error", message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ...data, kind: "discount" as const });
}
