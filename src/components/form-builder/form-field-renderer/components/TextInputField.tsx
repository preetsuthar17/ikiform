// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";

// Utility imports
import { getBaseClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function getLivePatternError(field, value) {
  if (
    field?.validation?.pattern &&
    value &&
    !(function () {
      try {
        return new RegExp(field.validation.pattern).test(value);
      } catch {
        return false;
      }
    })()
  ) {
    return field.validation?.patternMessage || "Invalid format";
  }
  return "";
}

export function TextInputField({
  field,
  value,
  onChange,
  error,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);
  const livePatternError = getLivePatternError(field, value);

  return (
    <>
      <Input
        type="text"
        id={field.id}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`flex gap-2 ${baseClasses}`}
      />
      {livePatternError && (
        <div className="text-destructive text-xs mt-1">{livePatternError}</div>
      )}
    </>
  );
}
