import { cn } from "@/lib/utils";

/**
 * Premium skeleton block.
 *
 * Base tone sits on the brand cream/charcoal palette (never flat grey) and a
 * soft light beam sweeps across it. Respects `prefers-reduced-motion` via the
 * `motion-reduce:before:hidden` utility so it degrades to a calm static block.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-charcoal-100/50",
        "before:absolute before:inset-0 before:-translate-x-full before:content-['']",
        "before:animate-shimmer-sweep before:bg-gradient-to-r",
        "before:from-transparent before:via-cream-50/80 before:to-transparent",
        "motion-reduce:before:hidden motion-reduce:animate-pulse-soft",
        className,
      )}
      {...props}
    />
  );
}

/** A run of text lines with a slightly shorter last line. */
function SkeletonText({
  lines = 3,
  className,
  lineClassName,
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 rounded-full",
            i === lines - 1 ? "w-2/3" : "w-full",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText };
