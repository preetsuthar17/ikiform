import type { FormSchema } from '@/lib/database';
import type { FormProgress } from '@/lib/form-progress/types';

export interface PublicFormProps {
  formId: string;
  schema: FormSchema;
  theme?: string;
}

export interface SingleStepFormState {
  formData: Record<string, any>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;

  progress: FormProgress | null;
  progressLoading: boolean;
  progressSaving: boolean;
  progressError: string | null;
}

export interface SingleStepFormActions {
  setFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  handleFieldValueChange: (fieldId: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearProgress: () => Promise<void>;
}
