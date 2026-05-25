"use client";

/**
 * Editable course "info" form. Auto-saves on blur via PATCH /api/admin/courses/[id].
 * Each field is independent so we save only what changed.
 */

import { useEffect, useState, useTransition } from "react";
import { Loader2, Plus, X, Check } from "lucide-react";
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
import { FileUploader } from "./file-uploader";
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

      <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
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
                <Plus className="h-4 w-4" /> Agregar
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

        <div className="space-y-5">
          <FileUploader
            bucket="covers"
            accept="image/*"
            variant="image"
            label="Imagen de portada"
            hint="JPG, PNG o WebP. 1280×720 ideal."
            currentUrl={data.cover_image_path}
            maxBytes={10 * 1024 * 1024}
            onUploaded={({ publicUrl }) => update("cover_image_path", publicUrl)}
            onClear={() => update("cover_image_path", null)}
          />
        </div>
      </div>
    </div>
  );
}

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
        <Loader2 className="h-3 w-3 animate-spin" /> Guardando…
      </p>
    );
  }
  if (dirty > 0) {
    return (
      <p className="text-xs text-charcoal-400">
        Cambios sin guardar — se guardan solos en ~1 seg.
      </p>
    );
  }
  if (lastSavedAt) {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
        <Check className="h-3 w-3" /> Todo guardado
      </p>
    );
  }
  return null;
}
