import React from 'react';

// Components
import { Badge } from '@/components/ui/badge';

// Types
import type { FieldItemProps } from '../types';

export function FieldItem({
  field,
  isSelected,
  onFieldSelect,
}: FieldItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-ele transition-colors ${
        isSelected ? 'border border-primary/20 bg-primary/10' : 'bg-accent'
      }`}
      onClick={() => onFieldSelect(field.id)}
    >
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <Badge className="text-xs" variant="secondary">
            {field.type}
          </Badge>
          {field.required && <span className="text-destructive">*</span>}
        </div>
        <span className="font-medium text-sm">{field.label}</span>
      </div>
    </div>
  );
}
