import React from "react";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/lib";

import type { BaseFieldProps } from "../types";

import { getBaseClasses } from "../utils";

export function getLivePatternError(field: FormField, value: string) {
  if (
    field?.validation?.pattern &&
    value &&
    !(() => {
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
        className={`flex gap-2 ${baseClasses}`}
        disabled={disabled}
        id={field.id}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        ref={fieldRef}
        type="text"
        value={value || ""}
      />
      {livePatternError && (
        <div className="mt-1 text-destructive text-xs">{livePatternError}</div>
      )}
    </>
  );
}
