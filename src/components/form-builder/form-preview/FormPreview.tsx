"use client";
import React from "react";

// Hooks
import { useFormPreviewState } from "./hooks";

// Components
import {
  FormHeader,
  MultiStepNavigation,
  StepHeader,
  FormFieldsContainer,
  FormActions,
} from "./components";

// Utilities
import { handleFormSubmit } from "./utils";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";

// Types
import type { FormPreviewProps } from "./types";

export function FormPreview({
  schema,
  selectedFieldId,
  selectedBlockId,
  onFieldSelect,
  onFieldsReorder,
  onFieldDelete,
  onFormSettingsUpdate,
  onBlockUpdate,
  onStepSelect,
  onAddField,
}: FormPreviewProps) {
  const {
    formData,
    currentStepIndex,
    isMultiStep,
    currentStep,
    currentStepFields,
    handleFieldValueChange,
    nextStep,
    goToStep,
    fieldVisibility,
  } = useFormPreviewState(schema, selectedBlockId);

  const { maxWidthClass, paddingClass, marginClass } =
    getFormLayoutClasses(schema);

  // Map borderRadius value to actual CSS value
  const borderRadiusValue = (() => {
    const val = schema.settings.layout?.borderRadius || "md";
    switch (val) {
      case "none":
        return "0px";
      case "sm":
        return "4px";
      case "md":
        return "8px";
      case "lg":
        return "16px";
      case "xl":
        return "24px";
      default:
        return "8px";
    }
  })();

  const handleNextStep = () => {
    const newIndex = nextStep();
    onStepSelect?.(newIndex);
  };

  const handleStepChange = (stepIndex: number) => {
    goToStep(stepIndex);
  };

  return (
    <div
      className={`min-h-full bg-background ${marginClass}`}
      style={
        {
          "--radius": borderRadiusValue,
          "--card-radius": borderRadiusValue,
        } as React.CSSProperties
      }
    >
      <div
        className={`${maxWidthClass} mx-auto flex flex-col gap-6 ${paddingClass}`}
      >
        <FormHeader
          schema={schema}
          onFormSettingsUpdate={onFormSettingsUpdate}
        />

        {isMultiStep && (
          <MultiStepNavigation
            schema={schema}
            currentStepIndex={currentStepIndex}
            onStepSelect={onStepSelect}
            onStepChange={handleStepChange}
          />
        )}

        {isMultiStep && currentStep && (
          <StepHeader
            currentStep={currentStep}
            currentStepIndex={currentStepIndex}
            onBlockUpdate={onBlockUpdate}
          />
        )}

        <form
          onSubmit={(e) => handleFormSubmit(e, formData)}
          className="flex flex-col gap-6"
        >
          <FormFieldsContainer
            fields={currentStepFields}
            selectedFieldId={selectedFieldId}
            formData={formData}
            onFieldSelect={onFieldSelect}
            onFieldsReorder={onFieldsReorder}
            onFieldDelete={onFieldDelete}
            onFieldValueChange={handleFieldValueChange}
            isMultiStep={isMultiStep}
            onAddField={onAddField}
            fieldVisibility={fieldVisibility}
            showLogicCues={true}
          />

          <FormActions
            schema={schema}
            currentStepIndex={currentStepIndex}
            fieldsLength={currentStepFields.length}
            isMultiStep={isMultiStep}
            onNextStep={handleNextStep}
          />
        </form>
      </div>
    </div>
  );
}
