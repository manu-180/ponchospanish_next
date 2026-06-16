"use client";

/**
 * Mux player wrapper for paywall-gated lesson videos.
 *
 * Signed playback policy → tokens are minted server-side and passed here as
 * props (15 min TTL by default). The Mux player handles HLS, captions,
 * scrubbing, etc.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Lock, PlayCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  CaptionOverlay,
  type OverlayCue,
} from "@/components/subtitles/caption-overlay";
import { UpNextOverlay, type UpNextLesson } from "@/components/learn/up-next-overlay";
import { ReviewModal } from "@/components/learn/review-modal";

// next/dynamic — mux-player-react is a client-only custom element that
// throws if rendered during SSR. ssr:false keeps the bundle clean.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-charcoal-700 text-cream/40">
      <PlayCircle className="h-10 w-10" />
    </div>
  ),
});

interface Props {
  playbackId: string | null;
  playbackToken: string | null;
  thumbnailToken?: string | null;
  storyboardToken?: string | null;
  title: string;
  locked?: boolean;
  userId?: string;
  /** lessonId for analytics — also used for live token refresh later. */
  lessonId?: string;
  /** Subtitle cues to render as a styled overlay (the course's design). */
  captionCues?: OverlayCue[];
  /** Caption design preset id (from course.caption_style). */
  captionPreset?: string;
  onComplete?: () => void;
  /** Next lesson for the end-of-video "up next" card. */
  nextUp?: UpNextLesson | null;
  /** Course title (shown on the "course complete" end card). */
  courseTitle?: string;
  /** Course cover, used as fallback artwork in the up-next card. */
  coverImage?: string | null;
  /** /ondemand/{slug} — unlock CTA + back-to-course target. */
  overviewHref?: string;
  /** Whether this video should start playing automatically (auto-advance). */
  autoPlay?: boolean;
  /**
   * When true the player writes a lesson_progress row to Supabase when the
   * video ends. Requires userId + lessonId to be set.
   */
  autoMarkComplete?: boolean;
  /**
   * Last-lesson review prompt. When present and not yet reviewed, the
   * end-of-course card gets a "Leave a review" button that opens the modal.
   */
  reviewPrompt?: {
    courseId: string;
    courseTitle: string;
    alreadyReviewed: boolean;
  } | null;
}

