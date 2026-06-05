"use client";

/**
 * Two-pane subtitle editor (Descript / Happy Scribe style):
 *   left  → the video with a LIVE caption preview (the chosen design),
 *   right → the cue list, edited like a document.
 *
 * Editing model:
 *   - Cues are ordered by start time (so add/delete never needs renumbering).
 *   - Text edits update local state instantly (the preview reflects them live)
 *     and autosave on blur via PATCH .../cues/[cueId].
 *   - Clicking a cue's timecode seeks the video there.
 *   - Add line, delete, find & replace, and download VTT/SRT.
 *
 * Every persisted change re-renders the VTT server-side and marks the track
 * "edited" so the auto-pipeline won't overwrite Anto's work.
 */

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  Trash2,
  Play,
  Pause,
  Eye,
  EyeOff,
  X,
  Captions,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CaptionOverlay } from "@/components/subtitles/caption-overlay";
import { CaptionStylePicker } from "./caption-style-picker";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-charcoal-700 text-cream/40">
      <Captions className="h-8 w-8" />
    </div>
  ),
});

interface Cue {
  id: string;
  start_seconds: number;
  end_seconds: number;
  text: string;
}

interface Props {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonTitle: string;
  playbackId: string | null;
  playbackToken: string | null;
  durationSeconds: number | null;
  initialCues: Cue[];
  language: string;
  initialPreset: string;
}

