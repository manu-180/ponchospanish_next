"use client";

import { useState, useTransition } from "react";
import {
  CheckCircle2,
  EyeOff,
  Pin,
  PinOff,
  Trash2,
  Loader2,
  MessageSquare,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StarDisplay } from "@/components/learn/star-rating-picker";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type ReviewRow = {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_visible: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profile: { full_name: string | null; email: string } | null;
  course: { title: string; slug: string } | null;
};

type Tab = "pending" | "published" | "all";

function initials(name: string | null, email: string): string {
  return (name || email)
    .split(/\s+|@/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// --- Review card -----------------------------------------------------------

function ReviewCard({
  review,
  onMutate,
}: {
  review: ReviewRow;
  onMutate: (id: string, patch: Partial<ReviewRow> | null) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const patch = async (update: { is_visible?: boolean; is_pinned?: boolean }) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      if (!res.ok) {
        toast.error("Failed to update review. Please try again.");
        return;
      }
      onMutate(review.id, update);
      if ("is_visible" in update) {
        toast.success(update.is_visible ? "Review published." : "Review unpublished.");
      } else if ("is_pinned" in update) {
        toast.success(update.is_pinned ? "Review pinned." : "Review unpinned.");
      }
    });
  };

  const remove = async () => {
    if (!confirm("Delete this review permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete review.");
        return;
      }
      onMutate(review.id, null);
      toast.success("Review deleted.");
    });
  };

  const name = review.profile?.full_name ?? review.profile?.email ?? "Unknown";
  const email = review.profile?.email ?? "";

  return (
    <Card
      className={cn(
        "border-charcoal-100/70 shadow-soft transition-all duration-200",
        review.is_pinned && "ring-1 ring-mustard/40 border-mustard/30",
      )}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mustard text-xs font-bold text-white shadow-sm">
              {initials(review.profile?.full_name ?? null, email)}
            </span>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Top row: user + meta */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-charcoal-700 leading-tight">
                  {name}
                </p>
                <p className="text-xs text-charcoal-400">{email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-400">
                {review.is_pinned && (
                  <Badge variant="default" className="bg-mustard/15 text-mustard-600 border-0 text-[10px]">
                    Pinned
                  </Badge>
                )}
                <Badge
                  variant={review.is_visible ? "success" : "muted"}
                  className="text-[10px]"
                >
                  {review.is_visible ? (
                    <><Globe className="h-2.5 w-2.5 mr-1" /> Published</>
                  ) : (
                    <><Clock className="h-2.5 w-2.5 mr-1" /> Pending</>
                  )}
                </Badge>
                <span>{formatDate(review.created_at)}</span>
              </div>
            </div>

            {/* Course + rating */}
            <div className="flex flex-wrap items-center gap-3">
              {review.course && (
                <Badge variant="outline" className="text-[11px] text-charcoal-500 border-charcoal-200">
                  {review.course.title}
                </Badge>
              )}
              <StarDisplay rating={review.rating} size="sm" showLabel />
            </div>

            {/* Review body */}
            {review.body && (
              <p className="text-sm text-charcoal-500 leading-relaxed line-clamp-5 whitespace-pre-line">
                &ldquo;{review.body}&rdquo;
              </p>
            )}
            {!review.body && (
              <p className="text-xs text-charcoal-300 italic">No written review.</p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {!review.is_visible ? (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => patch({ is_visible: true })}
                  className="h-8 text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Publish
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="soft"
                  disabled={isPending}
                  onClick={() => patch({ is_visible: false })}
                  className="h-8 text-xs gap-1.5 text-charcoal-500"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  Unpublish
                </Button>
              )}

              <Button
                size="sm"
                variant="soft"
                disabled={isPending}
                onClick={() => patch({ is_pinned: !review.is_pinned })}
                className={cn(
                  "h-8 text-xs gap-1.5",
                  review.is_pinned
                    ? "text-mustard-600 bg-mustard/10 border-mustard-200 hover:bg-mustard/20"
                    : "text-charcoal-500",
                )}
              >
                {review.is_pinned ? (
                  <PinOff className="h-3.5 w-3.5" />
                ) : (
                  <Pin className="h-3.5 w-3.5" />
                )}
                {review.is_pinned ? "Unpin" : "Pin"}
              </Button>

              <Button
                size="sm"
                variant="soft"
                disabled={isPending}
                onClick={remove}
                className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10 ml-auto"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Tab button ------------------------------------------------------------

function TabButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-mustard text-white shadow-soft"
          : "text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700",
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
            active ? "bg-white/30 text-white" : "bg-charcoal-100 text-charcoal-500",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// --- Main component --------------------------------------------------------

export function ReviewsInbox({ reviews: initial }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewRow[]>(initial);
  const [tab, setTab] = useState<Tab>("pending");

  const handleMutate = (id: string, patch: Partial<ReviewRow> | null) => {
    if (patch === null) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    }
    router.refresh();
  };

  const pending = reviews.filter((r) => !r.is_visible);
  const published = reviews.filter((r) => r.is_visible);
  const visible =
    tab === "pending" ? pending : tab === "published" ? published : reviews;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-cream-100/60 rounded-xl w-fit">
        <TabButton
          active={tab === "pending"}
          onClick={() => setTab("pending")}
          count={pending.length}
        >
          <Clock className="h-3.5 w-3.5" />
          Pending
        </TabButton>
        <TabButton
          active={tab === "published"}
          onClick={() => setTab("published")}
          count={published.length}
        >
          <Globe className="h-3.5 w-3.5" />
          Published
        </TabButton>
        <TabButton
          active={tab === "all"}
          onClick={() => setTab("all")}
          count={reviews.length}
        >
          All
        </TabButton>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal-100/60 text-charcoal-400">
            <MessageSquare className="h-7 w-7" />
          </div>
          <p className="font-serif text-lg text-charcoal-500">
            {tab === "pending"
              ? "No reviews waiting for approval"
              : tab === "published"
                ? "No published reviews yet"
                : "No reviews yet"}
          </p>
          <p className="text-sm text-charcoal-400 max-w-xs">
            {tab === "pending"
              ? "When students leave a review it will appear here for you to approve."
              : "Published reviews will show up here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((review) => (
            <ReviewCard key={review.id} review={review} onMutate={handleMutate} />
          ))}
        </div>
      )}
    </div>
  );
}
