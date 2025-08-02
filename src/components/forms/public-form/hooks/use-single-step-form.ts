import { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePrepopulation } from '@/hooks/prepopulation/usePrepopulation';

import type { FormField, FormSchema } from '@/lib/database';
import { evaluateLogic } from '@/lib/forms/logic';
import type { SingleStepFormActions, SingleStepFormState } from '../types';

import {
  submitSingleStepForm,
  validateSingleStepForm,
} from '../utils/form-utils';

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
    case 'date':
      return '';
    case 'signature':
      return '';
    case 'text':
    case 'email':
    case 'textarea':
    default:
      return '';
  }
};

const initializeFormData = (fields: FormField[]): Record<string, any> => {
  const formData: Record<string, any> = {};

  fields.forEach((field) => {
    formData[field.id] = getDefaultValueForField(field);
  });

  return formData;
};

export const useSingleStepForm = (
  formId: string,
  schema: FormSchema,
  fields: FormField[]
): SingleStepFormState &
  SingleStepFormActions & {
    fieldVisibility: Record<string, { visible: boolean; disabled: boolean }>;
    logicMessages: string[];
  } => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const initializedFieldsRef = useRef<Set<string>>(new Set());

 
  const { prepopulatedData, loading: prepopLoading, errors: prepopErrors } = usePrepopulation(fields);

  useEffect(() => {
    const currentFieldIds = new Set(fields.map((field) => field.id));
    const newFieldIds = [...currentFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      const newFormData = { ...formData };
      fields.forEach((field) => {
        if (newFieldIds.includes(field.id)) {
         
          const prepopValue = prepopulatedData[field.id];
          newFormData[field.id] = prepopValue !== undefined ? prepopValue : getDefaultValueForField(field);
        }
      });
      setFormData(newFormData);
      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [fields.length, prepopulatedData, formData]);

 
  useEffect(() => {
    if (Object.keys(prepopulatedData).length > 0) {
      setFormData(prevFormData => {
        const updatedFormData = { ...prevFormData };
        let hasChanges = false;
        
        Object.entries(prepopulatedData).forEach(([fieldId, value]) => {
         
          if (fieldId in updatedFormData && (updatedFormData[fieldId] === '' || updatedFormData[fieldId] === getDefaultValueForField(fields.find(f => f.id === fieldId)!))) {
            updatedFormData[fieldId] = value;
            hasChanges = true;
          }
        });
        
        return hasChanges ? updatedFormData : prevFormData;
      });
    }
  }, [prepopulatedData, fields]);

 
  useEffect(() => {
    Object.entries(prepopErrors).forEach(([fieldId, error]) => {
      const field = fields.find(f => f.id === fieldId);
      const fieldLabel = field?.label || 'Field';
      toast.error(`Failed to prepopulate ${fieldLabel}: ${error}`);
    });
  }, [prepopErrors, fields]);

  const logic = schema.logic || [];
  const logicActions = evaluateLogic(logic, formData);

  const fieldVisibility: Record<
    string,
    { visible: boolean; disabled: boolean }
  > = {};
  fields.forEach((field) => {
    fieldVisibility[field.id] = { visible: true, disabled: false };
  });
  const logicMessages: string[] = [];
  logicActions.forEach((action) => {
    if (action.target && fieldVisibility[action.target]) {
      if (action.type === 'hide')
        fieldVisibility[action.target].visible = false;
      if (action.type === 'show') fieldVisibility[action.target].visible = true;
      if (action.type === 'disable')
        fieldVisibility[action.target].disabled = true;
      if (action.type === 'enable')
        fieldVisibility[action.target].disabled = false;
      if (
        action.type === 'set_value' &&
        typeof action.target === 'string' &&
        formData[action.target] !== action.value
      ) {
        setFormData((prev) => ({
          ...prev,
          [action.target as string]: action.value,
        }));
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateSingleStepForm(
      fields,
      formData
    );

    if (!isValid) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitSingleStepForm(formId, formData);

      if (result.success) {
        setSubmitted(true);
        toast.success('Form submitted successfully!');

        if (schema.settings.redirectUrl) {
          setTimeout(() => {
            window.location.href = `${schema.settings.redirectUrl}?ref=ikiform`;
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
    formData,
    errors,
    submitting,
    submitted,
    setFormData,
    setErrors,
    setSubmitting,
    setSubmitted,
    handleFieldValueChange,
    handleSubmit,
    fieldVisibility,
    logicMessages,
  };
};
