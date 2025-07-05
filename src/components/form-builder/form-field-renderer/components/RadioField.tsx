// External imports
import React from "react";

// Component imports
import { RadioGroup, RadioItem } from "@/components/ui/radio";

// Utility imports
import { getErrorRingClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function RadioField({ field, value, onChange, error }: BaseFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);

  return (
    <RadioGroup
      value={value || ""}
      onValueChange={onChange}
      className={`flex gap-2 ${errorRingClasses}`}
    >
      {field.options?.map((option, index) => (
        <RadioItem
          key={index}
          value={option}
          id={`${field.id}-${index}`}
          label={option}
        />
      ))}
    </RadioGroup>
  );
}
