import React from 'react';

import { Input } from '@/components/ui/input';

import type { BaseFieldProps } from '../types';

import { getBaseClasses } from '../utils';

export function NumberInputField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  return (
    <Input
      className={`flex gap-2 ${baseClasses}`}
      disabled={disabled}
      id={field.id}
      max={field.validation?.max}
      min={field.validation?.min}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      type="number"
      value={value || ''}
    />
  );
}
