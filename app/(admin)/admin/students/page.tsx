import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const admin = getSupabaseAdminClient();
  const { data: students } = await admin
    .from("profiles")
    .select(
      "id, email, full_name, created_at, onboarded_at, enrollments(id, course:courses(title))",
    )
    .eq("role", "student")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="container-wide py-10 md:py-14 space-y-8">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl">Students</h1>
        <p className="text-charcoal-400 mt-1">
          {students?.length ?? 0} students (latest 100 shown).
        </p>
      </div>

      {!students || students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-charcoal-400">
            No students yet. They&apos;ll show up the moment someone signs up.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-400">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Enrolments</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100/40">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="p-4 font-medium">{s.full_name ?? "—"}</td>
                  <td className="p-4 text-charcoal-500">{s.email}</td>
                  <td className="p-4">{(s.enrollments ?? []).length}</td>
                  <td className="p-4 text-xs text-charcoal-400">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
