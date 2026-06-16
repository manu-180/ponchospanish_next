"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingPicker } from "@/components/learn/star-rating-picker";
import { toast } from "sonner";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

export function ReviewModal({
  open,
  onClose,
  courseId,
  courseTitle,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating first.");
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          body: body.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(
          (json as { error?: string }).error ?? "Something went wrong. Please try again.",
        );
        return;
      }
      setSubmitted(true);
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isPending) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-cream-50 border-charcoal-100/60 p-0 overflow-hidden shadow-soft-lg">
        <DialogTitle className="sr-only">
          {submitted ? "Review submitted" : `Rate ${courseTitle}`}
        </DialogTitle>

        {!submitted ? (
          <div className="px-8 py-9 space-y-7">
            {/* Header */}
            <div className="text-center space-y-2 pr-4">
              <h2 className="font-serif text-2xl text-charcoal-700 leading-tight">
                How did you find it?
              </h2>
              <p className="text-sm text-charcoal-400 leading-relaxed max-w-xs mx-auto">
                Your thoughts help other learners discover{" "}
                <em className="not-italic font-medium text-charcoal-500">
                  {courseTitle}
                </em>
                .
              </p>
            </div>

            {/* Stars */}
            <div className="py-1">
              <StarRatingPicker
                value={rating}
                onChange={setRating}
                disabled={isPending}
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
                Share a few words{" "}
                <span className="font-normal normal-case tracking-normal text-charcoal-300">
                  — optional
                </span>
              </label>
              <Textarea
                placeholder="What did you enjoy most? What helped you improve? Your honest words make a real difference to other learners."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                disabled={isPending}
                rows={4}
                maxLength={2000}
                className="resize-none bg-cream border-charcoal-100 placeholder:text-charcoal-300 focus-visible:ring-mustard/30 text-sm"
              />
              <p className="text-[11px] text-charcoal-300 text-right">
                {body.length}/2000
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-1">
              <Button
                onClick={submit}
                disabled={rating === 0 || isPending}
                className="w-full bg-gradient-to-r from-mustard to-mustard-400 hover:opacity-90 text-white font-semibold shadow-soft h-11"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Submit review"
                )}
              </Button>
              <button
                onClick={() => !isPending && onClose()}
                disabled={isPending}
                className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors py-1 disabled:opacity-50"
              >
                Maybe later
              </button>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="px-8 py-12 text-center space-y-6">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-50/50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-charcoal-700">
                Thank you!
              </h2>
              <p className="text-sm text-charcoal-400 leading-relaxed max-w-xs mx-auto">
                We&apos;ll share your review with other learners once we&apos;ve
                had a look. We really appreciate you taking the time.
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="soft"
              className="mt-2 min-w-[140px]"
            >
              Back to the course
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