export function MuxLessonPlayer({
  playbackId,
  playbackToken,
  thumbnailToken,
  storyboardToken,
  title,
  locked,
  userId,
  lessonId,
  captionCues,
  captionPreset,
  onComplete,
  nextUp,
  courseTitle,
  coverImage,
  overviewHref,
  autoPlay,
  autoMarkComplete,
  reviewPrompt,
}: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showUpNext, setShowUpNext] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const canLeaveReview = Boolean(reviewPrompt && !reviewPrompt.alreadyReviewed);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [fullscreenEl, setFullscreenEl] = useState<Element | null>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCaptions = Boolean(captionCues && captionCues.length > 0);

  // Track when the browser enters/exits fullscreen so we can portal the overlay
  useEffect(() => {
    const onChange = () => setFullscreenEl(document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Show controls pill while mouse is moving; hide after 3 s of inactivity
  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  // Reset state when lesson changes
  useEffect(() => {
    setCompleted(false);
    setShowUpNext(false);
  }, [playbackId]);

  // Write a lesson_progress row and refresh the sidebar/outline.
  const markComplete = useCallback(async () => {
    if (!autoMarkComplete || !userId || !lessonId) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({ user_id: userId, lesson_id: lessonId } as never, {
        onConflict: "user_id,lesson_id",
      });
    if (error) {
      console.error("Failed to mark lesson complete:", error);
      return;
    }
    router.refresh();
  }, [autoMarkComplete, userId, lessonId, router]);

  // Show overlay: if in fullscreen exit first so the overlay is visible.
  const triggerEndCard = useCallback(() => {
    const exitAndShow = () => {
      setShowUpNext(true);
    };
    if (document.fullscreenElement) {
      const onExit = () => {
        document.removeEventListener("fullscreenchange", onExit);
        exitAndShow();
      };
      document.addEventListener("fullscreenchange", onExit);
      void document.exitFullscreen();
    } else {
      exitAndShow();
    }
  }, []);

  const handleAdvance = (href: string) => {
    router.push(`${href}?autoplay=1`);
  };

  const handleReplay = () => {
    const media = ref.current as (HTMLMediaElement & HTMLElement) | null;
    if (media) {
      try {
        media.currentTime = 0;
        void media.play?.();
      } catch {
        /* ignore */
      }
    }
    setShowUpNext(false);
  };

  if (locked) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-700 ring-1 ring-charcoal-100/40 flex items-center justify-center text-cream/80">
        <div className="text-center space-y-3 px-6">
          <Lock className="mx-auto h-10 w-10 text-mustard-200" />
          <p className="font-serif text-xl">This lesson is locked</p>
          <p className="text-sm text-cream/60 max-w-sm mx-auto">
            Unlock the full course to keep watching.
          </p>
        </div>
      </div>
    );
  }

  if (!playbackId || !playbackToken) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-100/40 ring-1 ring-charcoal-100/40 flex items-center justify-center text-charcoal-400">
        <div className="text-center space-y-2 px-6">
          <PlayCircle className="mx-auto h-10 w-10" />
          <p className="text-sm">Video coming soon.</p>
        </div>
      </div>
    );
  }

  const captionOverlay = hasCaptions ? (
    <CaptionOverlay
      cues={captionCues as OverlayCue[]}
      currentTime={currentTime}
      presetId={captionPreset ?? "classic"}
      hidden={!captionsVisible}
      showSizeControl
      showVisibilityToggle
      controlsVisible={controlsVisible}
      useFixed={Boolean(fullscreenEl)}
      onToggleVisible={() => setCaptionsVisible((v) => !v)}
    />
  ) : null;

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-900 ring-1 ring-charcoal-100/40 shadow-soft-lg"
      onMouseMove={handleMouseMove}
    >
      <MuxPlayer
        ref={ref as never}
        playbackId={playbackId}
        tokens={{
          playback: playbackToken,
          ...(thumbnailToken ? { thumbnail: thumbnailToken } : {}),
          ...(storyboardToken ? { storyboard: storyboardToken } : {}),
        }}
        metadata={{
          video_title: title,
          ...(userId ? { viewer_user_id: userId } : {}),
          ...(lessonId ? { video_id: lessonId } : {}),
        }}
        streamType="on-demand"
        accentColor="#d97706"
        autoPlay={autoPlay ? "any" : undefined}
        // Cap delivery at 720p. Mux bills per minute *delivered* by resolution,
        // so this is the single biggest lever on the recurring streaming bill —
        // 720p is indistinguishable for talking-head lessons on most screens.
        maxResolution="720p"
        // Only fetch metadata until the viewer hits play — avoids paying for
        // segment delivery on lessons that are opened but never watched.
        preload="metadata"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        onEnded={() => {
          if (!completed) {
            setCompleted(true);
            onComplete?.();
            void markComplete();
          }
          triggerEndCard();
        }}
        onTimeUpdate={(e) => {
          const target = e.target as HTMLMediaElement;
          if (hasCaptions) setCurrentTime(target.currentTime || 0);
          if (!target.duration) return;
          const pct = (target.currentTime / target.duration) * 100;
          if (pct >= 92 && !completed) {
            setCompleted(true);
            onComplete?.();
            void markComplete();
          }
        }}
      />
      {/* When fullscreen, portal the overlay into the fullscreen element so it
          isn't clipped — Mux takes its own element fullscreen, not our wrapper. */}
      {captionOverlay && fullscreenEl
        ? createPortal(captionOverlay, fullscreenEl)
        : captionOverlay}
      {showUpNext && (
        <UpNextOverlay
          next={nextUp ?? null}
          coverImage={coverImage}
          courseTitle={courseTitle ?? "this course"}
          overviewHref={overviewHref ?? "/ondemand"}
          onAdvance={handleAdvance}
          onReplay={handleReplay}
          onDismiss={() => setShowUpNext(false)}
          onLeaveReview={
            canLeaveReview
              ? () => {
                  setShowUpNext(false);
                  setReviewOpen(true);
                }
              : undefined
          }
        />
      )}
      {reviewPrompt && (
        <ReviewModal
          open={reviewOpen}
          onClose={() => {
            setReviewOpen(false);
            // Re-sync server state (hasReviewed) so the CTA doesn't reappear.
            router.refresh();
          }}
          courseId={reviewPrompt.courseId}
          courseTitle={reviewPrompt.courseTitle}
        />
      )}
    </div>
  );
}
