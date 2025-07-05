// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";

// Utility imports
import { getBaseClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function NumberInputField({
  field,
  value,
  onChange,
  error,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  return (
    <Input
      type="number"
      id={field.id}
      placeholder={field.placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      min={field.validation?.min}
      max={field.validation?.max}
      className={`flex gap-2 ${baseClasses}`}
    />
  );
}
