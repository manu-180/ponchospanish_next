"use client";

/**
 * UpChunk-based resumable uploader for Mux Direct Uploads.
 *
 * Flow:
 *  1. POST /api/mux/direct-upload?lessonId=… → returns { uploadId, uploadUrl }
 *  2. UpChunk PUTs the file in chunks with progress
 *  3. Once upload completes, Mux processes the video (status: processing)
 *  4. Our webhook flips lesson.mux_status to `ready` and sets playback IDs
 *
 * The component polls /api/admin/lessons-status/[id] every 4s while the
 * lesson is `processing` so the UI catches up without a page reload.
 *
 * Why UpChunk (not tus-js-client): Mux's TUS endpoint CORS preflight does
 * not allow the `Tus-Resumable` header, so browser HEAD/PATCH from a
 * different origin gets blocked. UpChunk uses plain PUT with Content-Range,
 * which CORS handles natively.
 */

import { useEffect, useRef, useState } from "react";
import * as UpChunk from "@mux/upchunk";
import {
  CheckCircle2,
  Loader2,
  Upload as UploadIcon,
  AlertTriangle,
  Video,
  X,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MuxStatus = "idle" | "uploading" | "processing" | "ready" | "errored";

interface MuxUploaderProps {
  lessonId: string;
  initialStatus: MuxStatus;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  onChange?: () => void;
}

export function MuxUploader({
  lessonId,
  initialStatus,
  thumbnailUrl,
  durationSeconds,
  onChange,
}: MuxUploaderProps) {
  const [status, setStatus] = useState<MuxStatus>(initialStatus);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(thumbnailUrl ?? null);
  const [duration, setDuration] = useState<number | null>(durationSeconds ?? null);
  const uploadRef = useRef<UpChunk.UpChunk | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Poll while processing
  useEffect(() => {
    if (status !== "processing") return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/admin/lessons-status/${lessonId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          status: MuxStatus;
          thumbnailUrl?: string | null;
          durationSeconds?: number | null;
        };
        if (cancelled) return;
        if (data.status !== status) {
          setStatus(data.status);
          if (data.status === "ready") {
            setThumb(data.thumbnailUrl ?? null);
            setDuration(data.durationSeconds ?? null);
            toast.success("Video listo");
            onChange?.();
          }
          if (data.status === "errored") {
            setError("Mux no pudo procesar el video. Intentá subir otro archivo.");
          }
        }
      } catch {
        /* swallow — next tick will retry */
      }
    };
    const interval = setInterval(tick, 4000);
    tick();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, lessonId, onChange]);

  const startUpload = async (file: File) => {
    setError(null);

    if (!file.type.startsWith("video/")) {
      toast.error("El archivo no parece un video.");
      return;
    }
    // 5 GB ceiling — Mux supports much more but keep sane
    if (file.size > 5 * 1024 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande (máx 5 GB).");
      return;
    }

    setStatus("uploading");
    setProgress(0);

    let uploadUrl: string;
    try {
      const res = await fetch("/api/mux/direct-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "No pudimos preparar la subida");
      }
      uploadUrl = data.uploadUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStatus("idle");
      return;
    }

    const upload = UpChunk.createUpload({
      endpoint: uploadUrl,
      file,
      chunkSize: 30720, // KB → 30 MB per chunk
      attempts: 5,
      delayBeforeAttempt: 1,
    });

    upload.on("error", (event) => {
      const message =
        (event as CustomEvent<{ message?: string }>).detail?.message ??
        "Error al subir";
      setError(message);
      setStatus("idle");
      uploadRef.current = null;
    });

    upload.on("progress", (event) => {
      const percent = (event as CustomEvent<number>).detail;
      setProgress(percent);
    });

    upload.on("success", () => {
      uploadRef.current = null;
      setProgress(100);
      setStatus("processing");
      toast.success("Subida completa. Mux está procesando el video…");
      onChange?.();
    });

    uploadRef.current = upload;
  };

  const cancel = () => {
    if (!uploadRef.current) return;
    uploadRef.current.abort();
    uploadRef.current = null;
    setStatus("idle");
    setProgress(0);
  };

  const pickFile = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) startUpload(f);
    e.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-charcoal-100/60 bg-cream-50 p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        onChange={onFileChange}
      />

      {status === "ready" && thumb && (
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-charcoal-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt="thumbnail"
              className="h-full w-full object-cover"
            />
            <span className="absolute right-1 bottom-1 rounded bg-charcoal-700/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {duration ? formatDuration(duration) : "—"}
            </span>
          </div>
          <div className="flex-1">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /><span>Video listo</span>
            </p>
            <p className="mt-1 text-xs text-charcoal-400">
              Generá y editá los subtítulos en el panel de abajo.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={pickFile}>
            <RotateCcw className="h-3.5 w-3.5" /><span>Reemplazar</span>
          </Button>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-mustard-600" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-charcoal-600">
              Mux está procesando el video…
            </p>
            <p className="text-xs text-charcoal-400">
              Esto puede tardar entre 1 y 5 minutos según la duración. Podés
              seguir editando.
            </p>
          </div>
        </div>
      )}

      {status === "uploading" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-600">
              <Loader2 className="h-4 w-4 animate-spin text-mustard-600" />
              Subiendo… {progress.toFixed(0)}%
            </p>
            <button
              onClick={cancel}
              className="text-xs text-charcoal-400 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5 inline" /><span>Cancelar</span>
            </button>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mustard to-terracotta transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-charcoal-400">
            La subida es resumible: si se corta internet, retoma sola.
          </p>
        </div>
      )}

      {status === "idle" && (
        <button
          type="button"
          onClick={pickFile}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) startUpload(f);
          }}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-charcoal-200 bg-cream-50 px-4 py-8 text-sm text-charcoal-400 transition-colors",
            "hover:border-mustard hover:bg-mustard/5 hover:text-mustard-600",
          )}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mustard/15 text-mustard-600">
            <Video className="h-5 w-5" />
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-charcoal-600">
              Subir video de esta lección
            </span>
            <span className="text-xs text-charcoal-400">
              Arrastrá o hacé click. MP4, MOV, MKV… hasta 5 GB.
            </span>
          </span>
          <UploadIcon className="h-4 w-4 ml-auto" />
        </button>
      )}

      {status === "errored" && (
        <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-3 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="flex-1 text-sm">Mux no pudo procesar este video. Probá con otro archivo.</p>
          <Button size="sm" variant="soft" onClick={pickFile}>
            Subir otro
          </Button>
        </div>
      )}

      {error && status === "idle" && (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
