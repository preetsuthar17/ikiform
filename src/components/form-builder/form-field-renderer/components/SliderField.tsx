import React from 'react';

import { Slider } from '@/components/ui/slider';

import type { BaseFieldProps } from '../types';

import { getErrorRingClasses } from '../utils';

export function SliderField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);

  return (
    <Slider
      className={`flex gap-2 ${errorRingClasses}`}
      disabled={disabled}
      max={field.settings?.max || 100}
      min={field.settings?.min || 0}
      onValueChange={(values) => onChange(values[0])}
      showValue
      step={field.settings?.step || 1}
      value={[value || field.settings?.defaultValue || 0]}
    />
  );
}
