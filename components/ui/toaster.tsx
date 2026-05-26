"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        closeButton: true,
        duration: 5000,
        classNames: {
          toast:
            "bg-cream-50 border border-charcoal-100/40 text-charcoal-500 shadow-soft-lg cursor-pointer",
          title: "font-semibold",
          description: "text-charcoal-400",
          closeButton:
            "bg-cream-50 border-charcoal-200 text-charcoal-500 hover:text-destructive",
        },
      }}
    />
  );
}
