"use client";
import type React from "react";
import { getFormLayoutClasses } from "@/lib/utils/form-layout";

import {
  FormActions,
  FormFieldsContainer,
  FormHeader,
  MultiStepNavigation,
  StepHeader,
} from "./components";

import { useFormPreviewState } from "./hooks";

import type { FormPreviewProps } from "./types";

import { handleFormSubmit } from "./utils";

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
  onBlockAdd,
  onBlockDelete,
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
          onFormSettingsUpdate={onFormSettingsUpdate}
          schema={schema}
        />

        {isMultiStep && (
          <MultiStepNavigation
            currentStepIndex={currentStepIndex}
            onBlockAdd={onBlockAdd}
            onBlockDelete={onBlockDelete}
            onStepChange={handleStepChange}
            onStepSelect={onStepSelect}
            schema={schema}
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
          className="flex flex-col gap-6"
          onSubmit={(e) => handleFormSubmit(e, formData)}
        >
          <FormFieldsContainer
            fields={currentStepFields}
            fieldVisibility={fieldVisibility}
            formData={formData}
            isMultiStep={isMultiStep}
            onAddField={onAddField}
            onFieldDelete={onFieldDelete}
            onFieldSelect={onFieldSelect}
            onFieldsReorder={onFieldsReorder}
            onFieldValueChange={handleFieldValueChange}
            selectedFieldId={selectedFieldId}
            showLogicCues={true}
          />

          <FormActions
            currentStepIndex={currentStepIndex}
            fieldsLength={currentStepFields.length}
            isMultiStep={isMultiStep}
            onNextStep={handleNextStep}
            schema={schema}
          />
        </form>
      </div>
    </div>
  );
}
