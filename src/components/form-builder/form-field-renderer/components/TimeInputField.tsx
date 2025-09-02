"use client";

import * as React from "react";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import type { BaseFieldProps } from "../types";

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
      className={cn("w-full", error && "rounded border border-red-500 p-2")}
      disabled={disabled}
      error={!!error}
      onChange={onChange}
      showCurrentTimeButton={showCurrentTimeButton}
      value={value}
    />
  );
}
