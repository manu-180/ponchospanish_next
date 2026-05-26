import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { CodesManager } from "@/components/admin/codes-manager";

export const metadata = {
  title: "Access codes — Poncho Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminCodesPage() {
  const admin = getSupabaseAdminClient();

  const [{ data: free }, { data: discount }, { data: courses }] =
    await Promise.all([
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
      admin
        .from("courses")
        .select("id, title, slug, is_published")
        .order("created_at", { ascending: false }),
    ]);

  return (
    <div className="container-wide py-8 md:py-10 max-w-6xl space-y-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
          Comercio
        </p>
        <h1 className="font-serif text-3xl md:text-4xl">Códigos de acceso</h1>
        <p className="text-charcoal-400 mt-1 text-sm max-w-2xl">
          Generá códigos de acceso gratis (desbloquean un curso entero) o de
          descuento (% off en el checkout). Compartilos por mail, redes o
          campañas.
        </p>
      </div>

      <CodesManager
        initialFree={(free ?? []).map((c) => ({ ...c, kind: "free" as const }))}
        initialDiscount={(discount ?? []).map((c) => ({
          ...c,
          kind: "discount" as const,
        }))}
        courses={courses ?? []}
      />
    </div>
  );
}
