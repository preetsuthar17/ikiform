import type React from "react";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/lib";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

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

export function TextInputField(props: BaseFieldProps) {
  const { field, value, onChange, error, fieldRef, disabled } = props;
  const baseClasses = getBaseClasses(field, error);
  const livePatternError = getLivePatternError(field, value);
  const builderMode = getBuilderMode(props);

  const inputProps = applyBuilderMode(
    {
      className: `flex gap-2 ${baseClasses}`,
      disabled,
      id: field.id,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value),
      placeholder: field.placeholder,
      ref: fieldRef,
      type: "text",
      value: value || "",
    },
    builderMode
  );

  return (
    <>
      <Input {...inputProps} />
      {livePatternError && (
        <div className="mt-1 text-destructive text-xs">{livePatternError}</div>
      )}
    </>
  );
}
