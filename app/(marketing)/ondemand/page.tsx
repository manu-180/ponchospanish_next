import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  GraduationCap,
  PlayCircle,
  Star,
} from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  listPublishedCourses,
  type CourseWithCounts,
} from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "On-Demand Spanish Courses — Poncho Academy",
  description:
    "Self-paced Spanish courses by Anto. Watch the video, do the workbook, tick off each mini-lesson. Pay once with PayPal, learn forever.",
  alternates: { canonical: "/ondemand" },
  openGraph: {
    title: "On-Demand Spanish Courses — Poncho Academy",
    description:
      "Pay-once, lifetime-access Spanish courses by a real teacher.",
    url: "/ondemand",
    type: "website",
  },
};

export const revalidate = 60; // ISR — refresh every minute

export default async function OnDemandPage() {
  const supabase = await getSupabaseServerClient();

  let courses: CourseWithCounts[] = [];
  try {
    courses = await listPublishedCourses(supabase);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[ondemand] failed to fetch courses:", err);
  }

  return (
    <>
      <section className="pt-12 pb-10 md:pt-16 md:pb-14 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-mustard/15 blur-3xl"
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
              Pick a course, watch the video, fill in the workbook, tick off
              each lesson. Lifetime access, paid once. No subscriptions.
            </p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: PlayCircle, label: "Bite-size HD videos" },
              { icon: BookOpen, label: "Downloadable workbooks" },
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

      <section className="py-12 md:py-16">
        <div className="container-wide">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600 mb-4">
                  <Compass className="h-6 w-6" />
                </div>
                <h2 className="font-serif text-2xl">
                  Anto is preparing the first course.
                </h2>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CourseCard({ course }: { course: CourseWithCounts }) {
  return (
    <Link href={`/ondemand/${course.slug}`} className="group block">
      <Card className="overflow-hidden h-full hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1">
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
              {course.price_gbp > 0
                ? formatCurrency(course.price_gbp)
                : "Free"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
