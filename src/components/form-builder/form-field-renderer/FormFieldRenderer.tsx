// External libraries
import React from 'react';

// Internal components
import { FieldWrapper } from './components';
// Types
import type { FormFieldRendererProps } from './types';
// Utilities
import { createFieldComponent } from './utils';

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
  fieldRef,
  disabled,
}: FormFieldRendererProps) {
  return (
    <FieldWrapper error={error} field={field}>
      {createFieldComponent(field, value, onChange, error, fieldRef, disabled)}
    </FieldWrapper>
  );
}
