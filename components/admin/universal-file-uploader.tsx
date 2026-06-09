"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ImageIcon,
  Video,
  File,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Zap,
  ArrowRight,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── chunking constants (mirror of lib/supabase/chunked.ts — kept in sync) ──────
// Supabase Free tier caps a single stored object at 50 MB. Files larger than
// SINGLE_OBJECT_MAX (after optional compression) are split into ≤ CHUNK_SIZE
// parts + a manifest, then transparently reassembled on download.
const CHUNK_SIZE = 45 * 1024 * 1024; // 45 MB
const SINGLE_OBJECT_MAX = CHUNK_SIZE;
// Above this, skip in-browser PDF compression (pdf-lib loads the whole doc into
// memory and the gain on big image-heavy PDFs is negligible — go straight to
// chunking the raw file instead).
const PDF_COMPRESS_MAX = 80 * 1024 * 1024; // 80 MB

// ── helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type FileKind = "pdf" | "image" | "video" | "other";

function getKind(file: File): FileKind {
  const t = file.type;
  if (t === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (t.startsWith("image/")) return "image";
  if (t.startsWith("video/")) return "video";
  return "other";
}

function KindIcon({ kind, className }: { kind: FileKind; className?: string }) {
  const map = { pdf: FileText, image: ImageIcon, video: Video, other: File };
  const Icon = map[kind];
  return <Icon className={className} />;
}

async function compressPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const bytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(file); return; }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        outType,
        outType === "image/jpeg" ? 0.82 : undefined,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/** PUT a blob to a Supabase signed upload URL with progress + real error text. */
function putWithProgress(
  url: string,
  blob: Blob,
  contentType: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        let msg = `HTTP ${xhr.status}`;
        try {
          const body = JSON.parse(xhr.responseText) as Record<string, string>;
          msg = body.message ?? body.error ?? msg;
        } catch {
          /* keep default */
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red"));
    xhr.send(blob);
  });
}

// ── types ─────────────────────────────────────────────────────────────────────

type Step = "idle" | "reading" | "compressing" | "uploading" | "done" | "error";

const STEP_LIST = [
  { key: "reading" as const, label: "Leyendo" },
  { key: "compressing" as const, label: "Optimizando" },
  { key: "uploading" as const, label: "Subiendo" },
] as const;

interface Stats {
  original: number;
  compressed: number;
}

interface SignSingle {
  mode?: "single";
  signedUrl: string;
  path: string;
  publicUrl: string;
}
interface SignChunked {
  mode: "chunked";
  manifestPath: string;
  manifest: { path: string; signedUrl: string };
  parts: { index: number; path: string; signedUrl: string }[];
}

export interface UniversalFileUploaderProps {
  bucket: "digital-products" | "course-resources";
  label?: string;
  hint?: string;
  /** Native input accept string, e.g. "application/pdf,video/*" or "*\/*" */
  accept?: string;
  currentName?: string | null;
  onUploaded: (info: {
    path: string;
    publicUrl: string;
    fileName: string;
    sizeBytes: number;
  }) => void;
  onClear?: () => void;
}

// ── component ─────────────────────────────────────────────────────────────────

