// External imports
import React from "react";

// Component imports
import { Textarea } from "@/components/ui/textarea";

// Utility imports
import { getBaseClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function TextareaField({
  field,
  value,
  onChange,
  error,
  fieldRef,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  return (
    <Textarea
      id={field.id}
      placeholder={field.placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={field.settings?.rows || 4}
      className={`flex gap-2 ${baseClasses}`}
      ref={fieldRef}
    />
  );
}
