"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "bg-cream-50 border border-charcoal-100/40 text-charcoal-500 shadow-soft-lg",
          title: "font-semibold",
          description: "text-charcoal-400",
        },
      }}
    />
  );
}
