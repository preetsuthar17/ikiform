// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";

// Utility imports
import { getBaseClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";
import { FormField } from "@/lib";

export function getLivePatternError(field: FormField, value: string) {
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
  fieldRef,
  disabled,
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
        ref={fieldRef}
        disabled={disabled}
      />
      {livePatternError && (
        <div className="text-destructive text-xs mt-1">{livePatternError}</div>
      )}
    </>
  );
}
