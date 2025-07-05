"use client";

import React from "react";

// UI Components
import { Card } from "@/components/ui/card";

// Types
import type { MultiStepFormProps } from "./multi-step-form/types";

// Hooks
import { useFormNavigation, useFormState } from "./multi-step-form/hooks";

// Utilities
import { processFormBlocks, calculateProgress } from "./multi-step-form/utils";

// Form Components
import {
  SuccessScreen,
  FormProgress,
  FormContent,
  FormNavigation,
  FormFooter,
} from "./multi-step-form/components";

export function MultiStepForm({ formId, schema }: MultiStepFormProps) {
  const blocks = processFormBlocks(schema);
  const totalSteps = blocks.length;

  const formState = useFormState(formId, schema, blocks);
  const { currentStep, formData, errors, submitting, submitted } = formState;
  const { handleNext, handlePrevious, handleSubmit, handleFieldValueChange } =
    formState;

  const currentBlock = blocks[currentStep];
  const progress = calculateProgress(currentStep, totalSteps);

  useFormNavigation({
    currentStep,
    totalSteps,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSubmit: handleSubmit,
  });

  if (submitted) {
    return <SuccessScreen schema={schema} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center w-full">
      <div className="max-w-2xl mx-auto flex flex-col gap-8 w-full">
        <FormProgress
          progress={progress}
          totalSteps={totalSteps}
          showProgress={schema.settings.showProgress !== false}
        />

        <Card
          className="rounded-card flex flex-col gap-6"
          style={{ padding: "2rem" }}
        >
          <FormContent
            currentBlock={currentBlock}
            formData={formData}
            errors={errors}
            onFieldValueChange={handleFieldValueChange}
            title={schema.settings.title}
            description={schema.settings.description}
          />

          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            submitting={submitting}
            onNext={handleNext}
            onPrevious={handlePrevious}
            schema={schema}
          />
        </Card>

        <FormFooter />
      </div>
    </div>
  );
}
