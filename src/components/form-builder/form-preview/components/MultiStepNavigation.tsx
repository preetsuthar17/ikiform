// External libraries
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";

// Types
import type { MultiStepNavigationProps } from "../types";

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
        <div className="flex-1 bg-muted rounded-card h-2 overflow-hidden">
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
          variant="outline"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {schema.blocks.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-8 h-8 rounded-card text-sm font-medium transition-colors ${
                index === currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : index < currentStepIndex
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleNextStep}
          disabled={currentStepIndex === schema.blocks.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
