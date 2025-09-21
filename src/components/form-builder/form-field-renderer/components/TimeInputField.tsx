"use client";

import * as React from "react";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import type { BaseFieldProps } from "../types";
import { applyBuilderMode, getBuilderMode } from "../utils";

export function TimeInputField(props: BaseFieldProps) {
  const { value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const showCurrentTimeButton =
    (value?.field?.settings?.showCurrentTimeButton ??
      value?.settings?.showCurrentTimeButton) === true;
  
  const timePickerProps = applyBuilderMode({
    className: cn("w-full", error && "rounded border border-red-500 p-2"),
    disabled,
    error: !!error,
    onChange,
    showCurrentTimeButton,
    value,
  }, builderMode);

  return (
    <div className={builderMode ? 'pointer-events-none' : ''}>
      <TimePicker {...timePickerProps} />
    </div>
  );
}
