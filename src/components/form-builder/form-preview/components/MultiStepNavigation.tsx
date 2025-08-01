import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import type { MultiStepNavigationProps } from '../types';

export function MultiStepNavigation({
  schema,
  currentStepIndex,
  onStepSelect,
  onStepChange,
}: MultiStepNavigationProps) {
  if (!schema.blocks || schema.blocks.length <= 1) {
    return null;
  }

  const handlePrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      onStepChange(prevIndex);
      onStepSelect?.(prevIndex);
    }
  };

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < schema.blocks.length) {
      onStepChange(nextIndex);
      onStepSelect?.(nextIndex);
    }
  };

  const handleStepClick = (index: number) => {
    onStepChange(index);
    onStepSelect?.(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-2 flex-1 overflow-hidden rounded-card bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / schema.blocks.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          className="flex items-center gap-2"
          disabled={currentStepIndex === 0}
          onClick={handlePrevStep}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {schema.blocks.map((_, index) => (
            <button
              className={`h-8 w-8 rounded-card font-medium text-sm transition-colors ${
                index === currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStepIndex
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              key={index}
              onClick={() => handleStepClick(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button
          className="flex items-center gap-2"
          disabled={currentStepIndex === schema.blocks.length - 1}
          onClick={handleNextStep}
          variant="outline"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
