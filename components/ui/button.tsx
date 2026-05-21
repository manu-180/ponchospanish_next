import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2 focus-visible:ring-offset-background tracking-wide [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-mustard text-white hover:bg-mustard-500 active:bg-mustard-600 shadow-soft hover:shadow-glow",
        terracotta:
          "bg-terracotta text-white hover:bg-terracotta-400 active:bg-terracotta-500 shadow-soft hover:shadow-glow-terracotta",
        outline:
          "border-2 border-mustard text-mustard hover:bg-mustard hover:text-white",
        ghost:
          "text-charcoal-500 hover:text-charcoal-600 hover:bg-charcoal-100/50",
        link: "text-mustard underline-offset-4 hover:underline",
        secondary:
          "bg-charcoal-500 text-cream hover:bg-charcoal-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
        soft:
          "bg-cream-50 text-charcoal-500 border border-charcoal-100/50 hover:bg-cream-100 hover:border-mustard/40",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
        pill: "h-12 px-8 rounded-full",
        "pill-lg": "h-14 px-10 rounded-full text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
