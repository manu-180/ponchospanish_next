import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
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
  listUserPurchases,
} from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RedeemCodeCard } from "@/components/learn/redeem-code-card";
import { DownloadProductButton } from "@/components/learn/download-product-button";
import { AdminBanner } from "@/components/admin/admin-banner";
import { formatBytes } from "@/lib/utils";

export const metadata = { title: "My Academy" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const supabase = await getSupabaseServerClient();
  let enrollments: Awaited<ReturnType<typeof listUserEnrollments>> = [];
  let completedIds: string[] = [];
  let purchases: Awaited<ReturnType<typeof listUserPurchases>> = [];
  try {
    [enrollments, completedIds, purchases] = await Promise.all([
      listUserEnrollments(supabase, user.id),
      getCompletedLessonIds(supabase, user.id),
      listUserPurchases(supabase, user.id),
    ]);
  } catch (err) {
    console.warn("[dashboard] queries failed (DB may not be provisioned yet):", err);
  }

  const firstName =
    (profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "")
      .toString()
      .split(/[\s@]/)[0] || "there";

  return (
    <div className="container-wide py-10 md:py-14 space-y-12">
      {isAdmin && <AdminBanner />}
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

              // Count total lessons in this course
              const modules = (course as any).modules ?? [];
              const totalLessonsCount = modules.reduce(
                (acc: number, m: any) => acc + ((m.lessons ?? []).length),
                0,
              );

              // Count completed lessons for this course
              const courseLessonIds = modules.flatMap((m: any) =>
                (m.lessons ?? []).map((l: any) => l.id)
              );
              const completedCount = completedIds.filter((id) =>
                courseLessonIds.includes(id)
              ).length;
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

      {purchases.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">
                My ebooks &amp; resources
              </h2>
              <p className="text-sm text-charcoal-400">
                {purchases.length} download{purchases.length === 1 ? "" : "s"}{" "}
                unlocked — yours forever.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/ondemand">
                More resources <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {purchases.map((p) => {
              const product = p.product;
              if (!product) return null;
              return (
                <Card key={p.id} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-md rounded-l-sm shadow-soft ring-1 ring-charcoal-100/40 bg-gradient-to-br from-mustard/20 via-cream-100 to-terracotta/20">
                      {product.cover_image_path ? (
                        <Image
                          src={product.cover_image_path}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-mustard/60" />
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/ondemand/ebooks/${product.slug}`}
                        className="font-serif text-base leading-tight line-clamp-2 hover:text-mustard-600 transition-colors"
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-[11px] text-charcoal-400">
                        {product.file_size_bytes
                          ? `PDF · ${formatBytes(product.file_size_bytes)}`
                          : "PDF"}
                      </p>
                      <div className="mt-auto pt-3">
                        <DownloadProductButton
                          productId={product.id}
                          label="Download"
                          size="sm"
                          variant="soft"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
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