// ---- timecode helpers ----
const pad = (n: number, l = 2) => String(n).padStart(l, "0");
function fmtUi(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const cs = Math.floor((s - Math.floor(s)) * 100);
  return `${m}:${pad(sec)}.${pad(cs)}`;
}
function fmtStamp(s: number, sep: "." | ","): string {
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}${sep}${pad(ms, 3)}`;
}
function buildVtt(cues: Cue[]): string {
  return (
    "WEBVTT\n\n" +
    cues
      .map(
        (c, i) =>
          `${i + 1}\n${fmtStamp(c.start_seconds, ".")} --> ${fmtStamp(c.end_seconds, ".")}\n${c.text.trim()}\n`,
      )
      .join("\n")
  );
}
function buildSrt(cues: Cue[]): string {
  return cues
    .map(
      (c, i) =>
        `${i + 1}\n${fmtStamp(c.start_seconds, ",")} --> ${fmtStamp(c.end_seconds, ",")}\n${c.text.trim()}\n`,
    )
    .join("\n");
}
function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
const sortCues = (arr: Cue[]) =>
  [...arr].sort((a, b) => a.start_seconds - b.start_seconds);
const safeName = (s: string) =>
  s.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "subtitulos";

// ---------------------------------------------------------------------------
// UNDO / REDO — snapshot-based history (max 50 entries)
// ---------------------------------------------------------------------------
function useHistory<T>(initial: T) {
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  void initial;

  function push(snapshot: T) {
    past.current = [...past.current.slice(-49), snapshot];
    future.current = [];
  }

  function undo(current: T): T | null {
    if (past.current.length === 0) return null;
    const prev = past.current[past.current.length - 1];
    past.current = past.current.slice(0, -1);
    future.current = [current, ...future.current.slice(0, 49)];
    return prev;
  }

  function redo(current: T): T | null {
    if (future.current.length === 0) return null;
    const next = future.current[0];
    future.current = future.current.slice(1);
    past.current = [...past.current, current];
    return next;
  }

  const canUndo = () => past.current.length > 0;
  const canRedo = () => future.current.length > 0;

  return { push, undo, redo, canUndo, canRedo };
}

export function SubtitleEditor({
  courseId,
  courseSlug,
  lessonId,
  lessonTitle,
  playbackId,
  playbackToken,
  durationSeconds,
  initialCues,
  language,
  initialPreset,
}: Props) {
  const [cues, setCues] = useState<Cue[]>(() => sortCues(initialCues));
  const history = useHistory<Cue[]>(initialCues);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [presetId, setPresetId] = useState(initialPreset);
  const [showReplace, setShowReplace] = useState(false);

  const playerRef = useRef<HTMLVideoElement | null>(null);
  // Baseline of last-saved text per cue → avoids redundant PATCH on blur.
  const savedText = useRef<Map<string, string>>(
    new Map(initialCues.map((c) => [c.id, c.text])),
  );

  const activeId = useMemo(() => {
    const hit = cues.find(
      (c) => currentTime >= c.start_seconds && currentTime < c.end_seconds,
    );
    return hit?.id ?? null;
  }, [cues, currentTime]);

  const overlayCues = useMemo(
    () =>
      cues.map((c) => ({
        start: c.start_seconds,
        end: c.end_seconds,
        text: c.text,
      })),
    [cues],
  );


  const seek = useCallback((t: number, play = true) => {
    const el = playerRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, t);
    if (play) void el.play?.();
  }, []);

  const togglePlay = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    if (el.paused) void el.play?.();
    else el.pause?.();
  }, []);

  // ---- persistence helpers ----
  const patchCue = useCallback(
    async (cueId: string, patch: Partial<Cue>) => {
      const res = await fetch(
        `/api/admin/lessons/${lessonId}/subtitles/cues/${cueId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      if (!res.ok) throw new Error("patch_failed");
      return (await res.json()) as Cue;
    },
    [lessonId],
  );

  // Live text edit (instant local update; the preview reflects it).
  const onChangeText = useCallback((id: string, text: string) => {
    setCues((arr) => arr.map((c) => (c.id === id ? { ...c, text } : c)));
  }, []);

  // Save on blur only if changed.
  const commitText = useCallback(
    async (id: string, text: string) => {
      if (savedText.current.get(id) === text) return;
      history.push(cues);
      try {
        await patchCue(id, { text });
        savedText.current.set(id, text);
      } catch {
        toast.error("No se pudo guardar el texto");
      }
    },
    [cues, patchCue],
  );

  const updateTiming = useCallback(
    async (id: string, patch: { start_seconds?: number; end_seconds?: number }) => {
      const prev = cues.find((c) => c.id === id);
      if (!prev) return;
      const next = { ...prev, ...patch };
      // guard: keep start < end with a 0.1s floor
      if (next.end_seconds <= next.start_seconds) {
        if (patch.start_seconds !== undefined)
          next.end_seconds = next.start_seconds + 0.5;
        else next.start_seconds = Math.max(0, next.end_seconds - 0.5);
      }
      history.push(cues);
      setCues((arr) => sortCues(arr.map((c) => (c.id === id ? next : c))));
      try {
        await patchCue(id, {
          start_seconds: next.start_seconds,
          end_seconds: next.end_seconds,
        });
      } catch {
        setCues((arr) => sortCues(arr.map((c) => (c.id === id ? prev : c))));
        toast.error("No se pudo guardar el tiempo");
      }
    },
    [cues, patchCue],
  );



  const addCue = useCallback(
    async (start: number) => {
      const end = start + 2;
      history.push(cues);
      // optimistic temp row
      const tmpId = `tmp-${Date.now()}`;
      const optimistic: Cue = {
        id: tmpId,
        start_seconds: start,
        end_seconds: end,
        text: "",
      };
      setCues((arr) => sortCues([...arr, optimistic]));
      try {
        const res = await fetch(
          `/api/admin/lessons/${lessonId}/subtitles/cues`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              start_seconds: start,
              end_seconds: end,
              text: "",
              language: language === "es" ? "es" : "en",
            }),
          },
        );
        if (!res.ok) throw new Error();
        const saved = (await res.json()) as Cue;
        savedText.current.set(saved.id, "");
        setCues((arr) => sortCues(arr.map((c) => (c.id === tmpId ? saved : c))));
      } catch {
        setCues((arr) => arr.filter((c) => c.id !== tmpId));
        toast.error("No se pudo agregar la línea");
      }
    },
    [cues, lessonId, language],
  );

  const deleteCue = useCallback(
    async (id: string) => {
      history.push(cues);
      const prev = cues;
      setCues((arr) => arr.filter((c) => c.id !== id));
      try {
        const res = await fetch(
          `/api/admin/lessons/${lessonId}/subtitles/cues/${id}`,
          { method: "DELETE" },
        );
        if (!res.ok) throw new Error();
        savedText.current.delete(id);
      } catch {
        setCues(prev);
        toast.error("No se pudo borrar la línea");
      }
    },
    [cues, lessonId],
  );


  const runReplace = useCallback(
    async (find: string, replace: string, caseSensitive: boolean) => {
      if (!find) return;
      const re = new RegExp(
        find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        caseSensitive ? "g" : "gi",
      );
      history.push(cues);
      const prev = cues;
      let count = 0;
      const next = cues.map((c) => {
        const t = c.text.replace(re, replace);
        if (t !== c.text) count += 1;
        return { ...c, text: t };
      });
      if (count === 0) {
        toast("No se encontró ese texto");
        return;
      }
      setCues(next);
      next.forEach((c) => savedText.current.set(c.id, c.text));
      try {
        const res = await fetch(
          `/api/admin/lessons/${lessonId}/subtitles/replace`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ find, replace, caseSensitive }),
          },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        toast.success(`Reemplazado en ${data.replaced ?? count} línea(s)`);
      } catch {
        setCues(prev);
        prev.forEach((c) => savedText.current.set(c.id, c.text));
        toast.error("No se pudo reemplazar");
      }
    },
    [cues, lessonId],
  );

  const syncSnapshot = useCallback(
    async (target: Cue[]) => {
      const current = cues;
      const fromMap = new Map(current.map((c) => [c.id, c]));
      const toMap = new Map(target.map((c) => [c.id, c]));

      const ops: Promise<unknown>[] = [];

      for (const [id] of fromMap) {
        if (!toMap.has(id)) {
          ops.push(
            fetch(`/api/admin/lessons/${lessonId}/subtitles/cues/${id}`, {
              method: "DELETE",
            }),
          );
        }
      }

      for (const [, c] of toMap) {
        if (!fromMap.has(c.id)) {
          ops.push(
            fetch(`/api/admin/lessons/${lessonId}/subtitles/cues`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                start_seconds: c.start_seconds,
                end_seconds: c.end_seconds,
                text: c.text,
                language: language === "es" ? "es" : "en",
              }),
            }),
          );
        }
      }

      for (const [id, to] of toMap) {
        const from = fromMap.get(id);
        if (
          from &&
          (from.text !== to.text ||
            from.start_seconds !== to.start_seconds ||
            from.end_seconds !== to.end_seconds)
        ) {
          ops.push(
            patchCue(id, {
              text: to.text,
              start_seconds: to.start_seconds,
              end_seconds: to.end_seconds,
            }),
          );
        }
      }

      await Promise.allSettled(ops);
    },
    [cues, lessonId, language, patchCue],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey;
      const isRedo =
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "z"));

      if (!isUndo && !isRedo) return;

      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      e.preventDefault();

      if (isUndo) {
        const prev = history.undo(cues);
        if (prev) {
          setCues(sortCues(prev));
          void syncSnapshot(prev).catch(() => toast.error("Error al deshacer"));
        }
      } else {
        const next = history.redo(cues);
        if (next) {
          setCues(sortCues(next));
          void syncSnapshot(next).catch(() => toast.error("Error al rehacer"));
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cues, history, syncSnapshot]);

  const canPlay = Boolean(playbackId && playbackToken);

  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-charcoal-100/60 bg-cream/85 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/admin/courses/${courseId}`}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-charcoal-400 hover:bg-charcoal-100/60 hover:text-charcoal-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /><span>Volver</span>
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mustard-600">
                Editor de subtítulos
              </p>
              <h1 className="truncate font-serif text-lg text-charcoal-700">
                {lessonTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showReplace ? "default" : "soft"}
              onClick={() => setShowReplace((v) => !v)}
            >
              <Search className="h-3.5 w-3.5" /><span>Buscar y reemplazar</span>
            </Button>
            <Button
              size="sm"
              variant="soft"
              onClick={() =>
                downloadFile(
                  `${safeName(lessonTitle)}.vtt`,
                  buildVtt(sortCues(cues)),
                  "text/vtt",
                )
              }
              title="Descargar .vtt"
            >
              <Download className="h-3.5 w-3.5" /><span>VTT</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                downloadFile(
                  `${safeName(lessonTitle)}.srt`,
                  buildSrt(sortCues(cues)),
                  "application/x-subrip",
                )
              }
              title="Descargar .srt"
            >
              SRT
            </Button>
          </div>
        </div>
        {showReplace && (
          <ReplaceBar
            onClose={() => setShowReplace(false)}
            onRun={runReplace}
          />
        )}
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* LEFT — player + design */}
        <aside className="border-b border-charcoal-100/60 p-4 md:p-6 lg:sticky lg:top-[61px] lg:h-[calc(100dvh-61px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal-900 ring-1 ring-charcoal-100/40 shadow-soft-lg">
            {canPlay ? (
              <>
                <MuxPlayer
                  ref={playerRef as never}
                  playbackId={playbackId as string}
                  tokens={{ playback: playbackToken as string }}
                  streamType="on-demand"
                  accentColor="#d97706"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onTimeUpdate={(e) =>
                    setCurrentTime((e.target as HTMLMediaElement).currentTime || 0)
                  }
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <CaptionOverlay
                  cues={overlayCues}
                  currentTime={currentTime}
                  presetId={presetId}
                  hidden={!showCaptions}
                  showControls
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-cream/50">
                Video no disponible
              </div>
            )}
          </div>

          {/* transport */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="soft" onClick={togglePlay} disabled={!canPlay}>
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPlaying ? "Pausar" : "Reproducir"}
            </Button>
            <span className="rounded-md bg-charcoal-100/60 px-2 py-1 font-mono text-xs tabular-nums text-charcoal-500">
              {fmtUi(currentTime)}
              {durationSeconds ? ` / ${fmtUi(durationSeconds)}` : ""}
            </span>
            <button
              onClick={() => setShowCaptions((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                showCaptions
                  ? "bg-mustard/15 text-mustard-600"
                  : "text-charcoal-400 hover:bg-charcoal-100/60",
              )}
              title="Mostrar u ocultar los subtítulos en el video"
            >
              {showCaptions ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
              Subtítulos
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-charcoal-100/60 bg-cream-50 p-4">
            <CaptionStylePicker
              courseId={courseId}
              value={presetId}
              onChange={setPresetId}
            />
          </div>
        </aside>

        {/* RIGHT — cue list */}
        <main className="p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs text-charcoal-400">
              {cues.length} línea{cues.length === 1 ? "" : "s"} · hacé click en el
              tiempo para saltar ahí
            </p>
            <Button size="sm" variant="soft" onClick={() => addCue(currentTime)}>
              <Plus className="h-3.5 w-3.5" /><span>Agregar línea acá</span>
            </Button>
          </div>

          {cues.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-charcoal-200 bg-cream-50 p-10 text-center">
              <p className="text-sm text-charcoal-400">
                No hay líneas todavía. Agregá la primera con el botón de arriba.
              </p>
            </div>
          ) : (
            <ol className="space-y-2">
              {sortCues(cues).map((c, i) => (
                <CueRow
                  key={c.id}
                  cue={c}
                  index={i}
                  isActive={c.id === activeId}
                  onSeek={() => seek(c.start_seconds)}
                  onChangeText={onChangeText}
                  onCommitText={commitText}
                  onDelete={() => deleteCue(c.id)}
                  onUpdateTiming={updateTiming}
                />
              ))}
            </ol>
          )}
          <div className="h-24" />
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CUE ROW (memoised — only re-renders when its own props change)
// ---------------------------------------------------------------------------

interface CueRowProps {
  cue: Cue;
  index: number;
  isActive: boolean;
  onSeek: () => void;
  onChangeText: (id: string, text: string) => void;
  onCommitText: (id: string, text: string) => void;
  onDelete: () => void;
  onUpdateTiming: (id: string, patch: { start_seconds?: number; end_seconds?: number }) => void;
}

const CueRow = memo(function CueRow({
  cue,
  index,
  isActive,
  onSeek,
  onChangeText,
  onCommitText,
  onDelete,
  onUpdateTiming,
}: CueRowProps) {
  return (
    <li
      id={`cue-${cue.id}`}
      className={cn(
        "group rounded-xl border bg-cream-50 p-3 transition-colors",
        isActive
          ? "border-mustard ring-2 ring-mustard/25"
          : "border-charcoal-100/60 hover:border-charcoal-200",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 w-6 shrink-0 text-right font-mono text-[10px] tabular-nums text-charcoal-300">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <textarea
            defaultValue={cue.text}
            rows={1}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
              onChangeText(cue.id, e.target.value);
            }}
            onBlur={(e) => onCommitText(cue.id, e.target.value)}
            placeholder="(línea vacía)"
            className="w-full resize-none rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm leading-relaxed text-charcoal-700 outline-none transition-colors focus:border-mustard/40 focus:bg-white"
          />

          {/* timing controls — visible on hover/focus or when active */}
          <div
            className={cn(
              "mt-1 flex flex-wrap items-center gap-1.5 transition-opacity",
              isActive
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <TimeInput
              value={cue.start_seconds}
              onSeek={onSeek}
              onChange={(s) => onUpdateTiming(cue.id, { start_seconds: s })}
            />
            <span className="text-charcoal-300">→</span>
            <TimeInput
              value={cue.end_seconds}
              onChange={(s) => onUpdateTiming(cue.id, { end_seconds: s })}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            onClick={onDelete}
            title="Borrar línea"
            className="rounded-md p-1.5 text-charcoal-300 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
});

// ---- TimeSeg: one editable segment (mm, ss, or cs) ----

const TimeSeg = forwardRef<
  HTMLInputElement,
  {
    value: number;
    max: number;
    digits: number;
    onArrow: (delta: number) => void;
    onUpdate: (v: number) => void;
    onCommit: () => void;
    onCancel: () => void;
    onAutoNext?: () => void;
  }
>(function TimeSeg(
  { value, max, digits, onArrow, onUpdate, onCommit, onCancel, onAutoNext },
  ref,
) {
  const [pending, setPending] = useState("");

  // When the value changes externally (e.g. arrow key on another segment), clear pending
  useEffect(() => {
    setPending("");
  }, [value]);

  const displayed = pending
    ? pending.padStart(digits, "0").slice(-digits)
    : String(value).padStart(digits, "0");

  function flush() {
    if (pending) {
      onUpdate(Math.max(0, Math.min(max, parseInt(pending, 10) || 0)));
      setPending("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setPending("");
      onArrow(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setPending("");
      onArrow(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      flush();
      onCommit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setPending("");
      onCancel();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setPending((p) => p.slice(0, -1));
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const next = (pending + e.key).slice(-digits);
      setPending(next);
      if (next.length >= digits) {
        onUpdate(Math.max(0, Math.min(max, parseInt(next, 10) || 0)));
        setPending("");
        onAutoNext?.();
      }
    } else if (e.key === "Tab") {
      flush();
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={displayed}
      readOnly
      onFocus={() => setPending("")}
      onBlur={flush}
      onKeyDown={handleKeyDown}
      className="bg-transparent text-center outline-none tabular-nums caret-transparent cursor-default text-charcoal-700 focus:text-mustard-700"
      style={{ width: `${digits}ch` }}
      aria-label="segmento de tiempo"
    />
  );
});

// ---- TimeInput: M:SS.cs segmented editor ----

function TimeInput({
  value,
  onSeek,
  onChange,
}: {
  value: number;
  onSeek?: () => void;
  onChange: (newSeconds: number) => void;
}) {
  const parse = (v: number) => ({
    m: Math.floor(v / 60),
    s: Math.floor(v % 60),
    cs: Math.round((v - Math.floor(v)) * 100),
  });
  const combine = (p: { m: number; s: number; cs: number }) =>
    Math.round(
      (Math.max(0, p.m) * 60 +
        Math.max(0, Math.min(59, p.s)) +
        Math.max(0, Math.min(99, p.cs)) / 100) *
        100,
    ) / 100;

  const [editing, setEditing] = useState(false);
  // draftRef keeps values synchronously accessible (avoids stale-closure bugs)
  const draftRef = useRef({ m: 0, s: 0, cs: 0 });
  const [draftDisplay, setDraftDisplay] = useState(() => parse(value));
  const containerRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLInputElement>(null);
  const csRef = useRef<HTMLInputElement>(null);

  // Sync from external value changes only when not in edit mode
  useEffect(() => {
    if (!editing) {
      const p = parse(value);
      draftRef.current = p;
      setDraftDisplay(p);
    }
  }, [value, editing]);

  function update(field: "m" | "s" | "cs", v: number) {
    draftRef.current = { ...draftRef.current, [field]: v };
    setDraftDisplay({ ...draftRef.current });
  }

  function applyArrow(field: "m" | "s" | "cs", delta: number, max: number) {
    update(field, Math.max(0, Math.min(max, draftRef.current[field] + delta)));
    const newVal = combine(draftRef.current);
    if (Math.abs(newVal - value) > 0.005) onChange(newVal);
  }

  function saveAndClose() {
    const newVal = combine(draftRef.current);
    if (Math.abs(newVal - value) > 0.005) onChange(newVal);
    setEditing(false);
  }

  function cancel() {
    const p = parse(value);
    draftRef.current = p;
    setDraftDisplay(p);
    setEditing(false);
  }

  // Commit when focus leaves the entire timecode widget
  function handleContainerBlur() {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        saveAndClose();
      }
    }, 0);
  }

  if (!editing) {
    return (
      <button
        onClick={() => {
          const p = parse(value);
          draftRef.current = p;
          setDraftDisplay(p);
          setEditing(true);
          onSeek?.();
        }}
        className="inline-flex items-center rounded-md bg-charcoal-100/50 px-2 py-0.5 font-mono text-[11px] tabular-nums text-charcoal-500 transition-colors hover:bg-mustard/15 hover:text-mustard-600 cursor-text"
        title="Click para editar · ↑↓ para ajustar · Tab entre segmentos"
      >
        {fmtUi(value)}
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="inline-flex items-center rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] tabular-nums ring-2 ring-mustard/50"
      onBlur={handleContainerBlur}
    >
      <TimeSeg
        value={draftDisplay.m}
        max={99}
        digits={2}
        onArrow={(d) => applyArrow("m", d, 99)}
        onUpdate={(v) => update("m", v)}
        onCommit={saveAndClose}
        onCancel={cancel}
        onAutoNext={() => secRef.current?.focus()}
      />
      <span className="select-none text-charcoal-300 leading-none">:</span>
      <TimeSeg
        ref={secRef}
        value={draftDisplay.s}
        max={59}
        digits={2}
        onArrow={(d) => applyArrow("s", d, 59)}
        onUpdate={(v) => update("s", v)}
        onCommit={saveAndClose}
        onCancel={cancel}
        onAutoNext={() => csRef.current?.focus()}
      />
      <span className="select-none text-charcoal-300 leading-none">.</span>
      <TimeSeg
        ref={csRef}
        value={draftDisplay.cs}
        max={99}
        digits={2}
        onArrow={(d) => applyArrow("cs", d, 99)}
        onUpdate={(v) => update("cs", v)}
        onCommit={saveAndClose}
        onCancel={cancel}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FIND & REPLACE BAR
// ---------------------------------------------------------------------------

function ReplaceBar({
  onClose,
  onRun,
}: {
  onClose: () => void;
  onRun: (find: string, replace: string, caseSensitive: boolean) => void;
}) {
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [cs, setCs] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-charcoal-100/60 bg-cream-50 px-4 py-2.5 md:px-6">
      <Input
        value={find}
        onChange={(e) => setFind(e.target.value)}
        placeholder="Buscar…"
        className="h-8 w-40"
      />
      <Input
        value={replace}
        onChange={(e) => setReplace(e.target.value)}
        placeholder="Reemplazar por…"
        className="h-8 w-40"
      />
      <label className="inline-flex items-center gap-1.5 text-xs text-charcoal-500">
        <input
          type="checkbox"
          checked={cs}
          onChange={(e) => setCs(e.target.checked)}
          className="h-3.5 w-3.5 accent-mustard"
        />
        May/min
      </label>
      <Button size="sm" onClick={() => onRun(find, replace, cs)} disabled={!find}>
        Reemplazar todo
      </Button>
      <button
        onClick={onClose}
        className="ml-auto rounded-md p-1.5 text-charcoal-300 hover:bg-charcoal-100 hover:text-charcoal-600"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
