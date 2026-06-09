import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Compass,
  Download,
  FileText,
  GraduationCap,
  PlayCircle,
  Star,
} from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  listPublishedCourses,
  listPublishedDigitalProducts,
  type CourseWithCounts,
} from "@/lib/supabase/queries";
import type { DigitalProduct } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatBytes } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import {
  graph,
  breadcrumbSchema,
  courseListSchema,
  digitalProductListSchema,
} from "@/lib/seo/schema";

export const metadata = {
  title: "On-Demand Spanish Courses & Ebooks — Poncho Academy",
  description:
    "Self-paced Spanish courses and downloadable ebooks by Anto. Watch, read, practise. Pay once, learn forever — no subscriptions.",
  alternates: { canonical: "/ondemand" },
  openGraph: {
    title: "On-Demand Spanish Courses & Ebooks — Poncho Academy",
    description:
      "Pay-once, lifetime-access Spanish courses and ebooks by a real teacher.",
    url: "/ondemand",
    type: "website",
  },
};

export const revalidate = 60; // ISR — refresh every minute

export default async function OnDemandPage() {
  const supabase = await getSupabaseServerClient();

  let courses: CourseWithCounts[] = [];
  let ebooks: DigitalProduct[] = [];
  try {
    [courses, ebooks] = await Promise.all([
      listPublishedCourses(supabase),
      listPublishedDigitalProducts(supabase),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[ondemand] failed to fetch catalogue:", err);
  }

  const hasCourses = courses.length > 0;
  const hasEbooks = ebooks.length > 0;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Academy", path: "/ondemand" },
          ]),
          ...(hasCourses ? [courseListSchema(courses)] : []),
          ...(hasEbooks ? [digitalProductListSchema(ebooks)] : []),
        )}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="pt-12 pb-10 md:pt-16 md:pb-14 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-mustard/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 -left-40 h-[360px] w-[360px] rounded-full bg-terracotta/10 blur-3xl"
        />
        <div className="container-wide relative">
          <div className="max-w-3xl">
            <Badge variant="terracotta" className="mb-4">
              <GraduationCap className="h-3 w-3 mr-1.5" /> Poncho Academy
            </Badge>
            <h1 className="font-serif text-display-xl text-balance">
              <span className="gradient-text">Self-paced Spanish</span>,
              <br />
              made beautifully simple.
            </h1>
            <p className="mt-5 text-lg text-charcoal-500/80 max-w-2xl">
              Watch the video, read the ebook, fill in the workbook, tick off
              each lesson. Lifetime access, paid once. No subscriptions.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: PlayCircle, label: "Bite-size HD videos" },
              { icon: BookOpen, label: "Downloadable ebooks" },
              { icon: Compass, label: "Lifetime access" },
              { icon: GraduationCap, label: "Made by a real teacher" },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-2xl bg-cream-50 ring-1 ring-charcoal-100/40 p-4"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-mustard/15 text-mustard-600">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Courses                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-10 md:py-14">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Courses"
            icon={PlayCircle}
            title="Video courses"
            count={courses.length}
            countNoun="course"
            description="Structured, watch-at-your-own-pace programmes with workbooks and progress tracking."
          />

          {!hasCourses ? (
            <Card className="mt-8">
              <CardContent className="p-10 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600 mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl">
                  Anto is preparing the first course.
                </h3>
                <p className="mt-2 text-charcoal-400 max-w-md mx-auto">
                  We&rsquo;re putting the final touches on the first set of
                  courses. Drop your email and we&rsquo;ll let you know the
                  moment they&rsquo;re live.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/#contact">Notify me</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Ebooks & resources                                               */}
      {/* ---------------------------------------------------------------- */}
      {hasEbooks && (
        <section className="py-10 md:py-14">
          <div className="container-wide">
            <div className="rounded-[2rem] bg-gradient-to-br from-cream-50 via-cream-100/60 to-mustard/5 ring-1 ring-charcoal-100/40 p-6 md:p-10">
              <SectionHeading
                eyebrow="Ebooks & resources"
                icon={BookMarked}
                title="Ebooks & printables"
                count={ebooks.length}
                countNoun="resource"
                description="Standalone guides, workbooks and cheat-sheets you can download and keep forever."
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ebooks.map((ebook) => (
                  <EbookCard key={ebook.id} ebook={ebook} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                    */
/* ------------------------------------------------------------------ */
function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  count,
  countNoun,
  description,
}: {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  countNoun: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
        {count > 0 && (
          <span className="text-sm text-charcoal-400">
            {count} {countNoun}
            {count === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <p className="mt-2 text-charcoal-500/80">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Course card                                                        */
/* ------------------------------------------------------------------ */
function CourseCard({ course }: { course: CourseWithCounts }) {
  return (
    <Link href={`/ondemand/${course.slug}`} className="group block">
      <Card className="overflow-hidden h-full hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 will-change-transform">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-mustard/30 via-cream-100 to-terracotta/30">
          {course.cover_image_path ? (
            <Image
              src={course.cover_image_path}
              alt={course.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-14 w-14 text-mustard/60" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge>{course.level}</Badge>
          </div>
          <div className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 text-charcoal-500 backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-serif text-xl leading-tight line-clamp-2">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-sm text-charcoal-400 line-clamp-2">
              {course.subtitle}
            </p>
          )}
          {course.ratings_count > 0 && course.avg_rating != null && (
            <p className="flex items-center gap-1.5 text-sm text-charcoal-400">
              <Star className="h-3.5 w-3.5 fill-mustard-400 text-mustard-400" />
              <span className="font-medium text-charcoal-500">
                {course.avg_rating.toFixed(1)}
              </span>
              <span>({course.ratings_count})</span>
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-charcoal-100/40">
            <p className="text-sm text-charcoal-400">
              {course.modules_count} modules · {course.lessons_count} lessons
            </p>
            <p className="font-serif text-lg text-mustard-600 font-semibold">
              {course.price_gbp > 0 ? formatCurrency(course.price_gbp) : "Free"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Ebook card — book-style, portrait cover                            */
/* ------------------------------------------------------------------ */
function EbookCard({ ebook }: { ebook: DigitalProduct }) {
  const isFree = ebook.price_gbp === 0;
  return (
    <Link
      href={`/ondemand/ebooks/${ebook.slug}`}
      className="group block focus-visible:outline-none"
    >
      <Card className="h-full overflow-hidden bg-cream-50 hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-mustard-500">
        <CardContent className="p-5">
          {/* Book cover */}
          <div className="relative mx-auto w-full max-w-[180px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg rounded-l-sm shadow-soft-lg ring-1 ring-charcoal-100/40 bg-gradient-to-br from-mustard/25 via-cream-100 to-terracotta/25">
              {/* book spine */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-2.5 bg-black/10 mix-blend-multiply"
              />
              {ebook.cover_image_path ? (
                <Image
                  src={ebook.cover_image_path}
                  alt={ebook.title}
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-mustard/60" />
                </div>
              )}
            </div>
            <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-charcoal-600 text-cream-50 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 shadow-soft">
              <Download className="h-3 w-3" /> Ebook
            </span>
          </div>

          {/* Meta */}
          <div className="mt-5 space-y-2 text-center">
            <h3 className="font-serif text-lg leading-tight line-clamp-2">
              {ebook.title}
            </h3>
            {ebook.subtitle && (
              <p className="text-xs text-charcoal-400 line-clamp-2">
                {ebook.subtitle}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-charcoal-100/40 pt-3">
            <span className="text-[11px] text-charcoal-400">
              {ebook.file_size_bytes
                ? `PDF · ${formatBytes(ebook.file_size_bytes)}`
                : "PDF"}
            </span>
            <span
              className={
                isFree
                  ? "font-serif text-lg font-semibold text-emerald-600"
                  : "font-serif text-lg font-semibold text-mustard-600"
              }
            >
              {isFree ? "Free" : formatCurrency(ebook.price_gbp, ebook.currency)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
