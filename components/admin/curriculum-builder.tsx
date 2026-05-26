"use client";

/**
 * Drag-and-drop curriculum: modules contain lessons. Inline CRUD on both.
 *
 * Persistence:
 *  - Reorder modules → PATCH /api/admin/courses/[id]/modules/reorder
 *  - Reorder lessons → PATCH /api/admin/modules/[id]/lessons/reorder
 *  - Create module   → POST  /api/admin/courses/[id]/modules
 *  - Update module   → PATCH /api/admin/modules/[id]
 *  - Delete module   → DELETE /api/admin/modules/[id]
 *  - Create lesson   → POST  /api/admin/modules/[id]/lessons
 *  - Update lesson   → PATCH /api/admin/lessons/[id]
 *  - Delete lesson   → DELETE /api/admin/lessons/[id]
 *  - Upload video    → MuxUploader (uses /api/mux/direct-upload)
 *
 * UX notes for Anto:
 *  - Drag from the small handle on the left; clicking the title edits it.
 *  - Each lesson row shows a Mux upload widget you can drag a video into.
 *  - "Vista previa gratis" toggle next to a lesson means non-buyers can watch
 *    that lesson (great for a sales hook).
 */

import { useState, useTransition } from "react";
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
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
  Video,
  Star,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MuxUploader, type MuxStatus } from "./mux-uploader";
import type { Lesson as LessonRow, Module as ModuleRow } from "@/types/database";

type LessonItem = Pick<
  LessonRow,
  | "id"
  | "title"
  | "slug"
  | "description"
  | "position"
  | "is_free_preview"
  | "mux_status"
  | "mux_thumbnail_url"
  | "mux_duration_seconds"
>;

type ModuleItem = Pick<
  ModuleRow,
  "id" | "title" | "slug" | "description" | "position" | "is_free"
> & {
  lessons: LessonItem[];
};

