// External libraries
import React from "react";

// UI components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Internal components
import { EditableField } from "./EditableField";

// Types
import type { StepHeaderProps } from "../types";

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
    <Card className="bg-accent/5 border-accent/20 p-6">
      <EditableField
        value={currentStep.title}
        placeholder="Click to add step title..."
        onSave={handleTitleUpdate}
        disabled={!onBlockUpdate}
        className="flex items-center gap-2 mb-3 min-h-[32px]"
        inputClassName="text-xl font-semibold bg-background w-full"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            {currentStep.title}
          </h2>
          <Badge variant="secondary" className="text-xs">
            Step {currentStepIndex + 1}
          </Badge>
        </div>
      </EditableField>

      <EditableField
        value={currentStep.description || ""}
        placeholder="Click to add a step description..."
        onSave={handleDescriptionUpdate}
        disabled={!onBlockUpdate}
        component="textarea"
        rows={2}
        className="flex items-start gap-2 min-h-[24px]"
        inputClassName="bg-background min-h-[60px] w-full"
      >
        {currentStep.description ? (
          <p className="text-muted-foreground whitespace-pre-wrap">
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
