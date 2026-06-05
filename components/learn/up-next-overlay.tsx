"use client";

/**
 * "Up next" end-card overlay shown when a lesson video reaches its end.
 *
 * Three states, all sharing the same premium glass card:
 *  1. next accessible  → countdown ring (5s) that auto-advances, "Play now",
 *     "Cancel" (stops the timer but keeps the card), and "Replay".
 *  2. next locked       → no countdown; CTA to unlock the full course.
 *  3. last lesson       → no countdown; "You finished" + back-to-course + replay.
 *
 * Matches the Poncho design language (cream / charcoal / mustard, serif
 * headings, soft rings & shadows). Fully keyboard accessible.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

const COUNTDOWN_SECONDS = 5;

export interface UpNextLesson {
  title: string;
  moduleTitle?: string | null;
  /** Href to navigate to. null when the next lesson is locked. */
  href: string | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  /** true when the user has no access to the next lesson. */
  locked: boolean;
}

interface Props {
  next: UpNextLesson | null;
  /** Fallback artwork (course cover) when the lesson has no thumbnail. */
  coverImage?: string | null;
  courseTitle: string;
  /** /ondemand/{slug} — unlock CTA + "back to course" target. */
  overviewHref: string;
  /** Auto-advance (push the next href). Receives the destination. */
  onAdvance: (href: string) => void;
  onReplay: () => void;
  onDismiss: () => void;
}

