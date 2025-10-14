import { FieldWrapper } from "./components";

import type { FormFieldRendererProps } from "./types";

import { createFieldComponent } from "./utils";

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
  fieldRef,
  disabled,
  formId,
  builderMode = false,
}: FormFieldRendererProps) {
  return (
    <FieldWrapper builderMode={builderMode} error={error} field={field}>
      {createFieldComponent(
        field,
        value,
        onChange,
        error,
        fieldRef,
        disabled,
        formId,
        builderMode
      )}
    </FieldWrapper>
  );
}
