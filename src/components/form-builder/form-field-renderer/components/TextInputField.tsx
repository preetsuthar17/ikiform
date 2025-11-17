import type React from "react";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/lib";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

import { safeRegexTest } from "@/lib/utils/safe-regex";

export function getLivePatternError(field: FormField, value: string) {
  if (
    field?.validation?.pattern &&
    value &&
    !safeRegexTest(field.validation.pattern, value)
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
      className: baseClasses,
      disabled,
      id: field.id,
      name: field.id,
      autoComplete: "off",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          e.currentTarget.blur();
        }
      },
      placeholder: field.placeholder,
      ref: fieldRef,
      type: "text",
      value: value || "",
    },
    builderMode
  );

  return (
    <div className="flex flex-col gap-2">
      <Input {...inputProps} />
      {livePatternError && (
        <div
          aria-live="polite"
          className="text-destructive text-xs"
          role="alert"
        >
          {livePatternError}
        </div>
      )}
    </div>
  );
}
