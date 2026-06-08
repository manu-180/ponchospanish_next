"use client";

import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FileText,
  Link2,
  Archive,
  Music,
  Video,
  Image,
  Sheet,
  Presentation,
  File,
  GripVertical,
  Trash2,
  Plus,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronRight,
  Pencil,
  Check,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UniversalFileUploader } from "./universal-file-uploader";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResourceKind =
  | "pdf"
  | "link"
  | "zip"
  | "audio"
  | "video"
  | "image"
  | "doc"
  | "spreadsheet"
  | "presentation"
  | "other";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_path: string | null;
  url: string | null;
  file_size_bytes: number | null;
  kind: ResourceKind;
  is_free_preview: boolean;
  position: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function kindFromMime(mime: string, filename: string): ResourceKind {
  if (mime === "application/pdf" || filename.endsWith(".pdf")) return "pdf";
  if (
    mime.startsWith("audio/") ||
    /\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(filename)
  )
    return "audio";
  if (
    mime.startsWith("video/") ||
    /\.(mp4|mov|avi|mkv|webm)$/i.test(filename)
  )
    return "video";
  if (
    mime.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
  )
    return "image";
  if (
    /\.(zip|rar|7z|tar|gz)$/i.test(filename) ||
    mime === "application/zip"
  )
    return "zip";
  if (
    /\.(doc|docx)$/i.test(filename) ||
    mime.includes("word")
  )
    return "doc";
  if (
    /\.(xls|xlsx|csv)$/i.test(filename) ||
    mime.includes("excel") ||
    mime.includes("spreadsheet")
  )
    return "spreadsheet";
  if (
    /\.(ppt|pptx)$/i.test(filename) ||
    mime.includes("powerpoint") ||
    mime.includes("presentation")
  )
    return "presentation";
  return "other";
}

