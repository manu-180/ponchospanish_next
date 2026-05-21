"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Lock, PlayCircle } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import type { Lesson, Module } from "@/types/database";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

interface CourseOutlineProps {
  courseSlug: string;
  modules: ModuleWithLessons[];
  currentLessonId?: string;
  completedLessonIds: string[];
  hasAccess: boolean;
}

export function CourseOutline({
  courseSlug,
  modules,
  currentLessonId,
  completedLessonIds,
  hasAccess,
}: CourseOutlineProps) {
  const currentModuleIndex = modules.findIndex((m) =>
    m.lessons.some((l) => l.id === currentLessonId),
  );

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentModuleIndex >= 0) initial.add(modules[currentModuleIndex].id);
    else if (modules[0]) initial.add(modules[0].id);
    return initial;
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav className="space-y-1.5">
      {modules.map((mod, mi) => {
        const open = openIds.has(mod.id);
        const moduleLessonsDone = mod.lessons.filter((l) =>
          completedLessonIds.includes(l.id),
        ).length;
        const total = mod.lessons.length;
        return (
          <div
            key={mod.id}
            className="rounded-xl bg-cream-50 ring-1 ring-charcoal-100/40 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(mod.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-mustard/5 transition-colors"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-mustard/15 text-mustard-600 text-[11px] font-semibold shrink-0">
                {(mi + 1).toString().padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight line-clamp-2">
                  {mod.title}
                </p>
                <p className="text-[11px] text-charcoal-400 mt-0.5">
                  {moduleLessonsDone}/{total} completed
                  {mod.is_free && " · Free module"}
                </p>
              </div>
              {open ? (
                <ChevronDown className="h-4 w-4 text-charcoal-300" />
              ) : (
                <ChevronRight className="h-4 w-4 text-charcoal-300" />
              )}
            </button>
            {open && (
              <ul className="border-t border-charcoal-100/40 divide-y divide-charcoal-100/40">
                {mod.lessons.map((lesson, li) => {
                  const done = completedLessonIds.includes(lesson.id);
                  const active = lesson.id === currentLessonId;
                  const free = lesson.is_free_preview || mod.is_free;
                  const accessible = hasAccess || free;
                  return (
                    <li key={lesson.id}>
                      {accessible ? (
                        <Link
                          href={`/learn/${courseSlug}/${lesson.slug}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                            active
                              ? "bg-mustard/10 text-charcoal-600"
                              : "text-charcoal-500 hover:bg-mustard/5",
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : active ? (
                            <span className="h-2 w-2 rounded-full bg-mustard animate-pulse shrink-0 mx-1" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-charcoal-300 shrink-0" />
                          )}
                          <span className="flex-1 line-clamp-1">
                            {(li + 1).toString().padStart(2, "0")}. {lesson.title}
                          </span>
                          <span className="text-[10px] text-charcoal-400">
                            {formatDuration(lesson.video_duration_seconds ?? 0)}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-300 cursor-not-allowed">
                          <Lock className="h-4 w-4 shrink-0" />
                          <span className="flex-1 line-clamp-1">
                            {(li + 1).toString().padStart(2, "0")}. {lesson.title}
                          </span>
                          <span className="text-[10px]">
                            {formatDuration(lesson.video_duration_seconds ?? 0)}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
