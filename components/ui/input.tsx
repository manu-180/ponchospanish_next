import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-md border border-charcoal-100 bg-cream-50 px-4 py-2 text-base text-charcoal-500 transition-colors placeholder:text-charcoal-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-charcoal-500 focus-visible:outline-none focus-visible:border-mustard focus-visible:ring-2 focus-visible:ring-mustard/30 disabled:cursor-not-allowed disabled:opacity-50",
          invalid &&
            "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
