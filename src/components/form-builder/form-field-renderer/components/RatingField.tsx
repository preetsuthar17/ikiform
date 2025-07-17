import React from "react";
import type { BaseFieldProps } from "../types";
import { Star, Heart } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  star: Star,
  heart: Heart,
};

export function RatingField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const starCount = field.settings?.starCount || 5;
  const iconType = field.settings?.icon || "star";
  const color = field.settings?.color || "#fbbf24";
  const starSize = field.settings?.starSize || 28;
  const Icon = ICONS[iconType] || Star;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: starCount }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(idx + 1)}
            className="focus:outline-none"
            aria-label={`Rate ${idx + 1} ${iconType}`}
            disabled={disabled}
          >
            <Icon
              size={starSize}
              fill={value && value > idx ? color : "none"}
              stroke={color}
              className={
                value && value > idx
                  ? "transition-colors"
                  : "opacity-60 transition-colors"
              }
            />
          </button>
        ))}
      </div>
      {error && <div className="text-destructive text-xs">{error}</div>}
    </div>
  );
}