export function UniversalFileUploader({
  bucket,
  label,
  hint,
  accept = "*/*",
  currentName,
  onUploaded,
  onClear,
}: UniversalFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // If there is already an uploaded file (edit mode), start in "done" so the
  // card renders immediately without waiting for a new upload.
  const [step, setStep] = useState<Step>(() => (currentName ? "done" : "idle"));
  const [uploadPct, setUploadPct] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [doneName, setDoneName] = useState<string | null>(currentName ?? null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [kind, setKind] = useState<FileKind>("other");
  // Multi-part upload progress: { current, total } while chunking, else null.
  const [partInfo, setPartInfo] = useState<{ current: number; total: number } | null>(null);
  // Number of parts the finished upload was split into (0 = single object).
  const [totalParts, setTotalParts] = useState(0);

  const processingIdx = STEP_LIST.findIndex((s) => s.key === step);

  const barPct =
    step === "reading"
      ? 18
      : step === "compressing"
      ? 52
      : step === "uploading"
      ? 52 + uploadPct * 0.48
      : step === "done"
      ? 100
      : 0;

  // ── single-object upload ─────────────────────────────────────────────────────
  const uploadSingle = async (
    filename: string,
    contentType: string,
    blob: Blob,
  ): Promise<string> => {
    const signRes = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, filename, contentType }),
    });
    if (!signRes.ok) {
      const err = (await signRes.json().catch(() => ({}))) as Record<string, string>;
      throw new Error(err.message ?? err.error ?? `HTTP ${signRes.status}`);
    }
    const sign = (await signRes.json()) as SignSingle;
    await putWithProgress(sign.signedUrl, blob, contentType, setUploadPct);
    return sign.path;
  };

  // ── chunked upload: split → upload each part → write manifest ─────────────────
  const uploadChunked = async (
    filename: string,
    contentType: string,
    blob: Blob,
  ): Promise<string> => {
    const partCount = Math.ceil(blob.size / CHUNK_SIZE);
    setTotalParts(partCount);

    const signRes = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, filename, contentType, parts: partCount }),
    });
    if (!signRes.ok) {
      const err = (await signRes.json().catch(() => ({}))) as Record<string, string>;
      throw new Error(err.message ?? err.error ?? `HTTP ${signRes.status}`);
    }
    const sign = (await signRes.json()) as SignChunked;

    let uploadedBytes = 0;
    for (let i = 0; i < partCount; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, blob.size);
      const slice = blob.slice(start, end); // zero-copy view, memory-safe
      setPartInfo({ current: i + 1, total: partCount });

      await putWithProgress(
        sign.parts[i].signedUrl,
        slice,
        "application/octet-stream",
        (pct) => {
          const partBytes = (pct / 100) * slice.size;
          setUploadPct(((uploadedBytes + partBytes) / blob.size) * 100);
        },
      );
      uploadedBytes += slice.size;
      setUploadPct((uploadedBytes / blob.size) * 100);
    }

    // Write the manifest last — its presence means the upload is complete.
    const manifest = {
      v: 1 as const,
      originalName: filename,
      contentType,
      totalSize: blob.size,
      parts: sign.parts.map((p) => p.path),
    };
    const manifestBlob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    await putWithProgress(sign.manifest.signedUrl, manifestBlob, "application/json", () => {});

    return sign.manifest.path;
  };

  const run = async (file: File) => {
    const fileKind = getKind(file);
    setKind(fileKind);
    setErrorMsg(null);
    setUploadPct(0);
    setStats(null);
    setPartInfo(null);
    setTotalParts(0);

    try {
      // ── 1. Read ───────────────────────────────────────────────────────────
      setStep("reading");
      const originalSize = file.size;

      // ── 2. Compress (PDF + image only) ────────────────────────────────────
      setStep("compressing");
      let blob: Blob = file;
      let contentType = file.type || "application/octet-stream";

      if (fileKind === "pdf") {
        contentType = "application/pdf";
        if (file.size <= PDF_COMPRESS_MAX) {
          try {
            blob = await compressPdf(file);
          } catch {
            blob = file; // encrypted/malformed → upload as-is
          }
        }
      } else if (fileKind === "image") {
        try {
          blob = await compressImage(file);
          contentType =
            blob.type || (file.type === "image/png" ? "image/png" : "image/jpeg");
        } catch {
          blob = file;
        }
      }
      // video / other → no client-side compression

      setStats({ original: originalSize, compressed: blob.size });

      // ── 3. Upload — single object or chunked depending on final size ──────
      setStep("uploading");
      const storedPath =
        blob.size <= SINGLE_OBJECT_MAX
          ? await uploadSingle(file.name, contentType, blob)
          : await uploadChunked(file.name, contentType, blob);

      // ── 4. Done ───────────────────────────────────────────────────────────
      setDoneName(file.name);
      setStep("done");
      onUploaded({
        path: storedPath,
        publicUrl: "",
        fileName: file.name,
        sizeBytes: blob.size,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setErrorMsg(message);
      setStep("error");
      toast.error(message);
    }
  };

  const pick = () => inputRef.current?.click();

  const clear = () => {
    setStep("idle");
    setStats(null);
    setDoneName(null);
    setErrorMsg(null);
    setPartInfo(null);
    setTotalParts(0);
    onClear?.();
  };

  const isSizeLimitError =
    errorMsg?.toLowerCase().includes("maximum") ||
    errorMsg?.toLowerCase().includes("size") ||
    errorMsg?.toLowerCase().includes("too large");

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
          if (f) run(f);
          e.target.value = "";
        }}
      />

      <AnimatePresence mode="wait">
        {/* ───────────────────── IDLE ─────────────────────────────────────── */}
        {step === "idle" && (
          <motion.button
            key="idle"
            type="button"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={pick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) run(f);
            }}
            className={cn(
              "group flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-dashed bg-cream-50 px-6 py-10 text-center transition-all duration-200",
              isDragging
                ? "border-mustard bg-mustard/5 scale-[1.015]"
                : "border-charcoal-200 hover:border-mustard hover:bg-mustard/5",
            )}
          >
            <motion.span
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mustard/20 via-mustard/10 to-terracotta/15"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <File className="h-8 w-8 text-mustard-600" />
            </motion.span>

            <div className="space-y-1">
              <p className="text-sm font-bold text-charcoal-700">
                {hint ?? "Subir archivo"}
              </p>
              <p className="text-xs text-charcoal-400">
                Arrastrá o hacé click para seleccionar
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-mustard/30 bg-mustard/10 px-3 py-1 text-[11px] font-semibold text-mustard-700 transition-colors group-hover:border-mustard/50 group-hover:bg-mustard/15">
              <Zap className="h-3 w-3" />
              Cualquier tamaño · compresión y troceado automático
            </span>
          </motion.button>
        )}

        {/* ─────────────────── PROCESSING ─────────────────────────────────── */}
        {(step === "reading" ||
          step === "compressing" ||
          step === "uploading") && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden rounded-2xl border border-charcoal-100/80 bg-white shadow-sm"
          >
            {/* Step tabs */}
            <div className="flex border-b border-charcoal-100/60">
              {STEP_LIST.map((s, i) => {
                const done = i < processingIdx;
                const active = i === processingIdx;
                return (
                  <div
                    key={s.key}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-300",
                      active
                        ? "bg-mustard/8 text-mustard-700"
                        : done
                        ? "text-emerald-600"
                        : "text-charcoal-300",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                        active
                          ? "bg-mustard text-white"
                          : done
                          ? "bg-emerald-500 text-white"
                          : "bg-charcoal-100 text-charcoal-400",
                      )}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 px-5 py-4">
              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-charcoal-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-mustard via-mustard to-terracotta"
                  initial={{ width: "0%" }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>

              {/* Status text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-medium text-charcoal-500"
                >
                  {step === "reading" && "Leyendo el archivo…"}
                  {step === "compressing" &&
                    (kind === "pdf"
                      ? "Optimizando estructura y streams del PDF…"
                      : kind === "image"
                      ? "Comprimiendo imagen…"
                      : "Preparando archivo…")}
                  {step === "uploading" &&
                    (partInfo
                      ? `Subiendo parte ${partInfo.current} de ${partInfo.total} · ${uploadPct.toFixed(0)}%`
                      : `Subiendo a almacenamiento… ${uploadPct.toFixed(0)}%`)}
                </motion.p>
              </AnimatePresence>

              {/* Chunked badge */}
              <AnimatePresence>
                {partInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-600">
                      <Layers className="h-3 w-3" />
                      Archivo grande · troceado en {partInfo.total} partes
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

        {/* ───────────────────── DONE ─────────────────────────────────────── */}
        {step === "done" && doneName && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, type: "spring", stiffness: 280, damping: 28 }}
            className="overflow-hidden rounded-2xl border border-charcoal-100/60 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-charcoal-100/60 bg-emerald-50/70 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <KindIcon kind={kind} className="h-3.5 w-3.5 shrink-0 text-charcoal-400" />
                <p className="min-w-0 truncate text-sm font-semibold text-charcoal-700">
                  {doneName}
                </p>
              </div>
              <button
                onClick={clear}
                className="rounded-lg p-1.5 text-charcoal-300 transition-colors hover:bg-charcoal-100 hover:text-destructive"
                aria-label="Quitar archivo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body — compression stats appear only on a fresh upload */}
            {stats ? (
              <div className="space-y-2.5 px-4 py-3">
                {/* Compression stats (only when there was actual compression) */}
                {stats.compressed < stats.original ? (
                  <div>
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal-400">
                      Resultado de compresión
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex flex-col rounded-xl border border-charcoal-100 bg-charcoal-50 px-3 py-2">
                        <span className="text-[10px] font-medium text-charcoal-400">
                          Original
                        </span>
                        <span className="text-sm font-bold text-charcoal-400 line-through">
                          {formatBytes(stats.original)}
                        </span>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-charcoal-300" />

                      <div className="flex flex-col rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                        <span className="text-[10px] font-medium text-emerald-600">
                          Comprimido
                        </span>
                        <span className="text-sm font-bold text-emerald-700">
                          {formatBytes(stats.compressed)}
                        </span>
                      </div>

                      <motion.div
                        initial={{ scale: 0, rotate: -8 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.12,
                          type: "spring",
                          stiffness: 380,
                          damping: 22,
                        }}
                        className="flex flex-col items-center rounded-xl bg-gradient-to-br from-mustard/20 to-terracotta/20 px-3 py-2"
                      >
                        <span className="text-[10px] font-medium text-mustard-700">
                          Ahorro
                        </span>
                        <span className="text-sm font-bold text-mustard-700">
                          ↓{" "}
                          {Math.round(
                            (1 - stats.compressed / stats.original) * 100,
                          )}
                          %
                        </span>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-charcoal-400">
                    {formatBytes(stats.compressed)} · Subido correctamente
                  </p>
                )}

                {/* Chunked note — reassures that the file is whole on download */}
                {totalParts > 1 && (
                  <div className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-2">
                    <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                    <p className="text-[11px] leading-relaxed text-sky-700">
                      Archivo grande subido en{" "}
                      <span className="font-bold">{totalParts} partes</span>. Se
                      re-ensambla automáticamente en la descarga — el alumno baja un
                      único archivo intacto.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button size="sm" variant="soft" onClick={pick} className="h-7 text-xs">
                    <RotateCcw className="h-3 w-3" /> Cambiar
                  </Button>
                </div>
              </div>
            ) : (
              /* Pre-existing file (page loaded in edit mode) — show a minimal footer */
              <div className="flex items-center justify-between px-4 py-2.5">
                <p className="text-xs text-charcoal-400">Archivo guardado · listo para descarga</p>
                <Button size="sm" variant="soft" onClick={pick} className="h-7 text-xs">
                  <RotateCcw className="h-3 w-3" /> Cambiar
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* ───────────────────── ERROR ────────────────────────────────────── */}
        {step === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-destructive">
                  Error al subir
                </p>
                {errorMsg && (
                  <p className="mt-0.5 text-xs text-destructive/70">{errorMsg}</p>
                )}
                {isSizeLimitError && (
                  <p className="mt-2 text-xs text-charcoal-500 leading-relaxed">
                    Si esto persiste con un archivo muy grande, reintentá — el
                    sistema lo trocea automáticamente para sortear el límite de
                    Supabase.
                  </p>
                )}
              </div>
              <Button size="sm" variant="soft" onClick={pick}>
                Reintentar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
