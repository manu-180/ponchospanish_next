"use client";

/**
 * Subtitle card shown inside each expanded lesson row (curriculum builder).
 *
 * Flow:
 *  - "Generar subtítulos" → POST /api/admin/lessons/[id]/subtitles/generate.
 *    The endpoint AWAITS Whisper and returns the final status, so we update
 *    straight from the response (no polling). It can take ~1 min.
 *  - When ready → "Editar subtítulos" opens the full editor, and "Regenerar"
 *    re-runs (asking first if the track was hand-edited).
 *
 * Gated: needs the lesson video to be `ready` in Mux and OPENAI_API_KEY set.
 */

import { useState } from "react";
import Link from "next/link";
import {
  Captions,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  RotateCcw,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { cn, toErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type SubtitleStatus =
  | "none"
  | "generating"
  | "auto"
  | "edited"
  | "failed";

export interface InitialSubtitle {
  status: SubtitleStatus;
  language: string | null;
  error: string | null;
  cuesCount: number;
}

interface Props {
  lessonId: string;
  courseId: string;
  muxReady: boolean;
  whisperEnabled: boolean;
  initial: InitialSubtitle;
}

const LANG_LABEL: Record<string, string> = {
  en: "Inglés",
  es: "Español",
  auto: "Auto",
};

export function LessonSubtitlesPanel({
  lessonId,
  courseId,
  muxReady,
  whisperEnabled,
  initial,
}: Props) {
  const [status, setStatus] = useState<SubtitleStatus>(initial.status);
  const [language, setLanguage] = useState<string | null>(initial.language);
  const [cues, setCues] = useState<number>(initial.cuesCount);
  const [error, setError] = useState<string | null>(initial.error);
  const [busy, setBusy] = useState(false);

  const editorHref = `/admin/courses/${courseId}/lessons/${lessonId}/subtitles`;

  const langLabel = language && LANG_LABEL[language] ? LANG_LABEL[language] : "";
  const metaText =
    cues > 0
      ? `${cues} línea${cues === 1 ? "" : "s"}${langLabel ? ` · ${langLabel}` : ""}`
      : langLabel;

  const run = async (force = false) => {
    setBusy(true);
    setStatus("generating");
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/lessons/${lessonId}/subtitles/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: "auto", force }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          toErrorMessage(data.message ?? data.error, "No se pudo generar"),
        );
      }
      setStatus("auto");
      setLanguage(data.language ?? null);
      setCues(data.cues ?? 0);
      toast.success("Subtítulos generados. Ya podés editarlos.");
    } catch (err) {
      const message = toErrorMessage(err, "Error al generar subtítulos");
      setStatus("failed");
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const regenerate = () => {
    if (
      status === "edited" &&
      !confirm(
        "Esto reemplaza los subtítulos que editaste a mano con una versión nueva generada por IA. ¿Seguro?",
      )
    ) {
      return;
    }
    run(status === "edited");
  };

  // ---- Disabled / locked states ----
  if (!muxReady) {
    return (
      <Shell>
        <p className="text-xs text-charcoal-400">
          Subí y esperá a que el video termine de procesarse para generar los
          subtítulos.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {(status === "auto" || status === "edited") && metaText && (
            <span className="inline-flex items-center gap-1 text-[11px] text-charcoal-400">
              <Languages className="h-3 w-3" />
              {metaText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(status === "none" || status === "failed") && (
            <Button
              size="sm"
              onClick={() => run(false)}
              disabled={busy || !whisperEnabled}
              title={
                !whisperEnabled
                  ? "Configurá OPENAI_API_KEY para generar subtítulos"
                  : undefined
              }
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : status === "failed" ? (
                <RotateCcw className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {status === "failed" ? "Reintentar" : "Generar subtítulos"}
            </Button>
          )}

          {(status === "auto" || status === "edited") && (
            <>
              <Button asChild size="sm" variant="soft">
                <Link href={editorHref}>
                  <Pencil className="h-3.5 w-3.5" /><span>Editar subtítulos</span>
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={regenerate}
                disabled={busy || !whisperEnabled}
                title="Volver a generar con IA"
              >
                <RotateCcw className="h-3.5 w-3.5" /><span>Regenerar</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Contextual help / status detail */}
      {status === "none" && (
        <p className="mt-2 text-xs text-charcoal-400">
          Generá subtítulos automáticos con IA. Después los podés editar línea
          por línea y elegir cómo se ven.
        </p>
      )}
      {status === "generating" && (
        <p className="mt-2 inline-flex items-center gap-2 text-xs text-mustard-600">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Transcribiendo el audio… puede tardar hasta ~1 minuto. No cierres esta
          página.
        </p>
      )}
      {status === "failed" && error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
      {!whisperEnabled && (status === "none" || status === "failed") && (
        <p className="mt-2 text-[11px] text-charcoal-400">
          Falta configurar <code className="font-mono">OPENAI_API_KEY</code>.
        </p>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-charcoal-100/60 bg-cream-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-mustard/15 text-mustard-600">
          <Captions className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-charcoal-600">
          Subtítulos
        </span>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: SubtitleStatus }) {
  const map: Record<
    SubtitleStatus,
    { label: string; tone: string; icon: React.ReactNode }
  > = {
    none: {
      label: "Sin generar",
      tone: "bg-charcoal-100 text-charcoal-400",
      icon: null,
    },
    generating: {
      label: "Generando",
      tone: "bg-mustard/15 text-mustard-600",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
    },
    auto: {
      label: "Listos",
      tone: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    edited: {
      label: "Editados",
      tone: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    failed: {
      label: "Error",
      tone: "bg-destructive/10 text-destructive",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        s.tone,
      )}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
