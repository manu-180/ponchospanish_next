import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[120px] w-full rounded-md border border-charcoal-100 bg-cream-50 px-4 py-3 text-base text-charcoal-500 transition-colors placeholder:text-charcoal-300 focus-visible:outline-none focus-visible:border-mustard focus-visible:ring-2 focus-visible:ring-mustard/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          invalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
