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

export function SelectField({ field, value, onChange, error }: BaseFieldProps) {
  const errorClasses = getErrorClasses(error);

  return (
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className={`flex gap-2 ${errorClasses}`}>
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
