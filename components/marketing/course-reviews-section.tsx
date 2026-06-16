"use client";

/**
 * Social-proof section for the course detail / sales page.
 *
 * Shows approved student reviews (from `get_course_public_reviews`) with a
 * rating-summary panel (average + distribution) and a grid of review cards.
 * Pure presentational client component — data is fetched server-side and
 * passed in. Renders nothing when there are no reviews, so the sales page
 * never shows an empty "no reviews yet" state.
 *
 * Brand language: cream / charcoal / mustard / terracotta, Baskerville serif
 * headings, soft rings & shadows, staggered scroll-reveal.
 */

import { motion } from "framer-motion";
import { Quote, Star, BadgeCheck, Sparkles } from "lucide-react";
import type { PublicCourseReview } from "@/lib/supabase/queries";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface Props {
  reviews: PublicCourseReview[];
}

export function CourseReviewsSection({ reviews }: Props) {
  if (!reviews || reviews.length === 0) return null;

  const count = reviews.length;
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(count, 1);

  // 5★ → 1★ distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => r.rating === star).length;
    return { star, n, pct: count > 0 ? Math.round((n / count) * 100) : 0 };
  });

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden border-t border-charcoal-100/40 bg-cream-100/50 py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-terracotta/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-[380px] w-[380px] rounded-full bg-mustard/12 blur-3xl"
      />

      <div className="container-wide relative">
        {/* Heading */}
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-mustard-600">
            <Sparkles className="h-3.5 w-3.5" /> Student stories
          </p>
          <h2 className="font-serif text-display-md text-balance leading-tight">
            What learners say after{" "}
            <span className="gradient-text">finishing</span>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-14">
          {/* Rating summary panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-cream-50 p-7 shadow-soft ring-1 ring-charcoal-100/40">
              <div className="flex items-end gap-3">
                <span className="font-serif text-6xl leading-none text-charcoal-600">
                  {avg.toFixed(1)}
                </span>
                <span className="pb-1 text-sm text-charcoal-400">/ 5</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(avg)
                        ? "h-5 w-5 fill-mustard-400 text-mustard-400"
                        : "h-5 w-5 text-charcoal-200"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-charcoal-400">
                Based on {count} verified{" "}
                {count === 1 ? "review" : "reviews"}
              </p>

              {/* Distribution */}
              <div className="mt-6 space-y-2">
                {distribution.map(({ star, n, pct }) => (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="flex w-8 shrink-0 items-center gap-0.5 text-charcoal-400">
                      {star}
                      <Star className="h-3 w-3 fill-charcoal-300 text-charcoal-300" />
                    </span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-charcoal-100">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-mustard to-mustard-400"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-5 shrink-0 text-right tabular-nums text-charcoal-400">
                      {n}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-6 flex items-center gap-2 border-t border-charcoal-100/50 pt-5 text-xs leading-relaxed text-charcoal-400">
                <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                Every review is from an enrolled student.
              </p>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: PublicCourseReview;
  index: number;
}) {
  const date = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(review.created_at));

  const initials = getInitials(review.reviewer_name);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: EASE }}
      className={`group relative flex flex-col gap-4 rounded-2xl bg-cream-50 p-6 shadow-soft ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg ${
        review.is_pinned
          ? "ring-mustard/40"
          : "ring-charcoal-100/40 hover:ring-mustard/30"
      }`}
    >
      <Quote
        aria-hidden="true"
        className="absolute right-5 top-5 h-8 w-8 text-mustard/15"
      />

      {review.is_pinned && (
        <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-mustard px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-soft">
          <Sparkles className="h-3 w-3" /> Featured
        </span>
      )}

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < review.rating
                ? "h-4 w-4 fill-mustard-400 text-mustard-400"
                : "h-4 w-4 text-charcoal-200"
            }
          />
        ))}
      </div>

      {review.title && (
        <h3 className="font-serif text-lg leading-snug text-charcoal-600">
          {review.title}
        </h3>
      )}

      {review.body && (
        <blockquote className="relative text-sm leading-relaxed text-charcoal-500/90">
          {review.body}
        </blockquote>
      )}

      <figcaption className="mt-auto flex items-center gap-3 border-t border-charcoal-100/50 pt-4">
        {review.reviewer_avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.reviewer_avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-1 ring-charcoal-100/50"
          />
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-mustard/15 text-xs font-semibold text-mustard-600">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1 truncate text-sm font-semibold text-charcoal-600">
            {review.reviewer_name}
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          </p>
          <p className="text-xs text-charcoal-400">{date}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "★";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
