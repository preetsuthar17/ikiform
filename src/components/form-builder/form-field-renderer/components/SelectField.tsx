// External imports
import React from "react";

// Component imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility imports
import { getErrorClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function SelectField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorClasses = getErrorClasses(error);

  return (
    <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`flex gap-2 ${errorClasses}`}
        disabled={disabled}
      >
        <SelectValue placeholder={field.placeholder || "Select an option..."} />
      </SelectTrigger>
      <SelectContent>
        {field.options?.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
