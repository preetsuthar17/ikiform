import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BaseFieldProps } from "../types";
import { getBaseClasses } from "../utils";
import { parseDate } from "yeezy-dates";

export function DateInputField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);
  // Convert string value to Date for DatePicker (assume value is ISO string)
  const dateValue = value ? new Date(value) : undefined;
  return (
    <DatePicker
      value={dateValue}
      onChange={(date) => {
        // Convert Date object back to string (ISO format)
        onChange(date ? date.toISOString().slice(0, 10) : "");
      }}
      className={baseClasses}
      disabled={disabled}
      placeholder={field.placeholder || "Pick a date"}
    />
  );
}
