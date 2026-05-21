import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, ExternalLink, Construction } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCourseEditPage({ params }: PageProps) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { data: course } = await admin
    .from("courses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!course) notFound();

  return (
    <div className="container-wide py-10 md:py-14 space-y-8">
      <div className="space-y-3">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-charcoal-400 hover:text-mustard-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> All courses
        </Link>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl">{course.title}</h1>
            <p className="text-charcoal-400 mt-1">
              {course.is_published ? (
                <Badge variant="success">
                  <Eye className="h-3 w-3 mr-1" /> Published
                </Badge>
              ) : (
                <Badge variant="muted">
                  <EyeOff className="h-3 w-3 mr-1" /> Draft
                </Badge>
              )}
            </p>
          </div>
          <Button asChild variant="soft">
            <Link
              href={`/ondemand/${course.slug}?preview=admin`}
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" /> Preview as student
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-4 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
            <Construction className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl">
            Course editor is on the way
          </h2>
          <p className="text-charcoal-400 max-w-xl mx-auto">
            The full editor (drag-and-drop curriculum, Mux video uploads,
            subtitle editor, resources, SEO, analytics) ships in the next
            iteration. The course exists in the database and the URL
            <code className="mx-1 px-1.5 py-0.5 rounded bg-cream-100 font-mono text-xs">
              /ondemand/{course.slug}
            </code>
            already works.
          </p>
          <p className="text-xs text-charcoal-400">
            You can edit fields directly in Supabase Studio while the UI is
            being built: open the <code>courses</code> table → edit row id
            <code className="mx-1 px-1.5 py-0.5 rounded bg-cream-100 font-mono text-xs">
              {course.id.slice(0, 8)}…
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
