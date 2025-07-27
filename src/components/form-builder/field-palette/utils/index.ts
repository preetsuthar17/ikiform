// Types
import type { FormField } from '@/lib/database';
// Constants
import { FIELD_TYPES } from '../constants';
import type { FieldTypeConfig } from '../types';

export const getFieldTypeConfig = (
  type: FormField['type']
): FieldTypeConfig | undefined =>
  FIELD_TYPES.find((fieldType) => fieldType.type === type);

export const getAllFieldTypes = (): FormField['type'][] =>
  FIELD_TYPES.map((fieldType) => fieldType.type);

export const getFieldTypesByCategory = (
  category: 'input' | 'selection' | 'special'
) => {
  const categories = {
    input: ['text', 'email', 'textarea', 'number'],
    selection: ['select', 'radio', 'checkbox'],
    special: ['slider', 'tags', 'social'],
  };

  return FIELD_TYPES.filter((field) =>
    categories[category]?.includes(field.type)
  );
};
