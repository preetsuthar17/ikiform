// External imports
import React from 'react';

// Component imports
import { TagInput } from '@/components/ui/tag-input';
// Type imports
import type { BaseFieldProps } from '../types';
// Utility imports
import { getErrorClasses } from '../utils';

export function TagsField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorClasses = getErrorClasses(error);

  // Ensure value is always an array
  const tags = Array.isArray(value) ? value : [];

  return (
    <TagInput
      allowDuplicates={field.settings?.allowDuplicates}
      className={`flex gap-2 ${errorClasses}`}
      disabled={disabled}
      maxTags={field.settings?.maxTags}
      onTagsChange={onChange}
      placeholder={field.placeholder || 'Type and press Enter...'}
      tagSize="sm"
      tags={tags}
      tagVariant="default"
    />
  );
}
