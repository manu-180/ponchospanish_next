"use client";

/**
 * Reusable publish toggle. Calls PATCH on the supplied endpoint with
 * `{ is_published: boolean }`. Uses optimistic UI; reverts on error.
 */

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export function PublishToggle({
  endpoint,
  initial,
  label = "Publicado",
  hint,
}: {
  endpoint: string;
  initial: boolean;
  label?: string;
  hint?: string;
}) {
  const [published, setPublished] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setPublished(next);
    startTransition(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_published: next }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.message ?? "Error");
        }
        toast.success(next ? "Publicado" : "Despublicado");
      } catch (err) {
        setPublished(!next);
        toast.error(err instanceof Error ? err.message : "No se pudo guardar");
      }
    });
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-charcoal-100/60 bg-cream-50 px-4 py-3">
      <span
        className={
          published
            ? "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"
            : "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal-100 text-charcoal-400"
        }
      >
        {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-charcoal-600">{label}</p>
        <p className="text-xs text-charcoal-400">
          {hint ??
            (published
              ? "Visible en el catálogo público."
              : "Solo vos podés verlo (modo borrador).")}
        </p>
      </div>
      {pending && <Loader2 className="h-4 w-4 animate-spin text-mustard-600" />}
      <Switch
        checked={published}
        onCheckedChange={toggle}
        disabled={pending}
        aria-label={label}
      />
    </div>
  );
}