function formatBytes(bytes: number | null): string | null {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const KIND_META: Record<
  ResourceKind,
  { icon: React.ElementType; color: string; label: string }
> = {
  pdf:          { icon: FileText,     color: "bg-red-100 text-red-600",      label: "PDF" },
  link:         { icon: Link2,        color: "bg-sky-100 text-sky-600",       label: "Link" },
  zip:          { icon: Archive,      color: "bg-amber-100 text-amber-600",   label: "ZIP" },
  audio:        { icon: Music,        color: "bg-violet-100 text-violet-600", label: "Audio" },
  video:        { icon: Video,        color: "bg-blue-100 text-blue-600",     label: "Video" },
  image:        { icon: Image,        color: "bg-green-100 text-green-600",   label: "Imagen" },
  doc:          { icon: FileText,     color: "bg-indigo-100 text-indigo-600", label: "Doc" },
  spreadsheet:  { icon: Sheet,        color: "bg-emerald-100 text-emerald-600", label: "Planilla" },
  presentation: { icon: Presentation, color: "bg-orange-100 text-orange-600", label: "Presentación" },
  other:        { icon: File,         color: "bg-charcoal-100 text-charcoal-500", label: "Archivo" },
};

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export function LessonResourcesPanel({ lessonId }: { lessonId: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"idle" | "upload" | "link">("idle");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [saving, startSaving] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/admin/lessons/${lessonId}/resources`)
      .then((r) => r.json())
      .then((d: Resource[]) => setResources(d))
      .catch(() => toast.error("No se pudieron cargar los recursos"))
      .finally(() => setLoading(false));
  }, [lessonId, open]);

  const createFileResource = async (info: {
    path: string;
    fileName: string;
    sizeBytes: number;
    mime: string;
  }) => {
    const kind = kindFromMime(info.mime, info.fileName);
    const title = info.fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

    startSaving(async () => {
      try {
        const res = await fetch(`/api/admin/lessons/${lessonId}/resources`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind,
            title,
            file_path: info.path,
            file_size_bytes: info.sizeBytes,
            is_free_preview: false,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Error");
        setResources((prev) => [...prev, data]);
        setMode("idle");
        toast.success("Recurso agregado");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo guardar");
      }
    });
  };

  const createLinkResource = () => {
    const url = linkUrl.trim();
    const title = linkTitle.trim();
    if (!url || !title) {
      toast.error("Completá la URL y el título");
      return;
    }

    startSaving(async () => {
      try {
        const res = await fetch(`/api/admin/lessons/${lessonId}/resources`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "link", title, url, is_free_preview: false }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Error");
        setResources((prev) => [...prev, data]);
        setLinkUrl("");
        setLinkTitle("");
        setMode("idle");
        toast.success("Link agregado");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo guardar");
      }
    });
  };

  const deleteResource = async (id: string) => {
    if (!confirm("¿Eliminar este recurso?")) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  const updateResource = async (id: string, patch: Partial<Resource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
    try {
      await fetch(`/api/admin/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      toast.error("No se pudo guardar");
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = resources.findIndex((r) => r.id === active.id);
    const newIdx = resources.findIndex((r) => r.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(resources, oldIdx, newIdx).map((r, i) => ({
      ...r,
      position: i,
    }));
    setResources(reordered);
    // Persist new positions
    reordered.forEach((r) => {
      fetch(`/api/admin/resources/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: r.position }),
      }).catch(() => {});
    });
  };

  const count = resources.length;

  return (
    <div className="rounded-xl border border-charcoal-100/60 bg-white/50">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-charcoal-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-charcoal-400" />
        )}
        <span className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
          Recursos
        </span>
        {count > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-mustard/20 px-1.5 text-[10px] font-bold text-mustard-700">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="border-t border-charcoal-100/60 px-3 pb-3 pt-2 space-y-3">
          {/* Resource list */}
          {loading ? (
            <div className="flex items-center gap-2 py-3 text-sm text-charcoal-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando…
            </div>
          ) : resources.length === 0 && mode === "idle" ? (
            <p className="text-xs text-charcoal-400 py-1">
              Todavía no hay recursos en esta lección.
            </p>
          ) : (
            <DndContext
              id={`resources-${lessonId}`}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={resources.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {resources.map((r) => (
                    <ResourceRow
                      key={r.id}
                      resource={r}
                      onUpdate={(patch) => updateResource(r.id, patch)}
                      onDelete={() => deleteResource(r.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* Add modes */}
          {mode === "upload" && (
            <div className="rounded-xl border border-charcoal-100/60 bg-cream-50 p-3 space-y-2">
              <UniversalFileUploader
                bucket="course-resources"
                accept="*/*"
                hint="PDF, ZIP, audio, video, imagen… cualquier formato y tamaño."
                onUploaded={(info) =>
                  createFileResource({
                    path: info.path,
                    fileName: info.fileName,
                    sizeBytes: info.sizeBytes,
                    mime: "",
                  })
                }
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-charcoal-400 hover:text-charcoal-600"
                onClick={() => setMode("idle")}
              >
                <X className="h-3.5 w-3.5" /> Cancelar
              </Button>
            </div>
          )}

          {mode === "link" && (
            <div className="rounded-xl border border-charcoal-100/60 bg-cream-50 p-3 space-y-2">
              <div className="space-y-1.5">
                <Input
                  placeholder="https://…"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="h-9 font-mono text-sm"
                  autoFocus
                />
                <Input
                  placeholder="Título del link"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createLinkResource();
                    if (e.key === "Escape") setMode("idle");
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={createLinkResource}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Agregar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-charcoal-400"
                  onClick={() => { setMode("idle"); setLinkUrl(""); setLinkTitle(""); }}
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {mode === "idle" && (
            <div className="flex items-center gap-2 pt-0.5">
              <Button
                size="sm"
                variant="soft"
                className="flex-1"
                onClick={() => setMode("upload")}
              >
                <Plus className="h-3.5 w-3.5" /> Subir archivo
              </Button>
              <Button
                size="sm"
                variant="soft"
                className="flex-1"
                onClick={() => setMode("link")}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Agregar link
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Resource Row (sortable)
// ---------------------------------------------------------------------------

function ResourceRow({
  resource,
  onUpdate,
  onDelete,
}: {
  resource: Resource;
  onUpdate: (patch: Partial<Resource>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: resource.id });

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(resource.title);

  const style = { transform: CSS.Transform.toString(transform), transition };
  const meta = KIND_META[resource.kind] ?? KIND_META.other;
  const Icon = meta.icon;
  const size = formatBytes(resource.file_size_bytes);

  const saveTitle = () => {
    const t = titleDraft.trim();
    if (!t || t === resource.title) {
      setTitleDraft(resource.title);
      setEditing(false);
      return;
    }
    onUpdate({ title: t });
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-charcoal-100/60 bg-white px-2.5 py-2 transition-shadow",
        isDragging && "shadow-soft-lg ring-2 ring-mustard/30 z-10",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab p-0.5 text-charcoal-300 hover:text-charcoal-500 active:cursor-grabbing"
        aria-label="Reordenar"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm",
          meta.color,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="flex-1 min-w-0">
        {editing ? (
          <Input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setTitleDraft(resource.title);
                setEditing(false);
              }
            }}
            className="h-7 text-sm"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="group flex items-center gap-1.5 text-left w-full"
          >
            <span className="truncate text-sm font-medium text-charcoal-700">
              {resource.title}
            </span>
            <Pencil className="h-3 w-3 shrink-0 text-charcoal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
            {meta.label}
          </span>
          {size && (
            <span className="text-[10px] text-charcoal-300">{size}</span>
          )}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-sky-500 hover:text-sky-700 truncate max-w-[160px]"
            >
              {resource.url}
            </a>
          )}
        </div>
      </div>

      <button
        onClick={() => onUpdate({ is_free_preview: !resource.is_free_preview })}
        title={resource.is_free_preview ? "Visible sin acceso (free)" : "Solo para alumnos"}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          resource.is_free_preview
            ? "text-mustard-600 bg-mustard/15"
            : "text-charcoal-300 hover:text-charcoal-500 hover:bg-charcoal-100",
        )}
      >
        {resource.is_free_preview ? (
          <Unlock className="h-3.5 w-3.5" />
        ) : (
          <Lock className="h-3.5 w-3.5" />
        )}
      </button>

      <button
        onClick={onDelete}
        className="rounded-md p-1.5 text-charcoal-300 transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Eliminar recurso"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
