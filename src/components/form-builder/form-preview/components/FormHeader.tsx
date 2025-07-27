// External libraries
import React from 'react';
// Types
import type { FormHeaderProps } from '../types';
// Internal components
import { EditableField } from './EditableField';

export function FormHeader({ schema, onFormSettingsUpdate }: FormHeaderProps) {
  const handleTitleUpdate = (title: string) => {
    onFormSettingsUpdate?.({ title: title || 'Untitled Form' });
  };

  const handleDescriptionUpdate = (description: string) => {
    onFormSettingsUpdate?.({ description });
  };

  return (
    <div className="flex flex-col gap-2">
      <EditableField
        className="flex min-h-[44px] items-center gap-2"
        disabled={!onFormSettingsUpdate}
        inputClassName="text-3xl font-bold bg-background w-full"
        onSave={handleTitleUpdate}
        placeholder="Click to add title..."
        value={schema.settings.title}
      >
        <h1 className="truncate font-bold text-3xl text-foreground">
          {schema.settings.title || 'Untitled Form'}
        </h1>
      </EditableField>

      <EditableField
        className="flex min-h-[28px] items-start gap-2"
        component="textarea"
        disabled={!onFormSettingsUpdate}
        inputClassName="bg-background w-full"
        onSave={handleDescriptionUpdate}
        placeholder="Click to add a description..."
        rows={Math.max(
          (schema.settings.description || '').split('\n').length || 1,
          1
        )}
        value={schema.settings.description || ''}
      >
        {schema.settings.description ? (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {schema.settings.description}
          </p>
        ) : onFormSettingsUpdate ? (
          <p className="text-muted-foreground italic">
            Click to add a description...
          </p>
        ) : null}
      </EditableField>
    </div>
  );
}
