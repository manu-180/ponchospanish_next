"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, PlayCircle } from "lucide-react";

interface VideoPlayerProps {
  src: string | null;
  poster?: string | null;
  title: string;
  locked?: boolean;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({
  src,
  poster,
  title,
  locked,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(false);
  }, [src]);

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

  if (!src) {
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
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-700 ring-1 ring-charcoal-100/40 shadow-soft-lg">
      <video
        ref={ref}
        src={src}
        controls
        controlsList="nodownload"
        poster={poster ?? undefined}
        preload="metadata"
        className="absolute inset-0 h-full w-full"
        playsInline
        aria-label={title}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!v.duration) return;
          const pct = (v.currentTime / v.duration) * 100;
          onProgress?.(pct);
          if (pct >= 92 && !completed) {
            setCompleted(true);
            onComplete?.();
          }
        }}
        onEnded={() => {
          if (!completed) {
            setCompleted(true);
            onComplete?.();
          }
        }}
      />
    </div>
  );
}
