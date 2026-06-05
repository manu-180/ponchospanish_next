"use client";

/**
 * Renders the active subtitle cue on top of a video, styled by a preset.
 *
 * Must be placed inside a `position: relative` parent (the player wrapper).
 *
 * Modes:
 *  - Default (no props): passive overlay, no controls. Used in admin editor preview.
 *  - `showControls`: drag-to-reposition + continuous A−/A+ font control, always
 *    visible. Use only in the subtitle editor tool where precise positioning matters.
 *  - `showSizeControl`: three-level (S/M/L) font-size picker, no drag. Use in
 *    the student player so viewers can adjust readability without moving captions.
 *
 * Responsive sizing uses CSS container query units (`cqi`): the overlay is the
 * query container, so `fontScale * fontMultiplier * 100 cqi` = that fraction of
 * the player width.
 *
 * The bubble is split into an outer `div` (handles absolute positioning + drag)
 * and an inner `span` (display:inline + boxDecorationBreak:clone → per-line
 * backgrounds for the Netflix/Apple TV look).
 */

import {
  useMemo,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";
import { getCaptionPreset } from "@/lib/subtitles/presets";

export interface OverlayCue {
  start: number;
  end: number;
  text: string;
}

interface DragPos {
  x: number; // % of container width  (0–100)
  y: number; // % of container height (0–100)
}

interface DragStart {
  pointerX: number;
  pointerY: number;
  bubbleX: number;
  bubbleY: number;
}

// Three viewer-facing size levels mapped to fontMultiplier values
const SIZE_LEVELS = [
  { label: "A", multiplier: 0.75, title: "Pequeño" },
  { label: "A", multiplier: 1.0,  title: "Normal"  },
  { label: "A", multiplier: 1.4,  title: "Grande"  },
] as const;

interface Props {
  cues: OverlayCue[];
  currentTime: number;
  presetId: string;
  /** Force-hide (e.g. a "show captions" toggle that's off). */
  hidden?: boolean;
  className?: string;
  /**
   * Enable drag-to-reposition and continuous A−/A+ font controls (always visible).
   * Use only inside the subtitle editor tool.
   */
  showControls?: boolean;
  /**
   * Enable the S/M/L font-size picker without drag.
   * Use in the student player so viewers can adjust readability.
   */
  showSizeControl?: boolean;
}

export function CaptionOverlay({
  cues,
  currentTime,
  presetId,
  hidden,
  className,
  showControls = false,
  showSizeControl = false,
}: Props) {
  const preset = getCaptionPreset(presetId);

  const [fontMultiplier, setFontMultiplier] = useState(1.0);
  const [dragPos, setDragPos] = useState<DragPos | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<DragStart | null>(null);

  const active = useMemo(
    () =>
      cues.find((c) => currentTime >= c.start && currentTime < c.end) ?? null,
    [cues, currentTime],
  );

  // Default resting position (before any drag)
  const defaultPos: DragPos =
    preset.position === "bottom" ? { x: 50, y: 85 } : { x: 50, y: 15 };
  const pos = dragPos ?? defaultPos;

  // ── drag handlers ─────────────────────────────────────────────────────────

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!showControls) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        bubbleX: pos.x,
        bubbleY: pos.y,
      };
    },
    [showControls, pos],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx =
        ((e.clientX - dragStartRef.current.pointerX) / rect.width) * 100;
      const dy =
        ((e.clientY - dragStartRef.current.pointerY) / rect.height) * 100;
      setDragPos({
        x: Math.max(8, Math.min(92, dragStartRef.current.bubbleX + dx)),
        y: Math.max(8, Math.min(88, dragStartRef.current.bubbleY + dy)),
      });
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const resetPosition = useCallback(() => {
    if (showControls) setDragPos(null);
  }, [showControls]);

  // ── font-size handlers ─────────────────────────────────────────────────────

  const decreaseFont = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFontMultiplier((m) => Math.max(0.5, parseFloat((m - 0.15).toFixed(2))));
  }, []);

  const increaseFont = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFontMultiplier((m) => Math.min(2.2, parseFloat((m + 0.15).toFixed(2))));
  }, []);

  // ── early exits ───────────────────────────────────────────────────────────

  if (hidden) return null;
  const hasAnyControl = showControls || showSizeControl;
  if (!hasAnyControl && (!active || !active.text.trim())) return null;

  // Map fontMultiplier (0.5–2.2) → 5 dots (0–4 filled)
  const dotsFilled = Math.round(((fontMultiplier - 0.5) / (2.2 - 0.5)) * 4);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
      style={{ containerType: "inline-size" }}
    >
      {/* ── Editor font-size control (continuous A−/A+ with level dots) ── */}
      {showControls && (
        <div
          className="absolute top-3 right-3 flex items-center rounded-full"
          style={{
            pointerEvents: "auto",
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "3px 4px",
            gap: 2,
          }}
        >
          <button
            onClick={decreaseFont}
            disabled={fontMultiplier <= 0.5}
            title="Texto más pequeño"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/15 hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <span
              aria-hidden
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                userSelect: "none",
              }}
            >
              A−
            </span>
          </button>

          <div className="flex items-center gap-[3px] px-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-150"
                style={{
                  width: i === 2 ? 5 : 3,
                  height: i === 2 ? 5 : 3,
                  background:
                    i <= dotsFilled
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.22)",
                }}
              />
            ))}
          </div>

          <button
            onClick={increaseFont}
            disabled={fontMultiplier >= 2.2}
            title="Texto más grande"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/15 hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-25"
          >
            <span
              aria-hidden
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                userSelect: "none",
              }}
            >
              A+
            </span>
          </button>
        </div>
      )}

      {/* ── Viewer font-size control (S / M / L preset levels) ── */}
      {!showControls && showSizeControl && (
        <div
          className="absolute top-3 right-3 flex items-center rounded-full"
          style={{
            pointerEvents: "auto",
            background: "rgba(0,0,0,0.48)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            padding: "4px 6px",
            gap: 0,
          }}
        >
          {SIZE_LEVELS.map(({ label, multiplier, title }, i) => {
            const isActive = fontMultiplier === multiplier;
            return (
              <button
                key={multiplier}
                onClick={(e) => {
                  e.stopPropagation();
                  setFontMultiplier(multiplier);
                }}
                title={title}
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: [10, 13, 17][i],
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: isActive
                    ? "rgba(255,255,255,1)"
                    : "rgba(255,255,255,0.35)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 5px",
                  userSelect: "none",
                  transition: "color 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Subtitle bubble ── */}
      {active && active.text.trim() && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={resetPosition}
          style={{
            position: "absolute",
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: "translate(-50%, -50%)",
            maxWidth: "88%",
            textAlign: "center",
            pointerEvents: showControls ? "auto" : "none",
            cursor: showControls
              ? isDragging
                ? "grabbing"
                : "grab"
              : "default",
            touchAction: "none",
            userSelect: "none",
            transition: isDragging ? "none" : "top 0.08s ease, left 0.08s ease",
          }}
        >
          <span
            style={
              {
                ...preset.bubble,
                fontSize: `${preset.fontScale * fontMultiplier * 100}cqi`,
                lineHeight: preset.bubble.lineHeight ?? 1.3,
                whiteSpace: "pre-line",
              } as CSSProperties
            }
          >
            {active.text}
          </span>
        </div>
      )}
    </div>
  );
}