export function CurriculumBuilder({
  courseId,
  initialModules,
}: {
  courseId: string;
  initialModules: ModuleItem[];
}) {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(initialModules.map((m) => m.id)),
  );
  const [creating, startCreating] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const toggleExpand = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const handleModuleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(modules, oldIdx, newIdx);
    setModules(next);
    fetch(`/api/admin/courses/${courseId}/modules/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((m) => m.id) }),
    }).catch(() => toast.error("No se pudo guardar el orden"));
  };

  const addModule = () => {
    startCreating(async () => {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `Módulo ${modules.length + 1}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Error");
        setModules((m) => [...m, { ...data, lessons: [] }]);
        setExpanded((s) => new Set(s).add(data.id));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo crear");
      }
    });
  };

  const updateModule = (id: string, patch: Partial<ModuleItem>) =>
    setModules((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const removeModule = (id: string) =>
    setModules((arr) => arr.filter((m) => m.id !== id));

  const updateLesson = (
    moduleId: string,
    lessonId: string,
    patch: Partial<LessonItem>,
  ) =>
    setModules((arr) =>
      arr.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, ...patch } : l,
              ),
            }
          : m,
      ),
    );

  const addLesson = (moduleId: string, lesson: LessonItem) =>
    setModules((arr) =>
      arr.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m,
      ),
    );

  const removeLesson = (moduleId: string, lessonId: string) =>
    setModules((arr) =>
      arr.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );

  const reorderLessons = (moduleId: string, lessons: LessonItem[]) => {
    setModules((arr) =>
      arr.map((m) => (m.id === moduleId ? { ...m, lessons } : m)),
    );
    fetch(`/api/admin/modules/${moduleId}/lessons/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: lessons.map((l) => l.id) }),
    }).catch(() => toast.error("No se pudo guardar el orden de lecciones"));
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const readyLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.mux_status === "ready").length,
    0,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-charcoal-400">
            {modules.length} módulo{modules.length === 1 ? "" : "s"} ·{" "}
            {readyLessons}/{totalLessons} videos listos
          </p>
        </div>
        <Button onClick={addModule} disabled={creating}>
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Nuevo módulo
        </Button>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-charcoal-200 bg-cream-50 p-10 text-center">
          <p className="font-serif text-xl text-charcoal-600">
            Empezá creando el primer módulo
          </p>
          <p className="mt-1 text-sm text-charcoal-400">
            Un módulo agrupa lecciones (videos). Ej: &ldquo;Introducción&rdquo;, &ldquo;Vocabulario
            básico&rdquo;, &ldquo;Conversación&rdquo;.
          </p>
          <Button onClick={addModule} className="mt-4" disabled={creating}>
            <Plus className="h-4 w-4" /> Crear primer módulo
          </Button>
        </div>
      ) : (
        <DndContext
          id="curriculum-modules"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleModuleDragEnd}
        >
          <SortableContext
            items={modules.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {modules.map((m, idx) => (
                <ModuleCard
                  key={m.id}
                  module={m}
                  index={idx}
                  expanded={expanded.has(m.id)}
                  onToggleExpand={() => toggleExpand(m.id)}
                  onUpdate={(p) => updateModule(m.id, p)}
                  onRemove={() => removeModule(m.id)}
                  onLessonAdd={(l) => addLesson(m.id, l)}
                  onLessonUpdate={(lid, p) => updateLesson(m.id, lid, p)}
                  onLessonRemove={(lid) => removeLesson(m.id, lid)}
                  onLessonReorder={(ls) => reorderLessons(m.id, ls)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MODULE CARD
// ---------------------------------------------------------------------------

function ModuleCard({
  module,
  index,
  expanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  onLessonAdd,
  onLessonUpdate,
  onLessonRemove,
  onLessonReorder,
}: {
  module: ModuleItem;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (patch: Partial<ModuleItem>) => void;
  onRemove: () => void;
  onLessonAdd: (l: LessonItem) => void;
  onLessonUpdate: (lessonId: string, patch: Partial<LessonItem>) => void;
  onLessonRemove: (lessonId: string) => void;
  onLessonReorder: (lessons: LessonItem[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: module.id });
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(module.title);
  const [creatingLesson, startCreating] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const saveTitle = async () => {
    const t = titleDraft.trim();
    if (!t || t === module.title) {
      setTitleDraft(module.title);
      setEditingTitle(false);
      return;
    }
    onUpdate({ title: t });
    setEditingTitle(false);
    try {
      const res = await fetch(`/api/admin/modules/${module.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t }),
      });
      if (!res.ok) throw new Error("Error");
    } catch {
      toast.error("No se pudo guardar el título");
      onUpdate({ title: module.title });
    }
  };

  const deleteModule = async () => {
    if (
      !confirm(
        `¿Borrar el módulo "${module.title}"? Se borran también sus ${module.lessons.length} lecciones.`,
      )
    )
      return;
    onRemove();
    try {
      await fetch(`/api/admin/modules/${module.id}`, { method: "DELETE" });
    } catch {
      toast.error("No se pudo borrar");
    }
  };

  const toggleFree = async (next: boolean) => {
    onUpdate({ is_free: next });
    try {
      await fetch(`/api/admin/modules/${module.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_free: next }),
      });
    } catch {
      onUpdate({ is_free: !next });
    }
  };

  const addLesson = () =>
    startCreating(async () => {
      try {
        const res = await fetch(
          `/api/admin/modules/${module.id}/lessons`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `Lección ${module.lessons.length + 1}`,
            }),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? "Error");
        onLessonAdd(data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "No se pudo crear");
      }
    });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border border-charcoal-100/60 bg-cream-50 transition-shadow",
        isDragging && "shadow-soft-lg ring-2 ring-mustard/40 z-10",
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-md p-1 text-charcoal-300 hover:bg-charcoal-100 hover:text-charcoal-500 active:cursor-grabbing"
          aria-label="Reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={onToggleExpand}
          className="rounded-md p-1 text-charcoal-400 hover:bg-charcoal-100"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-mustard/15 text-xs font-bold text-mustard-600">
          {index + 1}
        </span>

        {editingTitle ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitleDraft(module.title);
                  setEditingTitle(false);
                }
              }}
              className="h-9"
            />
          </div>
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="group flex flex-1 items-center gap-2 text-left"
          >
            <span className="font-serif text-lg text-charcoal-700">
              {module.title}
            </span>
            <Pencil className="h-3 w-3 text-charcoal-300 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}

        <span className="text-xs text-charcoal-400">
          {module.lessons.length} lección{module.lessons.length === 1 ? "" : "es"}
        </span>

        <label className="hidden sm:flex items-center gap-1.5 text-xs text-charcoal-500 cursor-pointer">
          <input
            type="checkbox"
            checked={module.is_free}
            onChange={(e) => toggleFree(e.target.checked)}
            className="h-3.5 w-3.5 accent-mustard"
          />
          Módulo gratis
        </label>

        <button
          onClick={deleteModule}
          className="rounded-md p-2 text-charcoal-300 transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Borrar módulo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-charcoal-100/60 p-3 space-y-3">
          {module.lessons.length === 0 ? (
            <div className="rounded-xl bg-cream py-6 text-center">
              <p className="text-sm text-charcoal-400">
                Este módulo todavía no tiene lecciones.
              </p>
            </div>
          ) : (
            <LessonList
              moduleId={module.id}
              lessons={module.lessons}
              onUpdate={onLessonUpdate}
              onRemove={onLessonRemove}
              onReorder={onLessonReorder}
            />
          )}

          <Button
            variant="soft"
            size="sm"
            onClick={addLesson}
            disabled={creatingLesson}
            className="w-full"
          >
            {creatingLesson ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Agregar lección
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LESSON LIST (nested dnd context for lessons within a module)
// ---------------------------------------------------------------------------

function LessonList({
  moduleId,
  lessons,
  onUpdate,
  onRemove,
  onReorder,
}: {
  moduleId: string;
  lessons: LessonItem[];
  onUpdate: (lessonId: string, patch: Partial<LessonItem>) => void;
  onRemove: (lessonId: string) => void;
  onReorder: (lessons: LessonItem[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = lessons.findIndex((l) => l.id === active.id);
    const newIdx = lessons.findIndex((l) => l.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    onReorder(arrayMove(lessons, oldIdx, newIdx));
  };

  return (
    <DndContext
      id={`lessons-${moduleId}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {lessons.map((l, idx) => (
            <LessonRow
              key={l.id}
              lesson={l}
              moduleId={moduleId}
              index={idx}
              onUpdate={(p) => onUpdate(l.id, p)}
              onRemove={() => onRemove(l.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ---------------------------------------------------------------------------
// LESSON ROW
// ---------------------------------------------------------------------------

function LessonRow({
  lesson,
  moduleId,
  index,
  onUpdate,
  onRemove,
}: {
  lesson: LessonItem;
  moduleId: string;
  index: number;
  onUpdate: (patch: Partial<LessonItem>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });
  const [expanded, setExpanded] = useState(lesson.mux_status === "idle");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(lesson.title);
  const [descDraft, setDescDraft] = useState(lesson.description ?? "");

  const style = { transform: CSS.Transform.toString(transform), transition };

  const saveTitle = async () => {
    const t = titleDraft.trim();
    if (!t || t === lesson.title) {
      setTitleDraft(lesson.title);
      setEditingTitle(false);
      return;
    }
    onUpdate({ title: t });
    setEditingTitle(false);
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t }),
      });
    } catch {
      toast.error("No se pudo guardar");
    }
  };

  const saveDescription = async () => {
    if ((lesson.description ?? "") === descDraft) return;
    onUpdate({ description: descDraft });
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: descDraft }),
      });
    } catch {
      toast.error("No se pudo guardar la descripción");
    }
  };

  const togglePreview = async (next: boolean) => {
    onUpdate({ is_free_preview: next });
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_free_preview: next }),
      });
    } catch {
      onUpdate({ is_free_preview: !next });
    }
  };

  const remove = async () => {
    if (!confirm(`¿Borrar la lección "${lesson.title}"?`)) return;
    onRemove();
    try {
      await fetch(`/api/admin/lessons/${lesson.id}`, { method: "DELETE" });
    } catch {
      toast.error("No se pudo borrar");
    }
  };

  const statusLabel: Record<MuxStatus, { label: string; tone: string }> = {
    idle: { label: "Sin video", tone: "bg-charcoal-100 text-charcoal-400" },
    uploading: { label: "Subiendo", tone: "bg-mustard/15 text-mustard-600" },
    processing: { label: "Procesando", tone: "bg-mustard/15 text-mustard-600" },
    ready: { label: "Listo", tone: "bg-emerald-100 text-emerald-700" },
    errored: { label: "Error", tone: "bg-destructive/10 text-destructive" },
  };
  const st = statusLabel[lesson.mux_status as MuxStatus] ?? statusLabel.idle;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-xl border border-charcoal-100/60 bg-cream transition-shadow",
        isDragging && "shadow-soft-lg ring-2 ring-mustard/40 z-10",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-md p-1 text-charcoal-300 hover:text-charcoal-500 active:cursor-grabbing"
          aria-label="Reordenar"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <span className="text-[10px] font-bold text-charcoal-300 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        {lesson.mux_status === "ready" && lesson.mux_thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lesson.mux_thumbnail_url}
            alt=""
            className="h-9 w-14 shrink-0 rounded-md object-cover ring-1 ring-charcoal-100"
          />
        ) : (
          <span className="inline-flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-charcoal-100 text-charcoal-300">
            <Video className="h-4 w-4" />
          </span>
        )}

        {editingTitle ? (
          <Input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") {
                setTitleDraft(lesson.title);
                setEditingTitle(false);
              }
            }}
            className="h-8 flex-1"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="group flex flex-1 items-center gap-2 text-left"
          >
            <span className="text-sm font-medium text-charcoal-600">
              {lesson.title}
            </span>
            <Pencil className="h-3 w-3 text-charcoal-300 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}

        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            st.tone,
          )}
        >
          {st.label}
        </span>

        {lesson.mux_duration_seconds ? (
          <span className="text-xs tabular-nums text-charcoal-400">
            {formatDuration(lesson.mux_duration_seconds)}
          </span>
        ) : null}

        <button
          onClick={() => togglePreview(!lesson.is_free_preview)}
          aria-label="Vista previa gratis"
          title={
            lesson.is_free_preview
              ? "Vista previa gratis — los visitantes pueden verla"
              : "Marcar como vista previa gratis"
          }
          className={cn(
            "rounded-md p-1.5 transition-colors",
            lesson.is_free_preview
              ? "bg-mustard/15 text-mustard-600"
              : "text-charcoal-300 hover:bg-charcoal-100 hover:text-charcoal-500",
          )}
        >
          <Star className="h-3.5 w-3.5" fill={lesson.is_free_preview ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md p-1.5 text-charcoal-400 hover:bg-charcoal-100"
          aria-label="Expandir"
        >
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={remove}
          className="rounded-md p-1.5 text-charcoal-300 transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Borrar lección"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-charcoal-100/60 px-3 py-3 space-y-3">
          <MuxUploader
            lessonId={lesson.id}
            initialStatus={lesson.mux_status as MuxStatus}
            thumbnailUrl={lesson.mux_thumbnail_url}
            durationSeconds={lesson.mux_duration_seconds}
            onChange={() => {
              // After a successful upload/process, fetch the row to refresh
              fetch(`/api/admin/lessons-status/${lesson.id}`, { cache: "no-store" })
                .then((r) => r.json())
                .then((d) =>
                  onUpdate({
                    mux_status: d.status,
                    mux_thumbnail_url: d.thumbnailUrl,
                    mux_duration_seconds: d.durationSeconds,
                  } as Partial<LessonItem>),
                )
                .catch(() => {});
            }}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-500">
              Descripción de la lección (opcional)
            </label>
            <Textarea
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              onBlur={saveDescription}
              placeholder="Qué van a aprender en esta lección, qué materiales hay, etc."
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
