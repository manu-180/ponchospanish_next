"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface MarkCompleteButtonProps {
  lessonId: string;
  userId: string;
  initiallyCompleted: boolean;
  nextLessonHref?: string | null;
}

export function MarkCompleteButton({
  lessonId,
  userId,
  initiallyCompleted,
  nextLessonHref,
}: MarkCompleteButtonProps) {
  const router = useRouter();
  const [done, setDone] = useState(initiallyCompleted);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      if (done) {
        const { error } = await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", lessonId);
        if (error) {
          toast.error(error.message);
          return;
        }
        setDone(false);
        toast("Marked as not completed", { description: "We'll keep it in your queue." });
        router.refresh();
        return;
      }

      const { error } = await supabase
        .from("lesson_progress")
        .upsert(
          { user_id: userId, lesson_id: lessonId } as never,
          { onConflict: "user_id,lesson_id" },
        );
      if (error) {
        toast.error(error.message);
        return;
      }
      setDone(true);
      toast.success("Unit completed!");
      router.refresh();
      if (nextLessonHref) router.push(nextLessonHref);
    });
  };

  if (done) {
    return (
      <Button
        variant="soft"
        onClick={toggle}
        disabled={isPending}
        className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
      >
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        {isPending ? "Updating..." : "Completed"}
      </Button>
    );
  }

  return (
    <Button onClick={toggle} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Saving...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" /> Mark as complete
        </>
      )}
    </Button>
  );
}