export function UpNextOverlay({
  next,
  coverImage,
  courseTitle,
  overviewHref,
  onAdvance,
  onReplay,
  onDismiss,
}: Props) {
  const canAutoAdvance = Boolean(next && !next.locked && next.href);
  const [counting, setCounting] = useState(canAutoAdvance);
  const [progress, setProgress] = useState(0); // 0 → 1
  const rafRef = useRef<number | null>(null);
  const advancedRef = useRef(false);

  // Countdown driven by requestAnimationFrame for a buttery progress ring.
  useEffect(() => {
    if (!counting || !canAutoAdvance || !next?.href) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const p = Math.min(elapsed / COUNTDOWN_SECONDS, 1);
      setProgress(p);
      if (p >= 1) {
        if (!advancedRef.current) {
          advancedRef.current = true;
          onAdvance(next.href!);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [counting, canAutoAdvance, next?.href, onAdvance]);

  const secondsLeft = Math.ceil(COUNTDOWN_SECONDS * (1 - progress));
  const artwork = next?.thumbnailUrl || coverImage || null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300">
      {/* Dim + blur backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-700/85 via-charcoal-700/80 to-charcoal-700/90 backdrop-blur-md" />

      <div className="relative w-full max-w-2xl">
        {/* Close (top-right of the player) */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute -top-1 right-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream/70 ring-1 ring-cream/15 backdrop-blur transition hover:bg-cream/20 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400 sm:-top-2 sm:-right-2"
        >
          <X className="h-4 w-4" />
        </button>

        {next && !next.locked && next.href ? (
          /* ---------- State 1: next accessible ---------- */
          <div className="flex flex-col gap-5 rounded-3xl bg-charcoal-700/60 p-5 ring-1 ring-cream/10 shadow-soft-lg sm:p-7">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mustard-300">
              Up next
            </span>

            <div className="flex items-center gap-4 sm:gap-5">
              {/* Thumbnail with countdown ring on the play button */}
              <button
                type="button"
                onClick={() => onAdvance(next.href!)}
                className="group relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-cream/15 sm:w-44 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400"
                aria-label={`Play ${next.title}`}
              >
                {artwork ? (
                  <Image
                    src={artwork}
                    alt={next.title}
                    fill
                    sizes="176px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-charcoal-700" />
                )}
                <div className="absolute inset-0 bg-charcoal-700/30 transition group-hover:bg-charcoal-700/10" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <CountdownRing
                    progress={counting ? progress : 0}
                    seconds={counting ? secondsLeft : null}
                  />
                </span>
              </button>

              <div className="min-w-0 flex-1 space-y-1.5">
                {next.moduleTitle && (
                  <p className="truncate text-[11px] uppercase tracking-[0.18em] text-cream/45">
                    {next.moduleTitle}
                  </p>
                )}
                <h3 className="font-serif text-xl leading-snug text-cream sm:text-2xl line-clamp-2">
                  {next.title}
                </h3>
                {next.durationSeconds ? (
                  <p className="text-sm text-cream/55">
                    {formatDuration(next.durationSeconds)}
                  </p>
                ) : null}
                {counting && (
                  <p className="pt-0.5 text-sm text-cream/65">
                    Playing in{" "}
                    <span className="font-semibold text-mustard-300">
                      {secondsLeft}s
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onAdvance(next.href!)}
                className="inline-flex items-center gap-2 rounded-full bg-mustard-500 px-5 py-2.5 text-sm font-semibold text-charcoal-700 shadow-sm transition hover:bg-mustard-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-300 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-700"
              >
                <Play className="h-4 w-4 fill-current" />
                Play now
              </button>
              {counting ? (
                <button
                  type="button"
                  onClick={() => setCounting(false)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-cream/70 ring-1 ring-cream/15 transition hover:bg-cream/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400"
                >
                  Cancel
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onReplay}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-cream/70 ring-1 ring-cream/15 transition hover:bg-cream/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400"
                >
                  <RotateCcw className="h-4 w-4" />
                  Replay
                </button>
              )}
            </div>
          </div>
        ) : next && next.locked ? (
          /* ---------- State 2: next locked ---------- */
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-charcoal-700/60 p-7 text-center ring-1 ring-cream/10 shadow-soft-lg sm:p-9">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mustard/15 ring-1 ring-mustard-300/30">
              <Lock className="h-6 w-6 text-mustard-300" />
            </span>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-cream sm:text-3xl">
                Keep the momentum going
              </h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-cream/65">
                Up next:{" "}
                <span className="text-cream/90">{next.title}</span>. Unlock the
                full course for lifetime access to every lesson.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href={overviewHref}
                className="inline-flex items-center gap-2 rounded-full bg-mustard-500 px-6 py-2.5 text-sm font-semibold text-charcoal-700 shadow-sm transition hover:bg-mustard-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-300 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-700"
              >
                Unlock the full course
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={onReplay}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-cream/70 ring-1 ring-cream/15 transition hover:bg-cream/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400"
              >
                <RotateCcw className="h-4 w-4" />
                Replay
              </button>
            </div>
          </div>
        ) : (
          /* ---------- State 3: last lesson ---------- */
          <div className="flex flex-col items-center gap-5 rounded-3xl bg-charcoal-700/60 p-7 text-center ring-1 ring-cream/10 shadow-soft-lg sm:p-9">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <Check className="h-7 w-7 text-emerald-300" />
            </span>
            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-mustard-300">
                <Sparkles className="h-3.5 w-3.5" /> Course complete
              </p>
              <h3 className="font-serif text-2xl text-cream sm:text-3xl">
                You&rsquo;ve reached the end
              </h3>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-cream/65">
                That&rsquo;s a wrap on{" "}
                <span className="text-cream/90">{courseTitle}</span>. ¡Bien
                hecho!
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <a
                href={overviewHref}
                className="inline-flex items-center gap-2 rounded-full bg-mustard-500 px-6 py-2.5 text-sm font-semibold text-charcoal-700 shadow-sm transition hover:bg-mustard-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-300 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-700"
              >
                Back to course
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={onReplay}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-cream/70 ring-1 ring-cream/15 transition hover:bg-cream/10 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard-400"
              >
                <RotateCcw className="h-4 w-4" />
                Replay lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Circular SVG progress ring wrapping a play glyph + the seconds remaining. */
function CountdownRing({
  progress,
  seconds,
}: {
  progress: number;
  seconds: number | null;
}) {
  const size = 56;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <span className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="rgba(28,25,23,0.55)"
          stroke="rgba(255,251,235,0.2)"
          strokeWidth={stroke}
        />
        {seconds !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#E8A84C"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * progress}
          />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        {seconds !== null ? (
          <span className="font-serif text-lg leading-none text-cream tabular-nums">
            {seconds}
          </span>
        ) : (
          <Play className="h-5 w-5 fill-cream text-cream" />
        )}
      </span>
    </span>
  );
}
