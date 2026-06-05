import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/* -------------------------------------------------------------------------- */
/*  Shared building blocks                                                     */
/* -------------------------------------------------------------------------- */

function PageHeading({ wide = false }: { wide?: boolean }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-64 rounded-xl md:h-11" />
      <Skeleton className={wide ? "h-4 w-80" : "h-4 w-56"} />
    </div>
  );
}

function CardShell({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-charcoal-100/40 bg-cream-50/60 p-6 shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Course catalogue (ondemand list)                                          */
/* -------------------------------------------------------------------------- */

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100/40 bg-cream-50/60 shadow-soft">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <SkeletonText lines={2} />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CatalogueSkeleton() {
  return (
    <div className="container-wide space-y-12 py-12 md:py-16">
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-xl rounded-2xl md:h-16" />
        <SkeletonText lines={2} className="max-w-lg" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Course detail (ondemand/[slug])                                           */
/* -------------------------------------------------------------------------- */

export function CourseDetailSkeleton() {
  return (
    <div className="container-wide space-y-10 py-12 md:py-16">
      <div className="space-y-4">
        <Skeleton className="h-6 w-44 rounded-full" />
        <Skeleton className="h-12 w-full max-w-2xl rounded-2xl md:h-16" />
        <SkeletonText lines={2} className="max-w-2xl" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <CardShell key={i} className="flex items-center gap-4 p-5">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </CardShell>
          ))}
        </div>
        <CardShell className="h-fit space-y-5 lg:sticky lg:top-24">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <SkeletonText lines={3} />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </CardShell>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Student dashboard                                                         */
/* -------------------------------------------------------------------------- */

export function DashboardSkeleton() {
  return (
    <div className="container-wide space-y-12 py-10 md:py-14">
      <section className="grid items-stretch gap-6 md:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-56 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl" />
      </section>
      <section className="space-y-5">
        <Skeleton className="h-7 w-52 rounded-lg" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lesson player (learn/[slug]/[lessonSlug])                                 */
/* -------------------------------------------------------------------------- */

export function LessonPlayerSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-0 lg:grid-cols-[340px_1fr]">
      {/* Curriculum sidebar */}
      <aside className="hidden border-r border-charcoal-100/40 bg-cream-50/40 p-5 lg:block">
        <Skeleton className="mb-6 h-6 w-40 rounded-lg" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, m) => (
            <div key={m} className="space-y-3">
              <Skeleton className="h-4 w-28" />
              {Array.from({ length: 4 }).map((_, l) => (
                <div key={l} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                  <Skeleton className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
      {/* Main video area */}
      <div className="space-y-6 p-5 md:p-8">
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3 rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <SkeletonText lines={4} className="max-w-3xl" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Account                                                                   */
/* -------------------------------------------------------------------------- */

export function AccountSkeleton() {
  return (
    <div className="container-narrow space-y-8 py-10 md:py-14">
      <PageHeading wide />
      <CardShell className="space-y-6 p-6 md:p-8">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-5 w-40 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-36 rounded-full" />
      </CardShell>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Admin — overview                                                          */
/* -------------------------------------------------------------------------- */

export function AdminOverviewSkeleton() {
  return (
    <div className="container-wide space-y-10 py-10 md:py-14">
      <PageHeading wide />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardShell key={i} className="space-y-4">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3.5 w-24" />
          </CardShell>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <AdminTableSkeleton bare rows={6} />
        <CardShell className="space-y-4">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3.5 flex-1" />
            </div>
          ))}
        </CardShell>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Admin — table list                                                        */
/* -------------------------------------------------------------------------- */

export function AdminTableSkeleton({
  rows = 8,
  bare = false,
}: {
  rows?: number;
  bare?: boolean;
}) {
  const table = (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100/40 bg-cream-50/60 shadow-soft">
      <div className="flex gap-4 border-b border-charcoal-100/40 bg-cream-50 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 max-w-[120px]" />
        ))}
      </div>
      <div className="divide-y divide-charcoal-100/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 flex-1 sm:block" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );

  if (bare) return table;

  return (
    <div className="container-wide space-y-8 py-10 md:py-14">
      <PageHeading wide />
      {table}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Admin — form / editor                                                     */
/* -------------------------------------------------------------------------- */

export function AdminFormSkeleton() {
  return (
    <div className="container-wide space-y-8 py-10 md:py-14">
      <PageHeading wide />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <CardShell className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-11 w-40 rounded-full" />
        </CardShell>
        <div className="space-y-6">
          <CardShell className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-full" />
          </CardShell>
          <CardShell className="space-y-3">
            <Skeleton className="h-5 w-28" />
            <SkeletonText lines={3} />
          </CardShell>
        </div>
      </div>
    </div>
  );
}
