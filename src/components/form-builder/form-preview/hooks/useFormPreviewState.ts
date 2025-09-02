import { useEffect, useRef, useState } from "react";

import type { FormField, FormSchema } from "@/lib/database";

const getDefaultValueForField = (field: FormField): any => {
  switch (field.type) {
    case "tags":
      return [];
    case "checkbox":
      return [];
    case "radio":
      return "";
    case "select":
      return "";
    case "slider":
      return field.settings?.defaultValue || 50;
    case "number":
      return "";
    case "text":
    case "email":
    case "textarea":
    default:
      return "";
  }
};

const initializeFormData = (fields: FormField[]): Record<string, any> => {
  const formData: Record<string, any> = {};

  fields.forEach((field) => {
    formData[field.id] = getDefaultValueForField(field);
  });

  return formData;
};

import { evaluateLogic, getLogicFieldDefaults } from "@/lib/forms/logic";

export function useFormPreviewState(
  schema: FormSchema,
  selectedBlockId?: string | null
) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const initializedFieldsRef = useRef<Set<string>>(new Set());

  const isMultiStep = schema.blocks?.length > 1;
  const allFields =
    schema.blocks?.flatMap((block) => block.fields) || schema.fields || [];
  const currentStep = isMultiStep ? schema.blocks?.[currentStepIndex] : null;
  const currentStepFields = isMultiStep ? currentStep?.fields || [] : allFields;

  useEffect(() => {
    const currentFieldIds = new Set(allFields.map((field) => field.id));
    const newFieldIds = [...currentFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      const newFormData = { ...formData };
      allFields.forEach((field) => {
        if (newFieldIds.includes(field.id)) {
          newFormData[field.id] = getDefaultValueForField(field);
        }
      });
      setFormData(newFormData);
      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [allFields.length]);

  useEffect(() => {
    if (selectedBlockId && schema.blocks) {
      const blockIndex = schema.blocks.findIndex(
        (block) => block.id === selectedBlockId
      );
      if (blockIndex !== -1) {
        setCurrentStepIndex(blockIndex);
      }
    }
  }, [selectedBlockId, schema.blocks]);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < (schema.blocks?.length || 1)) {
      setCurrentStepIndex(nextIndex);
      return nextIndex;
    }
    return currentStepIndex;
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
      return prevIndex;
    }
    return currentStepIndex;
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < (schema.blocks?.length || 1)) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const logic = schema.logic || [];
  const logicActions = evaluateLogic(logic, formData);

  const fieldDefaults = getLogicFieldDefaults(
    logic,
    allFields.map((f) => f.id)
  );
  const fieldVisibility: Record<
    string,
    { visible: boolean; disabled: boolean }
  > = { ...fieldDefaults };
  logicActions.forEach((action) => {
    if (action.target && fieldVisibility[action.target]) {
      if (action.type === "hide")
        fieldVisibility[action.target].visible = false;
      if (action.type === "show") fieldVisibility[action.target].visible = true;
      if (action.type === "disable")
        fieldVisibility[action.target].disabled = true;
      if (action.type === "enable")
        fieldVisibility[action.target].disabled = false;
    }
  });

  return {
    formData,
    currentStepIndex,
    isMultiStep,
    allFields,
    currentStep,
    currentStepFields,
    handleFieldValueChange,
    nextStep,
    prevStep,
    goToStep,
    fieldVisibility,
  };
}
