import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { buildSignedThumbnailUrl } from "@/lib/mux/signing";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CourseMetaForm } from "@/components/admin/course-meta-form";
import { CurriculumBuilder } from "@/components/admin/curriculum-builder";
import { PublishToggle } from "@/components/admin/publish-toggle";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCourseEditPage({ params }: PageProps) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();

  const [{ data: course }, { data: modulesRaw }] = await Promise.all([
    admin.from("courses").select("*").eq("id", id).maybeSingle(),
    admin
      .from("modules")
      .select(
        "id, title, slug, description, position, is_free, lessons(id, title, slug, description, position, is_free_preview, mux_status, mux_playback_id, mux_thumbnail_url, mux_duration_seconds)",
      )
      .eq("course_id", id)
      .order("position", { ascending: true }),
  ]);

  if (!course) notFound();

  // Mux assets are created with playback_policy: "signed", so the unsigned
  // mux_thumbnail_url stored in the DB returns 403. Sign a fresh thumbnail
  // URL server-side for each ready lesson (default 15 min TTL — long enough
  // for the admin page session).
  const modules = (modulesRaw ?? []).map((m) => ({
    ...m,
    lessons: (m.lessons ?? [])
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((l) => ({
        ...l,
        mux_thumbnail_url:
          l.mux_status === "ready" && l.mux_playback_id
            ? buildSignedThumbnailUrl(l.mux_playback_id, 5)
            : l.mux_thumbnail_url,
      })),
  }));

  return (
    <div className="container-wide py-8 md:py-10 space-y-8 max-w-6xl">
      <div className="space-y-3">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-charcoal-400 hover:text-mustard-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Todos los cursos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
              Editor de curso
            </p>
            <h1 className="font-serif text-3xl md:text-4xl truncate">
              {course.title}
            </h1>
            <p className="text-xs text-charcoal-400">
              <code className="px-1.5 py-0.5 rounded bg-cream-100 font-mono">
                /ondemand/{course.slug}
              </code>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="soft" size="sm">
              <Link
                href={`/ondemand/${course.slug}?preview=admin`}
                target="_blank"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Vista previa
              </Link>
            </Button>
            <PublishToggle
              endpoint={`/api/admin/courses/${course.id}`}
              initial={course.is_published}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="curriculum">
        <TabsList>
          <TabsTrigger value="curriculum">Módulos y lecciones</TabsTrigger>
          <TabsTrigger value="info">Información del curso</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="mt-6">
          <CurriculumBuilder courseId={course.id} initialModules={modules} />
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <CourseMetaForm course={course} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
