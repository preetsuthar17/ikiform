import React from 'react';

import { FieldWrapper } from './components';

import type { FormFieldRendererProps } from './types';

import { createFieldComponent } from './utils';

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
  fieldRef,
  disabled,
  formId,
}: FormFieldRendererProps) {
  return (
    <FieldWrapper error={error} field={field}>
      {createFieldComponent(
        field,
        value,
        onChange,
        error,
        fieldRef,
        disabled,
        formId
      )}
    </FieldWrapper>
  );
}
