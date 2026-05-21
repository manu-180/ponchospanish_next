import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-mustard/15 text-mustard-600 border border-mustard/30",
        terracotta:
          "bg-terracotta/15 text-terracotta-500 border border-terracotta/30",
        muted: "bg-charcoal-100 text-charcoal-500 border border-charcoal-200",
        success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        outline: "border border-charcoal-300 text-charcoal-500",
        free: "bg-emerald-500 text-white border border-emerald-600",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
