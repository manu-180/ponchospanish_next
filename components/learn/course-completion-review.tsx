"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkCompleteButton } from "@/components/learn/mark-complete-button";
import { ReviewModal } from "@/components/learn/review-modal";

interface CourseCompletionReviewProps {
  lessonId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  initiallyCompleted: boolean;
  hasAlreadyReviewed: boolean;
}

export function CourseCompletionReview({
  lessonId,
  userId,
  courseId,
  courseTitle,
  initiallyCompleted,
  hasAlreadyReviewed,
}: CourseCompletionReviewProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <MarkCompleteButton
          lessonId={lessonId}
          userId={userId}
          initiallyCompleted={initiallyCompleted}
          nextLessonHref={null}
          onComplete={hasAlreadyReviewed ? undefined : () => setModalOpen(true)}
        />

        {/* Show "Leave a review" only when the lesson is already done and no review yet */}
        {initiallyCompleted && !hasAlreadyReviewed && (
          <Button
            variant="soft"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-1.5 text-mustard-600 border-mustard-200 bg-mustard/10 hover:bg-mustard/20"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Leave a review
          </Button>
        )}
      </div>

      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </>
  );
}
