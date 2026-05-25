import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import {
  getSupabaseServerClient,
  getCurrentUser,
} from "@/lib/supabase/server";
import {
  getCourseBySlug,
  userHasAccessToCourse,
} from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { CheckoutPanel } from "@/components/learn/checkout-panel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();
  try {
    const course = await getCourseBySlug(supabase, slug);
    if (!course) return { title: "Course not found" };
    return {
      title: `${course.title} — Poncho Academy`,
      description:
        course.description?.slice(0, 155) ??
        course.subtitle ??
        `${course.title} — on-demand Spanish course by Anto.`,
      alternates: { canonical: `/ondemand/${course.slug}` },
      openGraph: {
        title: course.title,
        description: course.subtitle ?? undefined,
        images: course.cover_image_path ? [course.cover_image_path] : undefined,
      },
    };
  } catch {
    return { title: "Course" };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getSupabaseServerClient();

  let course;
  try {
    course = await getCourseBySlug(supabase, slug);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[course-detail] failed:", err);
  }
  if (!course) notFound();

  const user = await getCurrentUser();
  let hasAccess = false;
  if (user) {
    try {
      hasAccess = await userHasAccessToCourse(supabase, user.id, course.id);
    } catch {
      hasAccess = false;
    }
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );
  const totalDuration = course.modules.reduce(
    (acc, m) =>
      acc +
      m.lessons.reduce(
        (a, l) =>
          a + (l.mux_duration_seconds ?? l.video_duration_seconds ?? 0),
        0,
      ),
    0,
  );

  const trailerLesson = course.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.is_trailer);

  return (
    <>
      <section className="relative pt-10 pb-12 md:pt-14 md:pb-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[460px] w-[460px] rounded-full bg-mustard/15 blur-3xl"
        />
        <div className="container-wide relative grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="terracotta">{course.level}</Badge>
              {course.price_gbp === 0 && <Badge variant="free">Free</Badge>}
              {course.money_back_enabled && (
                <Badge variant="muted">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {course.money_back_days}-day money-back
                </Badge>
              )}
            </div>
            <h1 className="font-serif text-display-xl text-balance leading-[1.05]">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="text-xl text-charcoal-500/80 max-w-2xl">
                {course.subtitle}
              </p>
            )}
            {course.ratings_count > 0 && course.avg_rating != null && (
              <p className="flex items-center gap-2 text-sm text-charcoal-500">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(course.avg_rating ?? 0)
                          ? "h-4 w-4 fill-mustard-400 text-mustard-400"
                          : "h-4 w-4 text-charcoal-200"
                      }
                    />
                  ))}
                </span>
                <span className="font-semibold text-charcoal-600">
                  {course.avg_rating.toFixed(1)}
                </span>
                <span className="text-charcoal-400">
                  ({course.ratings_count}{" "}
                  {course.ratings_count === 1 ? "review" : "reviews"})
                </span>
                {course.students_count > 0 && (
                  <>
                    <span className="text-charcoal-300">·</span>
                    <span>{course.students_count.toLocaleString()} students</span>
                  </>
                )}
              </p>
            )}
            {course.description && (
              <p className="text-base leading-relaxed text-charcoal-500/80 max-w-2xl whitespace-pre-line">
                {course.description}
              </p>
            )}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal-400 pt-2">
              <li className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-mustard-600" />
                {course.modules.length} modules
              </li>
              <li className="inline-flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-mustard-600" />
                {totalLessons} lessons
              </li>
              <li className="inline-flex items-center gap-2">
                <Compass className="h-4 w-4 text-mustard-600" />
                Approx. {formatDuration(totalDuration)}
              </li>
            </ul>

            {trailerLesson && (
              <Button size="lg" variant="outline" className="mt-4" asChild>
                <Link href={`/ondemand/${course.slug}#trailer`}>
                  <PlayCircle className="h-5 w-5 mr-2" /> Watch trailer
                </Link>
              </Button>
            )}
          </div>

          <div className="relative">
            <div
              id="trailer"
              className="relative aspect-video overflow-hidden rounded-3xl ring-1 ring-charcoal-100/40 shadow-soft-lg bg-charcoal-100/40"
            >
              {course.trailer_video_path ? (
                <video
                  src={course.trailer_video_path}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : course.cover_image_path ? (
                <Image
                  src={course.cover_image_path}
                  alt={course.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-mustard/60" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            {course.learning_outcomes &&
              course.learning_outcomes.length > 0 && (
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <h2 className="font-serif text-2xl">What you&rsquo;ll learn</h2>
                    <ul className="grid sm:grid-cols-2 gap-3 text-sm text-charcoal-500">
                      {course.learning_outcomes.map((outcome) => (
                        <li key={outcome} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-mustard-600 mt-0.5 shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

            <div>
              <h2 className="font-serif text-2xl md:text-3xl">Curriculum</h2>
              <p className="text-sm text-charcoal-400 mt-1">
                {course.modules.length} modules · {totalLessons} mini lessons ·{" "}
                {formatDuration(totalDuration)}
              </p>
            </div>

            <Accordion
              type="multiple"
              defaultValue={course.modules.slice(0, 1).map((m) => m.id)}
            >
              {course.modules.map((mod, mi) => (
                <AccordionItem key={mod.id} value={mod.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-left">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-mustard/15 text-mustard-600 text-xs font-semibold">
                        {(mi + 1).toString().padStart(2, "0")}
                      </span>
                      <div>
                        <p className="leading-tight">{mod.title}</p>
                        <p className="text-xs text-charcoal-400 mt-0.5 font-normal normal-case tracking-normal">
                          {mod.lessons.length} lessons
                          {mod.is_free && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                              <Sparkles className="h-3 w-3" /> Free module
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {mod.description && (
                      <p className="mb-3 text-charcoal-400 italic">
                        {mod.description}
                      </p>
                    )}
                    <ul className="space-y-1">
                      {mod.lessons.map((lesson, li) => {
                        const free =
                          lesson.is_free_preview ||
                          lesson.is_trailer ||
                          mod.is_free;
                        return (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-mustard/5 transition-colors"
                          >
                            {free ? (
                              <PlayCircle className="h-4 w-4 text-mustard-600 shrink-0" />
                            ) : (
                              <Lock className="h-4 w-4 text-charcoal-300 shrink-0" />
                            )}
                            <span className="flex-1 text-sm">
                              {(li + 1).toString().padStart(2, "0")}.{" "}
                              {lesson.title}
                            </span>
                            <span className="text-xs text-charcoal-400">
                              {formatDuration(
                                lesson.mux_duration_seconds ??
                                  lesson.video_duration_seconds ??
                                  0,
                              )}
                            </span>
                            {lesson.is_trailer && (
                              <Badge variant="terracotta" className="ml-2">
                                Trailer
                              </Badge>
                            )}
                            {!lesson.is_trailer && free && (
                              <Badge variant="free" className="ml-2">
                                Preview
                              </Badge>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-serif text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-mustard-600" /> This course
                  includes
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-charcoal-500">
                  {[
                    `${formatDuration(totalDuration)} of HD video`,
                    "Downloadable workbooks & resources",
                    "Subtitles in English & Spanish",
                    "Lifetime access — no subscription",
                    "Certificate of completion",
                    "Access on mobile, tablet & desktop",
                  ].map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-mustard-600 mt-0.5 shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 self-start space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-charcoal-400">
                    One payment · Lifetime access
                  </p>
                  <p className="font-serif text-4xl">
                    {course.price_gbp > 0
                      ? formatCurrency(course.price_gbp)
                      : "Free"}
                  </p>
                </div>
                {hasAccess ? (
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/learn/${course.slug}`}>Start learning</Link>
                  </Button>
                ) : (
                  <CheckoutPanel
                    course={{
                      id: course.id,
                      slug: course.slug,
                      title: course.title,
                      price_gbp: course.price_gbp,
                    }}
                    isAuthenticated={Boolean(user)}
                  />
                )}
                <ul className="space-y-2 text-sm text-charcoal-500 pt-2 border-t border-charcoal-100/40">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Secure PayPal checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Immediate, lifetime access
                  </li>
                  {course.money_back_enabled && (
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      {course.money_back_days}-day money-back guarantee
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Free preview included
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
