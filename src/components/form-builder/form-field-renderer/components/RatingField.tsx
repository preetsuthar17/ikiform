import { Heart, Star } from "lucide-react";
import type React from "react";
import { useRef } from "react";

import type { BaseFieldProps } from "../types";

const RATING_ICONS: Record<string, React.ElementType> = {
  star: Star,
  heart: Heart,
};

const DEFAULT_RATING_COUNT = 5;
const DEFAULT_ICON_TYPE = "star";
const DEFAULT_ICON_COLOR = "#fbbf24";
const DEFAULT_ICON_SIZE = 28;

export function RatingField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const getRatingCount = () =>
    field.settings?.starCount || DEFAULT_RATING_COUNT;

  const getIconType = () => field.settings?.icon || DEFAULT_ICON_TYPE;

  const getIconColor = () => field.settings?.color || DEFAULT_ICON_COLOR;

  const getIconSize = () => field.settings?.starSize || DEFAULT_ICON_SIZE;

  const getIconComponent = () => {
    const iconType = getIconType();
    return RATING_ICONS[iconType] || Star;
  };

  const handleRatingClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const isRatingActive = (index: number) => value && value > index;

  const getIconClassName = (index: number) =>
    isRatingActive(index)
      ? "transition-colors"
      : "opacity-60 transition-colors";

  const getIconFill = (index: number) =>
    isRatingActive(index) ? getIconColor() : "none";

  const renderRatingIcons = () => {
    const IconComponent = getIconComponent();
    const ratingCount = getRatingCount();
    const iconColor = getIconColor();
    const iconSize = getIconSize();
    const itemRefs = useRef<HTMLButtonElement[]>([]);

    const getTabIndex = (i: number) => {
      if (!value) return i === 0 ? 0 : -1;
      return value === i + 1 ? 0 : -1;
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (disabled) return;
      const count = ratingCount;
      const current = typeof value === "number" && value > 0 ? value : 0;
      let next = current;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        next = Math.min(count, (current || 0) + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        next = Math.max(1, (current || 1) - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 1;
      } else if (e.key === "End") {
        e.preventDefault();
        next = count;
      } else if (e.key === "Escape") {
        e.currentTarget.blur();
        return;
      }
      if (next !== current) {
        onChange(next);
        const targetIndex = next - 1;
        itemRefs.current[targetIndex]?.focus();
      }
    };

    return (
      <div
        aria-disabled={disabled || undefined}
        aria-label="Rating"
        className="flex items-center gap-1"
        onKeyDown={handleKeyDown}
        role="radiogroup"
      >
        {Array.from({ length: ratingCount }).map((_, index) => (
          <button
            aria-checked={isRatingActive(index)}
            aria-label={`Rate ${index + 1} ${getIconType()}`}
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            disabled={disabled}
            key={index}
            onClick={() => handleRatingClick(index + 1)}
            ref={(el) => {
              if (el) itemRefs.current[index] = el;
            }}
            role="radio"
            tabIndex={getTabIndex(index)}
            type="button"
          >
            <IconComponent
              className={getIconClassName(index)}
              fill={getIconFill(index)}
              size={iconSize}
              stroke={iconColor}
            />
          </button>
        ))}
      </div>
    );
  };

  return <div className="flex flex-col gap-3">{renderRatingIcons()}</div>;
}
