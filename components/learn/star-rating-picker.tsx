"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent!",
};

interface StarRatingPickerProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRatingPicker({
  value,
  onChange,
  disabled,
  size = "lg",
}: StarRatingPickerProps) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  const sizeClass = { sm: "h-5 w-5", md: "h-7 w-7", lg: "h-9 w-9" }[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex gap-1"
        role="group"
        aria-label="Star rating"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className={cn(
              "p-0.5 transition-all duration-100",
              "hover:scale-110 active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard/50 rounded",
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-pressed={value === star}
          >
            <Star
              className={cn(
                sizeClass,
                "transition-all duration-100",
                star <= active
                  ? "fill-mustard text-mustard drop-shadow-sm"
                  : "fill-none text-charcoal-200",
              )}
            />
          </button>
        ))}
      </div>
      <span
        className={cn(
          "text-sm font-semibold text-mustard-600 transition-all duration-150 h-5",
          active > 0 ? "opacity-100" : "opacity-0",
        )}
        aria-live="polite"
      >
        {active > 0 ? LABELS[active] : ""}
      </span>
    </div>
  );
}

interface StarDisplayProps {
  rating: number;
  size?: "xs" | "sm";
  showLabel?: boolean;
}

export function StarDisplay({ rating, size = "sm", showLabel }: StarDisplayProps) {
  const sizeClass = size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating
                ? "fill-mustard text-mustard"
                : "fill-none text-charcoal-200",
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-xs text-charcoal-500 font-medium">{rating}/5</span>
      )}
    </div>
  );
}
