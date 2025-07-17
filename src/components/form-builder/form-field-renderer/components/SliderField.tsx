// External imports
import React from "react";

// Component imports
import { Slider } from "@/components/ui/slider";

// Utility imports
import { getErrorRingClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

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
      value={[value || field.settings?.defaultValue || 0]}
      onValueChange={(values) => onChange(values[0])}
      min={field.settings?.min || 0}
      max={field.settings?.max || 100}
      step={field.settings?.step || 1}
      className={`flex gap-2 ${errorRingClasses}`}
      showValue
      disabled={disabled}
    />
  );
}
