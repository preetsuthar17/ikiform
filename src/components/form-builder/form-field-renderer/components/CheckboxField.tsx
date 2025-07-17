// External imports
import React from "react";

// Component imports
import { Checkbox } from "@/components/ui/checkbox";

// Type imports
import type { BaseFieldProps } from "../types";

export function CheckboxField({
  field,
  value,
  onChange,
  disabled,
}: BaseFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {field.options?.map((option, index) => (
        <Checkbox
          key={index}
          id={`${field.id}-${index}`}
          label={option}
          checked={(value || []).includes(option)}
          onCheckedChange={(checked) => {
            const currentValues = value || [];
            if (checked) {
              onChange([...currentValues, option]);
            } else {
              onChange(currentValues.filter((v: string) => v !== option));
            }
          }}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
