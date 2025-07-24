"use client";

import * as React from "react";
import type { BaseFieldProps } from "../types";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";

export function TimeInputField({
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const showCurrentTimeButton =
    (value?.field?.settings?.showCurrentTimeButton ??
      value?.settings?.showCurrentTimeButton) === true;
  return (
    <TimePicker
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={!!error}
      className={cn("w-full", error && "border border-red-500 p-2 rounded")}
      showCurrentTimeButton={showCurrentTimeButton}
    />
  );
}
