import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { ReviewsInbox, type ReviewRow } from "@/components/admin/reviews-inbox";

export const metadata = {
  title: "Reviews — Admin",
};

export default async function AdminReviewsPage() {
  const admin = getSupabaseAdminClient();

  const { data, error } = await admin
    .from("course_reviews")
    .select(
      "*, profile:profiles!course_reviews_user_id_fkey(full_name, email), course:courses!course_reviews_course_id_fkey(title, slug)",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  const reviews = (data ?? []) as unknown as ReviewRow[];
  const pendingCount = reviews.filter((r) => !r.is_visible).length;

  return (
    <div className="container-wide py-10 md:py-14 max-w-3xl space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl">Reviews</h1>
          <p className="text-charcoal-400 mt-1">
            Approve and manage reviews left by your students.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="shrink-0 rounded-xl bg-mustard/15 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-mustard-600 leading-none">
              {pendingCount}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-mustard-500 mt-0.5">
              pending
            </p>
          </div>
        )}
      </div>

      <ReviewsInbox reviews={reviews} />
    </div>
  );
}
