"use client";

/**
 * Editable course "info" form. Auto-saves on blur via PATCH /api/admin/courses/[id].
 * Each field is independent so we save only what changed.
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, X, Check, ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/types/database";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"] as const;
const CURRENCIES = ["GBP", "USD", "EUR", "ARS"] as const;

export function CourseMetaForm({ course }: { course: Course }) {
  const [data, setData] = useState({
    title: course.title,
    subtitle: course.subtitle ?? "",
    description: course.description ?? "",
    level: course.level,
    price_gbp: course.price_gbp,
    currency: course.currency,
    cover_image_path: course.cover_image_path,
    learning_outcomes: course.learning_outcomes ?? [],
    money_back_enabled: course.money_back_enabled,
    money_back_days: course.money_back_days,
  });
  const [outcomeDraft, setOutcomeDraft] = useState("");
  const [saving, startSave] = useTransition();
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Track dirty fields so we don't trigger a save on first render
  const [dirty, setDirty] = useState<Set<keyof typeof data>>(new Set());

  const markDirty = (key: keyof typeof data) =>
    setDirty((s) => new Set(s).add(key));

  // Auto-save 800ms after user stops editing
  useEffect(() => {
    if (dirty.size === 0) return;
    const timer = setTimeout(() => {
      const payload: Partial<typeof data> = {};
      dirty.forEach((k) => {
        // @ts-expect-error – dynamic key assignment
        payload[k] = data[k];
      });
      startSave(async () => {
        try {
          const res = await fetch(`/api/admin/courses/${course.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(d.message ?? "Error");
          }
          setLastSavedAt(new Date());
          setDirty(new Set());
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "No se pudo guardar");
        }
      });
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dirty]);

  const update = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    markDirty(key);
  };

  const addOutcome = () => {
    const t = outcomeDraft.trim();
    if (!t) return;
    update("learning_outcomes", [...data.learning_outcomes, t]);
    setOutcomeDraft("");
  };
  const removeOutcome = (i: number) =>
    update(
      "learning_outcomes",
      data.learning_outcomes.filter((_, idx) => idx !== i),
    );

  return (
    <div className="space-y-6">
      <SaveStatus saving={saving} lastSavedAt={lastSavedAt} dirty={dirty.size} />

      <div className="grid gap-6 md:grid-cols-[1fr_240px] md:items-start">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título del curso</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              maxLength={160}
              placeholder="Ej: Spanish for Beginners — A1 Foundations"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo (1 línea, opcional)</Label>
            <Input
              id="subtitle"
              value={data.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              maxLength={280}
              placeholder="Una promesa concreta. Ej: Speak with confidence in 8 weeks."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción larga</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={8}
              placeholder="Contale al alumno cómo es el curso, para quién es, qué va a poder hacer al terminar..."
            />
            <p className="text-[11px] text-charcoal-400">
              Soporta saltos de línea. Se muestra en la página pública del curso.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Nivel</Label>
              <Select
                value={data.level}
                onValueChange={(v) => update("level", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select
                value={data.currency}
                onValueChange={(v) => update("currency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={data.price_gbp}
                onChange={(e) => update("price_gbp", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Learning outcomes */}
          <div className="space-y-2">
            <Label>Qué van a aprender</Label>
            <p className="text-[11px] text-charcoal-400">
              Lista de bullet points que aparecen en la página del curso.
            </p>
            <div className="space-y-1.5">
              {data.learning_outcomes.map((o, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-charcoal-100/60 bg-cream-50 px-3 py-2"
                >
                  <Check className="h-3.5 w-3.5 text-mustard-600 shrink-0" />
                  <span className="flex-1 text-sm text-charcoal-600">{o}</span>
                  <button
                    onClick={() => removeOutcome(i)}
                    className="text-charcoal-400 hover:text-destructive"
                    aria-label="Quitar"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={outcomeDraft}
                onChange={(e) => setOutcomeDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOutcome();
                  }
                }}
                placeholder="Ej: Mantener una conversación de 5 minutos"
                maxLength={180}
              />
              <Button onClick={addOutcome} variant="soft" size="default">
                <Plus className="h-4 w-4" /><span>Agregar</span>
              </Button>
            </div>
          </div>

          {/* Money-back */}
          <div className="rounded-2xl border border-charcoal-100/60 bg-cream-50 p-4 space-y-3">
            <label className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-charcoal-600">
                  Garantía de devolución
                </p>
                <p className="text-xs text-charcoal-400">
                  Aumenta confianza. Standard: 14 días.
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4 accent-mustard"
                checked={data.money_back_enabled}
                onChange={(e) => update("money_back_enabled", e.target.checked)}
              />
            </label>
            {data.money_back_enabled && (
              <div className="flex items-center gap-2">
                <Label htmlFor="mb-days" className="text-sm shrink-0">
                  Días:
                </Label>
                <Input
                  id="mb-days"
                  type="number"
                  className="max-w-[100px]"
                  min={1}
                  max={365}
                  value={data.money_back_days}
                  onChange={(e) =>
                    update("money_back_days", Number(e.target.value))
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 md:sticky md:top-6">
          <CoverImagePicker
            currentUrl={data.cover_image_path}
            onUploaded={({ publicUrl }) => update("cover_image_path", publicUrl)}
            onClear={() => update("cover_image_path", null)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Cover Image Picker ───────────────────────────────────────────────────────

function CoverImagePicker({
  currentUrl,
  onUploaded,
  onClear,
}: {
  currentUrl: string | null | undefined;
  onUploaded: (info: {
    path: string;
    publicUrl: string;
    fileName: string;
    sizeBytes: number;
  }) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUrl ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setPreviewUrl(currentUrl ?? null);
  }, [currentUrl]);

  const pick = () => inputRef.current?.click();

  const upload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Máximo 10 MB");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const signRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: "covers",
          filename: file.name,
          contentType: file.type,
        }),
      });
      if (!signRes.ok) {
        const e = await signRes.json().catch(() => ({})) as Record<string, string>;
        throw new Error(e.message ?? e.error ?? "Error al preparar la subida");
      }
      const sign = await signRes.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", sign.signedUrl, true);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream",
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`HTTP ${xhr.status}`));
        xhr.onerror = () => reject(new Error("Error de red"));
        xhr.send(file);
      });

      setPreviewUrl(sign.publicUrl);
      onUploaded({
        path: sign.path,
        publicUrl: sign.publicUrl,
        fileName: file.name,
        sizeBytes: file.size,
      });
      toast.success("Portada actualizada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo subir");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onClear();
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-charcoal-600">
        Imagen de portada
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />

      {/* 16:9 preview / upload zone */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-charcoal-100 bg-charcoal-50">
        {busy ? (
          /* uploading state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream-50">
            <Loader2 className="h-7 w-7 animate-spin text-mustard-600" />
            <div className="w-32 h-1.5 rounded-full bg-charcoal-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-mustard transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-charcoal-400">
              {progress.toFixed(0)}%
            </span>
          </div>
        ) : previewUrl ? (
          /* image loaded */
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Portada del curso"
              className="h-full w-full object-cover"
            />
            {/* hover overlay with actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal-700/55 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={pick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal-700 shadow-sm hover:bg-white"
              >
                <Upload className="h-3 w-3" />
                <span>Cambiar</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-destructive shadow-sm hover:bg-white"
              >
                <X className="h-3 w-3" />
                <span>Quitar</span>
              </button>
            </div>
          </>
        ) : (
          /* empty state — click to upload */
          <button
            type="button"
            onClick={pick}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-charcoal-400 transition-colors hover:bg-charcoal-100/50 hover:text-charcoal-600"
          >
            <ImageIcon className="h-9 w-9" />
            <span className="text-xs font-semibold">Subir portada</span>
            <span className="text-[11px]">JPG · PNG · WebP · máx 10 MB</span>
          </button>
        )}
      </div>

      {/* Change button below (always visible when image exists) */}
      {previewUrl && !busy && (
        <button
          type="button"
          onClick={pick}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-charcoal-100 bg-cream-50 py-2 text-xs font-medium text-charcoal-500 transition-colors hover:bg-charcoal-100/50 hover:text-charcoal-600"
        >
          <Upload className="h-3 w-3" />
          <span>Cambiar imagen</span>
        </button>
      )}

      <p className="text-[11px] text-charcoal-400">
        Ideal 1280 × 720 px (16:9).
      </p>
    </div>
  );
}

// ─── Save Status ──────────────────────────────────────────────────────────────

function SaveStatus({
  saving,
  lastSavedAt,
  dirty,
}: {
  saving: boolean;
  lastSavedAt: Date | null;
  dirty: number;
}) {
  if (saving) {
    return (
      <p className="inline-flex items-center gap-2 text-xs text-charcoal-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Guardando…</span>
      </p>
    );
  }
  if (dirty > 0) {
    return (
      <p className="text-xs text-charcoal-400">
        <span>Cambios sin guardar — se guardan solos en ~1 seg.</span>
      </p>
    );
  }
  if (lastSavedAt) {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
        <Check className="h-3 w-3" />
        <span>Todo guardado</span>
      </p>
    );
  }
  return null;
}
