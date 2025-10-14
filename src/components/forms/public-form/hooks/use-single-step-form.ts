import { useEffect, useRef, useState } from "react";
import { useFormProgress } from "@/hooks/form-progress";
import { usePrepopulation } from "@/hooks/prepopulation/usePrepopulation";
import { toast } from "@/hooks/use-toast";

import type { FormField, FormSchema } from "@/lib/database";

import { calculateQuizScore, type QuizResult } from "@/lib/quiz/scoring";
import type { SingleStepFormActions, SingleStepFormState } from "../types";

import {
  submitSingleStepForm,
  validateSingleStepForm,
} from "../utils/form-utils";

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
    case "rating":
      return null;
    case "number":
      return "";
    case "date":
      return "";
    case "signature":
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
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [duplicateError, setDuplicateError] = useState<{
    message: string;
    timeRemaining?: number;
    attemptsRemaining?: number;
  } | null>(null);
  const initializedFieldsRef = useRef<Set<string>>(new Set());

  const {
    progress,
    loading: progressLoading,
    saving: progressSaving,
    error: progressError,
    saveProgress,
    loadProgress,
    clearProgress,
  } = useFormProgress(formId, fields.length, {
    enabled: true,
    storage: "localStorage",
    autoSaveInterval: 3000,
    retentionDays: 7,
  });

  const {
    prepopulatedData,
    loading: prepopLoading,
    errors: prepopErrors,
  } = usePrepopulation(fields);

  useEffect(() => {
    const currentFieldIds = new Set(fields.map((field) => field.id));
    const newFieldIds = [...currentFieldIds].filter(
      (id) => !initializedFieldsRef.current.has(id)
    );

    if (newFieldIds.length > 0) {
      setFormData((prevFormData) => {
        const newFormData = { ...prevFormData };
        fields.forEach((field) => {
          if (newFieldIds.includes(field.id)) {
            newFormData[field.id] = getDefaultValueForField(field);
          }
        });
        return newFormData;
      });

      newFieldIds.forEach((id) => initializedFieldsRef.current.add(id));
    }
  }, [fields]);

  useEffect(() => {
    if (isLoadingProgress && progress?.formData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...progress.formData,
      }));
      setIsLoadingProgress(false);
    }
  }, [progress, isLoadingProgress]);

  const hasTriedLoadingRef = useRef(false);
  useEffect(() => {
    if (formId && !progress && !hasTriedLoadingRef.current) {
      hasTriedLoadingRef.current = true;
      loadProgress();
    }
  }, [formId, progress, loadProgress]);

  useEffect(() => {
    if (Object.keys(prepopulatedData).length > 0) {
      setFormData((prevFormData) => {
        const updatedFormData = { ...prevFormData };
        let hasChanges = false;

        Object.entries(prepopulatedData).forEach(([fieldId, value]) => {
          if (
            fieldId in updatedFormData &&
            (updatedFormData[fieldId] === "" ||
              updatedFormData[fieldId] ===
                getDefaultValueForField(fields.find((f) => f.id === fieldId)!))
          ) {
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
      const field = fields.find((f) => f.id === fieldId);
      const fieldLabel = field?.label || "Field";
    });
  }, [prepopErrors, fields]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const filledFields = Object.values(formData).filter(
        (value) =>
          value !== "" &&
          value !== null &&
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0)
      ).length;

      if (filledFields > 0) {
        saveProgress(formData, 0);
      }
    }
  }, [formData, saveProgress]);

  const fieldVisibility: Record<
    string,
    { visible: boolean; disabled: boolean }
  > = {};
  fields.forEach((field) => {
    fieldVisibility[field.id] = { visible: true, disabled: false };
  });
  const logicMessages: string[] = [];

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
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
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    setDuplicateError(null);

    try {
      const result = await submitSingleStepForm(formId, formData);

      if (result.success) {
        if (schema.settings.quiz?.enabled) {
          const quizResult = calculateQuizScore(schema, formData);
          setQuizResults(quizResult);
        }

        setSubmitted(true);
        toast.success("Form submitted successfully!");

        clearProgress();

        const shouldShowQuizResults =
          schema.settings.quiz?.enabled &&
          (schema.settings.quiz?.showScore !== false ||
            schema.settings.quiz?.showCorrectAnswers !== false);

        if (schema.settings.redirectUrl && !shouldShowQuizResults) {
          setTimeout(() => {
            window.location.href = `${schema.settings.redirectUrl}?ref=ikiform`;
          }, 2000);
        }
      } else {
        // Check if it's a duplicate submission error
        if (result.error === "Duplicate submission detected") {
          setDuplicateError({
            message: result.message || "You have already submitted this form.",
            timeRemaining: result.timeRemaining,
            attemptsRemaining: result.attemptsRemaining,
          });
        } else {
          toast.error(result.message || "Failed to submit form");
        }
      }
    } catch (error: any) {
      // Check if it's a duplicate submission error
      if (error?.error === "Duplicate submission detected") {
        setDuplicateError({
          message: error.message || "You have already submitted this form.",
          timeRemaining: error.timeRemaining,
          attemptsRemaining: error.attemptsRemaining,
        });
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    submitting,
    submitted,
    duplicateError,
    setFormData,
    setErrors,
    setSubmitting,
    setSubmitted,
    handleFieldValueChange,
    handleSubmit,
    fieldVisibility,
    logicMessages,
    quizResults,

    progress,
    progressLoading,
    progressSaving,
    progressError,
    clearProgress,
  };
};
