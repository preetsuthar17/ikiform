import { Heart, Star } from 'lucide-react';
import type React from 'react';
import type { BaseFieldProps } from '../types';

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
  const iconType = field.settings?.icon || 'star';
  const color = field.settings?.color || '#fbbf24';
  const starSize = field.settings?.starSize || 28;
  const Icon = ICONS[iconType] || Star;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: starCount }).map((_, idx) => (
          <button
            aria-label={`Rate ${idx + 1} ${iconType}`}
            className="focus:outline-none"
            disabled={disabled}
            key={idx}
            onClick={() => onChange(idx + 1)}
            type="button"
          >
            <Icon
              className={
                value && value > idx
                  ? 'transition-colors'
                  : 'opacity-60 transition-colors'
              }
              fill={value && value > idx ? color : 'none'}
              size={starSize}
              stroke={color}
            />
          </button>
        ))}
      </div>
      {error && <div className="text-destructive text-xs">{error}</div>}
    </div>
  );
}
