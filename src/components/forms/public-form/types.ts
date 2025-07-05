import type { FormSchema } from "@/lib/database";

export interface PublicFormProps {
  formId: string;
  schema: FormSchema;
}

export interface SingleStepFormState {
  formData: Record<string, any>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;
}

export interface SingleStepFormActions {
  setFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitting: (submitting: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  handleFieldValueChange: (fieldId: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
