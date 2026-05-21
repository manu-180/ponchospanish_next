import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = getSupabaseAdminClient();
  const { data: payments } = await admin
    .from("payments")
    .select(
      "id, amount, currency, status, created_at, user:profiles(email, full_name), course:courses(title)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="container-wide py-10 md:py-14 space-y-8">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Orders</h1>
        <p className="text-charcoal-400 mt-1">
          {payments?.length ?? 0} payments (latest 100).
        </p>
      </div>

      {!payments || payments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-charcoal-400">
            No payments yet.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-400">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Buyer</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100/40">
              {payments.map((p) => {
                const u = Array.isArray(p.user) ? p.user[0] : p.user;
                const c = Array.isArray(p.course) ? p.course[0] : p.course;
                return (
                  <tr key={p.id}>
                    <td className="p-4 text-xs text-charcoal-400">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      {u?.full_name ?? u?.email ?? "—"}
                    </td>
                    <td className="p-4 text-charcoal-500">{c?.title ?? "—"}</td>
                    <td className="p-4 font-medium">
                      {formatCurrency(Number(p.amount))}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === "captured" ? "success" :
                          p.status === "failed" ? "destructive" :
                          p.status === "refunded" ? "muted" : "outline"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
