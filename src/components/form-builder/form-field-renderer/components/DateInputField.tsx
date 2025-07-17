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
  return (
    <Input
      type="date"
      id={field.id}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={baseClasses}
      disabled={disabled}
    />
  );
}
