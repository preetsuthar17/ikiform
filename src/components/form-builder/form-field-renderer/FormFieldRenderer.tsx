// External libraries
import React from "react";

// Internal components
import { FieldWrapper } from "./components";

// Utilities
import { createFieldComponent } from "./utils";

// Types
import type { FormFieldRendererProps } from "./types";

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
}: FormFieldRendererProps) {
  return (
    <FieldWrapper field={field} error={error}>
      {createFieldComponent(field, value, onChange, error)}
    </FieldWrapper>
  );
}
