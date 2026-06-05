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
  Download,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export interface LessonResource {
  id: string;
  title: string;
  description: string | null;
  kind: ResourceKind;
  /** Resolved signed URL for files, null for links */
  resolvedUrl: string | null;
  /** External URL for link resources */
  url: string | null;
  file_size_bytes: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number | null): string | null {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const KIND_META: Record<
  ResourceKind,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    accentBorder: string;
    label: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  pdf: {
    icon: FileText,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accentBorder: "border-l-red-400",
    label: "PDF",
    badgeBg: "bg-red-50",
    badgeText: "text-red-600",
  },
  link: {
    icon: Link2,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    accentBorder: "border-l-sky-400",
    label: "Link",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-600",
  },
  zip: {
    icon: Archive,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    accentBorder: "border-l-amber-400",
    label: "ZIP",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
  },
  audio: {
    icon: Music,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    accentBorder: "border-l-violet-400",
    label: "Audio",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-600",
  },
  video: {
    icon: Video,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    accentBorder: "border-l-blue-400",
    label: "Video",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
  },
  image: {
    icon: Image,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    accentBorder: "border-l-green-400",
    label: "Imagen",
    badgeBg: "bg-green-50",
    badgeText: "text-green-600",
  },
  doc: {
    icon: FileText,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    accentBorder: "border-l-indigo-400",
    label: "Doc",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-600",
  },
  spreadsheet: {
    icon: Sheet,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accentBorder: "border-l-emerald-400",
    label: "Planilla",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
  },
  presentation: {
    icon: Presentation,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    accentBorder: "border-l-orange-400",
    label: "Presentación",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-600",
  },
  other: {
    icon: File,
    iconBg: "bg-charcoal-50",
    iconColor: "text-charcoal-500",
    accentBorder: "border-l-charcoal-300",
    label: "Archivo",
    badgeBg: "bg-charcoal-50",
    badgeText: "text-charcoal-500",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonResources({ resources }: { resources: LessonResource[] }) {
  if (resources.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-serif text-display-sm text-charcoal-800">
          Lesson Resources
        </h3>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-charcoal-100 px-2 text-xs font-semibold text-charcoal-500">
          {resources.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}

function ResourceCard({ resource }: { resource: LessonResource }) {
  const meta = KIND_META[resource.kind] ?? KIND_META.other;
  const Icon = meta.icon;
  const size = formatBytes(resource.file_size_bytes);
  const href = resource.resolvedUrl ?? resource.url ?? "#";
  const isLink = resource.kind === "link";

  return (
    <a
      href={href}
      target={isLink ? "_blank" : "_self"}
      rel={isLink ? "noopener noreferrer" : undefined}
      download={!isLink ? resource.title : undefined}
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl border border-charcoal-100/80 bg-white p-4",
        "border-l-4 transition-all duration-200",
        "hover:shadow-soft hover:-translate-y-0.5 hover:border-charcoal-100",
        meta.accentBorder,
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          meta.iconBg,
          meta.iconColor,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-semibold text-charcoal-800 leading-snug">
          {resource.title}
        </p>

        {resource.description && (
          <p className="text-xs text-charcoal-400 leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-0.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              meta.badgeBg,
              meta.badgeText,
            )}
          >
            {meta.label}
          </span>
          {size && (
            <span className="text-[10px] text-charcoal-400">{size}</span>
          )}
        </div>
      </div>

      {/* Action icon */}
      <span className="shrink-0 mt-0.5 text-charcoal-300 transition-colors group-hover:text-charcoal-500">
        {isLink ? (
          <ExternalLink className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </span>
    </a>
  );
}
