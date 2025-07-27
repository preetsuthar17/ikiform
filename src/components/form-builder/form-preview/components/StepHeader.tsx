// External libraries
import React from 'react';
import { Badge } from '@/components/ui/badge';
// UI components
import { Card } from '@/components/ui/card';
// Types
import type { StepHeaderProps } from '../types';
// Internal components
import { EditableField } from './EditableField';

export function StepHeader({
  currentStep,
  currentStepIndex,
  onBlockUpdate,
}: StepHeaderProps) {
  const handleTitleUpdate = (title: string) => {
    onBlockUpdate?.(currentStep.id, { title });
  };

  const handleDescriptionUpdate = (description: string) => {
    onBlockUpdate?.(currentStep.id, { description });
  };

  return (
    <Card className="border-accent/20 bg-accent/5 p-6">
      <EditableField
        className="mb-3 flex min-h-[32px] items-center gap-2"
        disabled={!onBlockUpdate}
        inputClassName="text-xl font-semibold bg-background w-full"
        onSave={handleTitleUpdate}
        placeholder="Click to add step title..."
        value={currentStep.title}
      >
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground text-xl">
            {currentStep.title}
          </h2>
          <Badge className="text-xs" variant="secondary">
            Step {currentStepIndex + 1}
          </Badge>
        </div>
      </EditableField>

      <EditableField
        className="flex min-h-[24px] items-start gap-2"
        component="textarea"
        disabled={!onBlockUpdate}
        inputClassName="bg-background min-h-[60px] w-full"
        onSave={handleDescriptionUpdate}
        placeholder="Click to add a step description..."
        rows={2}
        value={currentStep.description || ''}
      >
        {currentStep.description ? (
          <p className="whitespace-pre-wrap text-muted-foreground">
            {currentStep.description}
          </p>
        ) : onBlockUpdate ? (
          <p className="text-muted-foreground italic">
            Click to add a step description...
          </p>
        ) : null}
      </EditableField>
    </Card>
  );
}
