import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  const value = bytes / Math.pow(1024, i);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Coerce ANY thrown value into a human-readable string.
 *
 * Plain Error → its `.message`. Supabase errors (PostgrestError / StorageError)
 * and similar API errors are plain objects (NOT Error instances) with a
 * `.message`/`.error_description`/`.error` field — `String(obj)` on those
 * yields the useless "[object Object]". This drills into common shapes first
 * and only falls back to JSON so callers always surface something legible.
 */
export function toErrorMessage(err: unknown, fallback = "Error inesperado"): string {
  if (err == null) return fallback;
  if (typeof err === "string") return err || fallback;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "object") {
    const o = err as Record<string, unknown>;
    const candidate =
      o.message ?? o.error_description ?? o.error ?? o.msg ?? o.hint ?? o.details;
    if (typeof candidate === "string" && candidate) return candidate;
    try {
      const json = JSON.stringify(err);
      if (json && json !== "{}") return json;
    } catch {
      /* circular / non-serialisable — fall through */
    }
  }
  return fallback;
}

export function absoluteUrl(path: string = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://www.ponchospanish.com");
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
