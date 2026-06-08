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
  { label: "A", multiplier: 0.85, title: "Pequeño" },
  { label: "A", multiplier: 1.0,  title: "Normal"  },
  { label: "A", multiplier: 1.18, title: "Grande"  },
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
  /**
   * Show a CC on/off toggle button alongside the size picker.
   * Use in the student player — keeps the pill visible even when captions are off.
   */
  showVisibilityToggle?: boolean;
  /** Called when the CC button is clicked. */
  onToggleVisible?: () => void;
}

export function CaptionOverlay({
  cues,
  currentTime,
  presetId,
  hidden,
  className,
  showControls = false,
  showSizeControl = false,
  showVisibilityToggle = false,
  onToggleVisible,
}: Props) {
  const preset = getCaptionPreset(presetId);

  const [fontMultiplier, setFontMultiplier] = useState(1.0);
  const [dragPos, setDragPos] = useState<DragPos | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleWidth, setBubbleWidth] = useState(72); // % of container width
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<DragStart | null>(null);
  const resizeStartRef = useRef<{ pointerX: number; startWidth: number; side: "left" | "right" } | null>(null);

  const active = useMemo(
    () =>
      cues.find((c) => currentTime >= c.start && currentTime < c.end) ?? null,
    [cues, currentTime],
  );

  // Default resting position — y:76 keeps the subtitle above the player's
  // controls bar (~bottom 15%), preventing overlap across all player skins.
  const defaultPos: DragPos =
    preset.position === "bottom" ? { x: 50, y: 76 } : { x: 50, y: 15 };
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
        // Max 78% — keeps subtitle above the Mux controls bar in editor too
        y: Math.max(8, Math.min(78, dragStartRef.current.bubbleY + dy)),
      });
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  const resetPosition = useCallback(() => {
    if (showControls) {
      setDragPos(null);
      setBubbleWidth(72);
    }
  }, [showControls]);

  // ── resize handlers ────────────────────────────────────────────────────────

  const handleResizeDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, side: "left" | "right") => {
      if (!showControls) return;
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsResizing(true);
      resizeStartRef.current = { pointerX: e.clientX, startWidth: bubbleWidth, side };
    },
    [showControls, bubbleWidth],
  );

  const handleResizeMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!resizeStartRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - resizeStartRef.current.pointerX) / rect.width) * 100;
      const sign = resizeStartRef.current.side === "right" ? 1 : -1;
      setBubbleWidth(Math.max(20, Math.min(96, resizeStartRef.current.startWidth + sign * dx * 2)));
    },
    [],
  );

  const handleResizeUp = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

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

  const hasAnyControl = showControls || showSizeControl || showVisibilityToggle;
  // When hidden we still render if there's a toggle button to show (so the user
  // can turn captions back on). Otherwise bail out entirely.
  if (hidden && !hasAnyControl) return null;
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

      {/* ── Viewer controls pill: [CC toggle] + [S / M / L] ── */}
      {!showControls && (showSizeControl || showVisibilityToggle) && (
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
          {/* CC toggle — always visible so users can re-enable captions */}
          {showVisibilityToggle && (
            <button
              aria-pressed={!hidden}
              aria-label={hidden ? "Activar subtítulos" : "Desactivar subtítulos"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisible?.();
              }}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
                lineHeight: 1,
                color: hidden
                  ? "rgba(255,255,255,0.28)"
                  : "rgba(255,255,255,0.95)",
                textDecoration: hidden ? "line-through" : "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
                userSelect: "none",
                transition: "color 0.2s",
              }}
            >
              CC
            </button>
          )}

          {/* Divider — only when both CC toggle and size control are present */}
          {showVisibilityToggle && showSizeControl && !hidden && (
            <div
              style={{
                width: 1,
                height: 14,
                background: "rgba(255,255,255,0.2)",
                margin: "0 1px",
                flexShrink: 0,
              }}
            />
          )}

          {/* S / M / L — hidden when captions are off */}
          {showSizeControl && !hidden && SIZE_LEVELS.map(({ label, multiplier, title }, i) => {
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
      {!hidden && active && active.text.trim() && (
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
            width: showControls ? `${bubbleWidth}%` : undefined,
            maxWidth: showControls ? undefined : "88%",
            textAlign: "center",
            pointerEvents: showControls ? "auto" : "none",
            cursor: showControls
              ? isResizing
                ? "ew-resize"
                : isDragging
                ? "grabbing"
                : "grab"
              : "default",
            touchAction: "none",
            userSelect: "none",
            transition: isDragging || isResizing ? "none" : "top 0.08s ease, left 0.08s ease",
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

          {/* Resize handles — editor only */}
          {showControls && (
            <>
              <div
                onPointerDown={(e) => handleResizeDown(e, "left")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeUp}
                onPointerCancel={handleResizeUp}
                style={{
                  position: "absolute",
                  left: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 32,
                  cursor: "ew-resize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "none",
                }}
              >
                <div style={{ width: 3, height: 20, borderRadius: 99, background: "rgba(255,255,255,0.65)" }} />
              </div>
              <div
                onPointerDown={(e) => handleResizeDown(e, "right")}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeUp}
                onPointerCancel={handleResizeUp}
                style={{
                  position: "absolute",
                  right: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 32,
                  cursor: "ew-resize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "none",
                }}
              >
                <div style={{ width: 3, height: 20, borderRadius: 99, background: "rgba(255,255,255,0.65)" }} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
