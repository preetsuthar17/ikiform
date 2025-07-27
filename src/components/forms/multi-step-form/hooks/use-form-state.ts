// Libraries
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Types
import type { FormBlock, FormField, FormSchema } from '@/lib/database';
import type { LogicAction } from '@/lib/forms/logic';
import { evaluateLogic } from '@/lib/forms/logic';
import type { FormActions, FormState } from '../types';
import { submitForm } from '../utils/form-utils';
// Utilities
import { validateStep } from '../utils/validation';

// Utility function to get default value for a field type
const getDefaultValueForField = (field: FormField): any => {
  switch (field.type) {
    case 'tags':
      return [];
    case 'checkbox':
      return [];
    case 'radio':
      return '';
    case 'select':
      return '';
    case 'slider':
      return field.settings?.defaultValue || 50;
    case 'rating':
      return null;
    case 'number':
      return '';
    case 'text':
    case 'email':
    case 'textarea':
    default:
      return '';
  }
};

// Utility function to initialize form data with proper defaults
const initializeFormData = (blocks: FormBlock[]): Record<string, any> => {
  const formData: Record<string, any> = {};

  blocks.forEach((block) => {
    block.fields?.forEach((field) => {
      formData[field.id] = getDefaultValueForField(field);
    });
  });

  return formData;
};

export const useFormState = (
  formId: string,
  schema: FormSchema,
  blocks: FormBlock[]
): FormState &
  FormActions & {
    fieldVisibility: Record<string, { visible: boolean; disabled: boolean }>;
    logicMessages: string[];
  } => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initializedFieldsRef = useRef<Set<string>>(new Set());

  const totalSteps = blocks.length;

  // Initialize form data when blocks change - only when new fields are added
  useEffect(() => {
    const allFieldIds = new Set<string>();
    blocks.forEach((block) => {
      block.fields?.forEach((field) => {
        allFieldIds.add(field.id);
      });
    });

    const newFieldIds = [...allFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      // Preserve existing form data and only initialize new fields
      const newFormData = { ...formData };
      blocks.forEach((block) => {
        block.fields?.forEach((field) => {
          if (newFieldIds.includes(field.id)) {
            newFormData[field.id] = getDefaultValueForField(field);
          }
        });
      });
      setFormData(newFormData);
      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [blocks.length]);

  // Logic evaluation for field visibility/enabled state
  const logic = schema.logic || [];
  const logicActions = evaluateLogic(logic, formData);
  // Build a map: fieldId -> { visible, disabled }
  const fieldVisibility: Record<
    string,
    { visible: boolean; disabled: boolean }
  > = {};
  blocks.forEach((block) => {
    block.fields.forEach((field) => {
      fieldVisibility[field.id] = { visible: true, disabled: false };
    });
  });
  const logicMessages: string[] = [];

  // Collect all actions for each field
  const actionsByField: Record<string, LogicAction[]> = {};
  logicActions.forEach((action) => {
    if (action.target) {
      if (!actionsByField[action.target]) actionsByField[action.target] = [];
      actionsByField[action.target].push(action);
    }
  });

  // Apply logic: hide > show > default
  Object.entries(fieldVisibility).forEach(([fieldId, vis]) => {
    const actions = actionsByField[fieldId] || [];
    if (actions.some((a) => a.type === 'hide')) {
      vis.visible = false;
    } else if (actions.some((a) => a.type === 'show')) {
      vis.visible = true;
    } // else leave as default
    if (actions.some((a) => a.type === 'disable')) {
      vis.disabled = true;
    } else if (actions.some((a) => a.type === 'enable')) {
      vis.disabled = false;
    }
  });

  logicActions.forEach((action) => {
    if (
      action.target &&
      fieldVisibility[action.target] &&
      action.type === 'set_value' &&
      typeof action.target === 'string' &&
      Object.hasOwn(formData, action.target) &&
      formData[action.target] !== action.value
    )
      setFormData((prev) => ({
        ...prev,
        [action.target as string]: action.value,
      }));
    if (action.type === 'show_message' && action.value) {
      logicMessages.push(String(action.value));
    }
  });

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleNext = () => {
    const { errors: validationErrors, isValid } = validateStep(
      currentStep,
      blocks,
      formData
    );

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      setErrors(validationErrors);
      toast.error('Please fix the errors in this step');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const result = await submitForm(formId, formData);

      if (result.success) {
        setSubmitted(true);
        toast.success('Form submitted successfully!');

        if (schema.settings.redirectUrl) {
          setTimeout(() => {
            window.location.href = schema.settings.redirectUrl!;
          }, 2000);
        }
      } else {
        toast.error(result.message || 'Failed to submit form');
      }
    } catch {
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    errors,
    submitting,
    submitted,
    setCurrentStep,
    setFormData,
    setErrors,
    setSubmitting,
    setSubmitted,
    handleFieldValueChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    fieldVisibility,
    logicMessages,
  };
};
