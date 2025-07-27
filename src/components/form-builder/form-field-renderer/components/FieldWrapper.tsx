// External imports
import React from 'react';

// Component imports
import { Label } from '@/components/ui/label';
// Type imports
import type { FieldWrapperProps } from '../types';
// Utility imports
import { getWidthClass } from '../utils';

export function FieldWrapper({ field, error, children }: FieldWrapperProps) {
  const isStatement = field.type === 'statement';
  return (
    <div
      className={`flex flex-col gap-2 ${field.label ? '' : '-mt-2'} ${getWidthClass(field.settings?.width as any)}`}
    >
      {!isStatement && (
        <>
          <Label
            className="font-medium text-foreground text-sm"
            htmlFor={field.id}
          >
            {field.label && field.label.replace('*', '')}
            {field.label && field.required && (
              <span className="ml-1 text-destructive">*</span>
            )}
          </Label>
          {field.description && (
            <p className="text-muted-foreground text-sm">{field.description}</p>
          )}
        </>
      )}
      {children}
      {!isStatement && field.settings?.helpText && (
        <p className="text-muted-foreground text-xs">
          {field.settings.helpText}
        </p>
      )}
      {!isStatement && error && (
        <p className="flex items-start gap-1 text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
