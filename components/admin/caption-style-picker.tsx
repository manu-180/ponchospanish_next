"use client";

/**
 * Subtitle design picker. Shows each preset as a mini caption preview over a
 * dark (video-like) swatch. Selecting one updates the live preview in the
 * editor (via onChange) and persists `caption_style` on the course — the same
 * design students will see in the player.
 */

import { useState, type CSSProperties } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CAPTION_PRESETS } from "@/lib/subtitles/presets";

interface Props {
  courseId: string;
  value: string;
  onChange: (presetId: string) => void;
}

export function CaptionStylePicker({ courseId, value, onChange }: Props) {
  const [saving, setSaving] = useState<string | null>(null);

  const select = async (id: string) => {
    if (id === value) return;
    onChange(id); // optimistic — preview updates instantly
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption_style: id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Diseño guardado para todo el curso");
    } catch {
      toast.error("No se pudo guardar el diseño");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-charcoal-600">
          Diseño de subtítulos
        </p>
        <span className="text-[11px] text-charcoal-400">
          se aplica a todo el curso
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CAPTION_PRESETS.map((p) => {
          const selected = p.id === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p.id)}
              title={p.description}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 text-left transition-all",
                selected
                  ? "border-mustard ring-2 ring-mustard/30"
                  : "border-charcoal-100/60 hover:border-mustard/40",
              )}
            >
              {/* Mini preview over a dark "video" swatch */}
              <div className="relative flex h-14 items-end justify-center bg-gradient-to-br from-charcoal-600 to-charcoal-800 p-1.5">
                <span
                  style={
                    {
                      ...p.bubble,
                      fontSize: "12px",
                      lineHeight: 1.15,
                    } as CSSProperties
                  }
                >
                  Hola 👋
                </span>
                {selected && (
                  <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-mustard text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                )}
                {saving === p.id && (
                  <span className="absolute inset-0 flex items-center justify-center bg-charcoal-800/50">
                    <Loader2 className="h-4 w-4 animate-spin text-cream" />
                  </span>
                )}
              </div>
              <span className="block px-2 py-1.5 text-xs font-medium text-charcoal-600">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
