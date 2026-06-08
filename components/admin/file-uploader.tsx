"use client";

/**
 * Generic Supabase Storage uploader. Used for cover images, ebook files,
 * resources. Goes through /api/admin/upload to get a signed PUT URL, then
 * uploads via tus-js-client (which Supabase Storage v3 supports for large
 * files) — but for typical small images/PDFs a direct PUT is simpler.
 *
 * Props:
 *   bucket — must be one of the allowlisted buckets in /api/admin/upload
 *   accept — MIME filter for the <input>
 *   maxBytes — client-side guard
 *   onUploaded(path, publicUrl) — store path in your DB row
 *
 * Visual:
 *   - For images: shows the uploaded thumbnail.
 *   - For other files: shows filename + size + remove button.
 */

import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  X,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  bucket: "covers" | "digital-products" | "course-resources";
  accept: string;
  maxBytes?: number;
  currentUrl?: string | null;
  currentName?: string | null;
  variant?: "image" | "file";
  label?: string;
  hint?: string;
  onUploaded: (info: {
    path: string;
    publicUrl: string;
    fileName: string;
    sizeBytes: number;
  }) => void;
  onClear?: () => void;
}

export function FileUploader({
  bucket,
  accept,
  maxBytes = 200 * 1024 * 1024,
  currentUrl,
  currentName,
  variant = "file",
  label,
  hint,
  onUploaded,
  onClear,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const [previewName, setPreviewName] = useState<string | null>(
    currentName ?? null,
  );

  // Sync preview state when the parent updates the prop (e.g. after a save/refetch).
  useEffect(() => {
    setPreviewUrl(currentUrl ?? null);
  }, [currentUrl]);

  useEffect(() => {
    setPreviewName(currentName ?? null);
  }, [currentName]);

  const pick = () => inputRef.current?.click();

  const upload = async (file: File) => {
    if (file.size > maxBytes) {
      toast.error(`Demasiado grande (máx ${(maxBytes / 1024 / 1024).toFixed(0)} MB)`);
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const signRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket,
          filename: file.name,
          contentType: file.type,
        }),
      });
      if (!signRes.ok) {
        const errData = await signRes.json().catch(() => ({})) as Record<string, string>;
        throw new Error(errData.message ?? errData.error ?? `HTTP ${signRes.status}`);
      }
      const sign = await signRes.json();

      // Direct PUT to the signed URL — Supabase Storage supports this for any
      // size up to bucket limits. We use XHR so we get progress events.
      // x-upsert must match the token's upsert setting or Supabase returns 400.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", sign.signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.setRequestHeader("x-upsert", "true");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            let message = `HTTP ${xhr.status}`;
            try {
              const body = JSON.parse(xhr.responseText) as Record<string, string>;
              message = body.message ?? body.error ?? message;
            } catch { /* keep default */ }
            reject(new Error(message));
          }
        };
        xhr.onerror = () => reject(new Error("Error de red"));
        xhr.send(file);
      });

      setPreviewUrl(sign.publicUrl);
      setPreviewName(file.name);
      onUploaded({
        path: sign.path,
        publicUrl: sign.publicUrl,
        fileName: file.name,
        sizeBytes: file.size,
      });
      toast.success("Subido");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const clear = () => {
    setPreviewUrl(null);
    setPreviewName(null);
    onClear?.();
  };

  const hasContent = Boolean(previewUrl);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-charcoal-600">{label}</label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />

      {hasContent && !busy && variant === "image" && (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-xl border border-charcoal-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl!}
              alt={previewName ?? "portada"}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal-700/55 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={pick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal-700 shadow-sm hover:bg-white"
              >
                <Upload className="h-3 w-3" /><span>Cambiar</span>
              </button>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-destructive shadow-sm hover:bg-white"
              >
                <X className="h-3 w-3" /><span>Quitar</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={pick}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-charcoal-100 bg-cream-50 py-2 text-xs font-medium text-charcoal-500 transition-colors hover:bg-charcoal-100/50 hover:text-charcoal-600"
          >
            <Upload className="h-3 w-3" />
            <span>Cambiar imagen</span>
          </button>
        </div>
      )}

      {hasContent && !busy && variant !== "image" && (
        <div className="flex items-start gap-3 rounded-2xl border border-charcoal-100/60 bg-cream-50 p-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mustard/15 text-mustard-600">
            <FileText className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /><span>Subido</span>
            </p>
            <p className="mt-0.5 truncate text-sm text-charcoal-600">
              {previewName ?? previewUrl}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <Button size="sm" variant="soft" onClick={pick}>
              Cambiar
            </Button>
            <button
              onClick={clear}
              className="text-[11px] text-charcoal-400 hover:text-destructive"
            >
              <X className="h-3 w-3 inline" /><span>Quitar</span>
            </button>
          </div>
        </div>
      )}

      {busy && (
        <div className="rounded-2xl border border-charcoal-100/60 bg-cream-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-charcoal-600">
            <Loader2 className="h-4 w-4 animate-spin text-mustard-600" /><span>Subiendo… {progress.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-charcoal-100">
            <div
              className="h-full rounded-full bg-mustard transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!hasContent && !busy && (
        <button
          type="button"
          onClick={pick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) upload(f);
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-charcoal-200 bg-cream-50 px-4 py-5 text-sm text-charcoal-400 transition-colors",
            "hover:border-mustard hover:bg-mustard/5 hover:text-mustard-600",
          )}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-mustard/15 text-mustard-600">
            {variant === "image" ? (
              <ImageIcon className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </span>
          <span className="text-left flex-1">
            <span className="block font-semibold text-charcoal-600">
              {label ?? "Subir archivo"}
            </span>
            <span className="text-xs text-charcoal-400">
              {hint ??
                (variant === "image"
                  ? "JPG, PNG o WebP. 1280×720 ideal."
                  : "Arrastrá o hacé click.")}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
