import Link from "next/link";
import { Plus, BookOpen, Eye, EyeOff } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const admin = getSupabaseAdminClient();
  const { data: courses } = await admin
    .from("courses")
    .select(
      "id, slug, title, subtitle, price_gbp, level, is_published, students_count, avg_rating, ratings_count, created_at, modules(id, lessons(id))",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide py-10 md:py-14 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Courses</h1>
          <p className="text-charcoal-400 mt-1">
            {courses?.length ?? 0} course{(courses?.length ?? 0) === 1 ? "" : "s"} ·
            click any row to edit, upload videos, manage curriculum.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4" /> New course
          </Link>
        </Button>
      </div>

      {!courses || courses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-2xl">No courses yet</h2>
            <p className="text-charcoal-400 max-w-md mx-auto">
              Start with a single course. You can add modules and lessons after
              creating it.
            </p>
            <Button asChild size="lg">
              <Link href="/admin/courses/new">
                <Plus className="h-4 w-4" /> Create your first course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-400">
              <tr>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Modules / Lessons</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Students</th>
                <th className="text-left p-4">Rating</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100/40">
              {courses.map((c) => {
                const modCount = (c.modules ?? []).length;
                const lessonCount = (c.modules ?? []).reduce(
                  (acc, m: { lessons?: { id: string }[] }) =>
                    acc + (m.lessons?.length ?? 0),
                  0,
                );
                return (
                  <tr key={c.id} className="hover:bg-mustard/5 transition-colors">
                    <td className="p-4">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="block min-w-0"
                      >
                        <p className="font-medium truncate">{c.title}</p>
                        {c.subtitle && (
                          <p className="text-xs text-charcoal-400 mt-0.5 truncate">
                            {c.subtitle}
                          </p>
                        )}
                      </Link>
                    </td>
                    <td className="p-4 text-charcoal-500">
                      {modCount} / {lessonCount}
                    </td>
                    <td className="p-4 font-medium">
                      {c.price_gbp > 0 ? formatCurrency(c.price_gbp) : "Free"}
                    </td>
                    <td className="p-4">{c.students_count ?? 0}</td>
                    <td className="p-4">
                      {c.ratings_count > 0 && c.avg_rating != null
                        ? `★ ${c.avg_rating.toFixed(1)} (${c.ratings_count})`
                        : "—"}
                    </td>
                    <td className="p-4">
                      {c.is_published ? (
                        <Badge variant="success">
                          <Eye className="h-3 w-3 mr-1" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="muted">
                          <EyeOff className="h-3 w-3 mr-1" /> Draft
                        </Badge>
                      )}
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
