"use client";

/**
 * Create / edit a standalone digital product (ebook, PDF pack, cheatsheet).
 *
 * Used in two modes:
 *   - Create: pass `mode="create"`; on success navigates to /admin/digital-products/[id]
 *   - Edit:   pass `mode="edit"` and `initial` (existing product); auto-saves on blur
 */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./file-uploader";
import { UniversalFileUploader } from "./universal-file-uploader";
import { PublishToggle } from "./publish-toggle";
import type { DigitalProduct } from "@/types/database";

interface DraftState {
  title: string;
  subtitle: string;
  description: string;
  price_gbp: number;
  cover_image_path: string | null;
  file_path: string | null;
  file_size_bytes: number | null;
  preview_path: string | null;
}

export function DigitalProductForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: DigitalProduct;
}) {
  const router = useRouter();
  const [data, setData] = useState<DraftState>({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    description: initial?.description ?? "",
    price_gbp: initial?.price_gbp ?? 0,
    cover_image_path: initial?.cover_image_path ?? null,
    file_path: initial?.file_path ?? null,
    file_size_bytes: initial?.file_size_bytes ?? null,
    preview_path: initial?.preview_path ?? null,
  });
  const [creating, startCreate] = useTransition();
  const [saving, startSave] = useTransition();
  const [dirty, setDirty] = useState<Set<keyof DraftState>>(new Set());
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const update = <K extends keyof DraftState>(key: K, value: DraftState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (mode === "edit") setDirty((s) => new Set(s).add(key));
  };

  // Auto-save on edit
  useEffect(() => {
    if (mode !== "edit" || !initial || dirty.size === 0) return;
    const timer = setTimeout(() => {
      const payload: Partial<DraftState> = {};
      dirty.forEach((k) => {
        // @ts-expect-error – dynamic
        payload[k] = data[k];
      });
      startSave(async () => {
        try {
          const res = await fetch(`/api/admin/digital-products/${initial.id}`, {
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

  const create = () => {
    if (!data.title.trim()) {
      toast.error("Falta el título");
      return;
    }
    if (!data.file_path) {
      toast.error("Subí el archivo del ebook primero (PDF)");
      return;
    }
    startCreate(async () => {
      try {
        const res = await fetch("/api/admin/digital-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title.trim(),
            subtitle: data.subtitle.trim() || null,
            description: data.description.trim() || null,
            price_gbp: data.price_gbp,
            cover_image_path: data.cover_image_path,
            file_path: data.file_path,
            file_size_bytes: data.file_size_bytes,
            preview_path: data.preview_path,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.message ?? j.error ?? "Error");
        toast.success("Ebook creado como borrador");
        router.push(`/admin/digital-products/${j.id}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error");
      }
    });
  };

  return (
    <div className="space-y-6">
      {mode === "edit" && initial && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SaveStatus saving={saving} lastSavedAt={lastSavedAt} dirty={dirty.size} />
          <PublishToggle
            endpoint={`/api/admin/digital-products/${initial.id}`}
            initial={initial.is_published}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-start">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Ej: 100 verbos esenciales en español"
              maxLength={160}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
            <Input
              id="subtitle"
              value={data.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              maxLength={280}
              placeholder="Promesa concreta en una línea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={6}
              placeholder="Para quién es, qué incluye, cómo se usa..."
            />
          </div>

          <div className="space-y-2 max-w-[200px]">
            <Label htmlFor="price">Precio (GBP)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                £
              </span>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={data.price_gbp}
                onChange={(e) => update("price_gbp", Number(e.target.value))}
                className="pl-7"
              />
            </div>
            <p className="text-[11px] text-charcoal-400">0 = gratis</p>
          </div>
        </div>

        <div className="space-y-5 md:sticky md:top-6">
          <FileUploader
            bucket="covers"
            accept="image/*"
            variant="image"
            label="Portada"
            hint="Cuadrado o 4:3 funciona mejor"
            currentUrl={data.cover_image_path}
            maxBytes={10 * 1024 * 1024}
            onUploaded={({ publicUrl }) => update("cover_image_path", publicUrl)}
            onClear={() => update("cover_image_path", null)}
          />

          <UniversalFileUploader
            bucket="digital-products"
            label="Archivo del ebook"
            hint="PDF, video, ZIP u otro formato. Compresión automática para PDF e imágenes."
            accept="*/*"
            currentName={data.file_path?.split("/").pop()}
            onUploaded={({ path, sizeBytes }) => {
              update("file_path", path);
              update("file_size_bytes", sizeBytes);
            }}
            onClear={() => {
              update("file_path", null);
              update("file_size_bytes", null);
            }}
          />

          <UniversalFileUploader
            bucket="digital-products"
            label="Preview (opcional)"
            hint="Páginas de muestra o clip corto para mostrar antes de comprar"
            accept="application/pdf,.pdf,video/*"
            currentName={data.preview_path?.split("/").pop()}
            onUploaded={({ path }) => update("preview_path", path)}
            onClear={() => update("preview_path", null)}
          />
        </div>
      </div>

      {mode === "create" && (
        <div className="flex justify-end">
          <Button size="lg" onClick={create} disabled={creating}>
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Crear ebook (borrador)
          </Button>
        </div>
      )}
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
  if (saving)
    return (
      <p className="inline-flex items-center gap-2 text-xs text-charcoal-400">
        <Loader2 className="h-3 w-3 animate-spin" /><span>Guardando…</span>
      </p>
    );
  if (dirty > 0)
    return (
      <p className="text-xs text-charcoal-400">
        Cambios sin guardar — se guardan solos en ~1 seg.
      </p>
    );
  if (lastSavedAt)
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
        <Check className="h-3 w-3" /><span>Todo guardado</span>
      </p>
    );
  return null;
}
