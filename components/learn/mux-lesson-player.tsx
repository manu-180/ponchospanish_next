"use client";

/**
 * Mux player wrapper for paywall-gated lesson videos.
 *
 * Signed playback policy → tokens are minted server-side and passed here as
 * props (15 min TTL by default). The Mux player handles HLS, captions,
 * scrubbing, etc.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Lock, PlayCircle } from "lucide-react";

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
  onComplete?: () => void;
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
  onComplete,
}: Props) {
  const [completed, setCompleted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  // Reset completion flag when lesson changes
  useEffect(() => {
    setCompleted(false);
  }, [playbackId]);

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

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-900 ring-1 ring-charcoal-100/40 shadow-soft-lg">
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
          }
        }}
        onTimeUpdate={(e) => {
          const target = e.target as HTMLMediaElement;
          if (!target.duration) return;
          const pct = (target.currentTime / target.duration) * 100;
          if (pct >= 92 && !completed) {
            setCompleted(true);
            onComplete?.();
          }
        }}
      />
    </div>
  );
}
