import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  PlayCircle,
} from "lucide-react";
import {
  getCurrentUser,
  getCurrentProfile,
  getSupabaseServerClient,
} from "@/lib/supabase/server";
import {
  getCompletedLessonIds,
  listUserEnrollments,
} from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RedeemCodeCard } from "@/components/learn/redeem-code-card";

export const metadata = { title: "My Academy" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const profile = await getCurrentProfile();

  const supabase = await getSupabaseServerClient();
  let enrollments: Awaited<ReturnType<typeof listUserEnrollments>> = [];
  let completedIds: string[] = [];
  try {
    enrollments = await listUserEnrollments(supabase, user.id);
    completedIds = await getCompletedLessonIds(supabase, user.id);
  } catch (err) {
    console.warn("[dashboard] queries failed (DB may not be provisioned yet):", err);
  }

  const firstName =
    (profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "")
      .toString()
      .split(/[\s@]/)[0] || "there";

  return (
    <div className="container-wide py-10 md:py-14 space-y-12">
      <section className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-stretch">
        <div className="rounded-3xl bg-gradient-to-br from-mustard via-mustard-400 to-terracotta p-8 md:p-10 text-white shadow-soft-lg relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.3),_transparent_50%)]"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80 mb-2">
              Welcome back
            </p>
            <h1 className="font-serif text-3xl md:text-5xl leading-tight">
              Hola, <span className="italic">{firstName}</span>!
            </h1>
            <p className="mt-3 text-white/85 max-w-md">
              Pick up where you left off, or explore the catalogue to keep
              building your Spanish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="soft" className="bg-white text-charcoal-600">
                <Link href="/ondemand">
                  <Compass className="h-4 w-4" />
                  Browse Academy
                </Link>
              </Button>
              {enrollments[0] && (
                <Button asChild variant="soft" className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                  <Link href={`/learn/${enrollments[0].course?.slug ?? ""}`}>
                    Resume learning <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <RedeemCodeCard />
      </section>

      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">My courses</h2>
            <p className="text-sm text-charcoal-400">
              {enrollments.length === 0
                ? "You haven't enrolled in any course yet."
                : `${enrollments.length} course${enrollments.length === 1 ? "" : "s"} unlocked.`}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/ondemand">
              Catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {enrollments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => {
              const course = e.course;
              if (!course) return null;
              const totalLessonsCount = 0; // computed below by client if needed; simplistic for now
              const completedCount = completedIds.length; // we'll show overall
              const progress = totalLessonsCount > 0 ? (completedCount / totalLessonsCount) * 100 : 0;

              return (
                <Card key={e.id} className="overflow-hidden hover:shadow-soft-lg transition-shadow">
                  <Link href={`/learn/${course.slug}`} className="block">
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-mustard/20 via-cream-100 to-terracotta/20">
                      {course.cover_image_path ? (
                        <Image
                          src={course.cover_image_path}
                          alt={course.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-mustard/60" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="success">Lifetime access</Badge>
                        {e.source === "access_code" && (
                          <Badge variant="terracotta">Code unlocked</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-serif text-xl leading-tight line-clamp-2">
                        {course.title}
                      </h3>
                      {course.subtitle && (
                        <p className="mt-1 text-sm text-charcoal-400 line-clamp-2">
                          {course.subtitle}
                        </p>
                      )}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-charcoal-400 mb-1.5">
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> {Math.round(progress)}%
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <PlayCircle className="h-3 w-3" /> Continue
                          </span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="p-10 text-center space-y-4">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mustard/15 text-mustard-600">
          <Compass className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-2xl">Ready to start?</h3>
        <p className="text-charcoal-400 max-w-sm mx-auto">
          Browse the Academy and pick the course that fits where you are right
          now. Or paste a free-access code above.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild>
            <Link href="/ondemand">Browse courses</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
