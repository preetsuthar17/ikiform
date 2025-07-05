import type { FormSchema, FormBlock } from "@/lib/database.types";

export interface MultiStepFormProps {
  formId: string;
  schema: FormSchema;
}

export interface FormState {
  currentStep: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;
}

export interface FormActions {
  setCurrentStep: (step: number) => void;
  setFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  handleFieldValueChange: (fieldId: string, value: any) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => Promise<void>;
}

export interface FormBlockData {
  blocks: FormBlock[];
  totalSteps: number;
  currentBlock: FormBlock;
  progress: number;
}
