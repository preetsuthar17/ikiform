// External imports
import React from 'react';

// Component imports
import { Textarea } from '@/components/ui/textarea';
// Type imports
import type { BaseFieldProps } from '../types';
// Utility imports
import { getBaseClasses } from '../utils';

export function TextareaField({
  field,
  value,
  onChange,
  error,
  fieldRef,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  return (
    <Textarea
      className={`flex gap-2 ${baseClasses}`}
      disabled={disabled}
      id={field.id}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      ref={fieldRef}
      rows={field.settings?.rows || 4}
      value={value || ''}
    />
  );
}
