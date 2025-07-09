// Types from external modules
import type { FormField, FormSchema, FormBlock } from "@/lib/database";

// Props for FormPreview component
export interface FormPreviewProps {
  schema: FormSchema;
  selectedFieldId: string | null;
  selectedBlockId?: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldsReorder: (fields: FormField[]) => void;
  onFieldDelete: (fieldId: string) => void;
  onFormSettingsUpdate?: (settings: Partial<FormSchema["settings"]>) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<FormBlock>) => void;
  onStepSelect?: (stepIndex: number) => void;
  onAddField?: (fieldType: FormField["type"]) => void;
}

// Props for FormHeader component
export interface FormHeaderProps {
  schema: FormSchema;
  onFormSettingsUpdate?: (settings: Partial<FormSchema["settings"]>) => void;
}

// Props for MultiStepNavigation component
export interface MultiStepNavigationProps {
  schema: FormSchema;
  currentStepIndex: number;
  onStepSelect?: (stepIndex: number) => void;
  onStepChange: (index: number) => void;
}

// Props for StepHeader component
export interface StepHeaderProps {
  currentStep: FormBlock;
  currentStepIndex: number;
  onBlockUpdate?: (blockId: string, updates: Partial<FormBlock>) => void;
}

// Props for FormFieldsContainer component
export interface FormFieldsContainerProps {
  fields: FormField[];
  selectedFieldId: string | null;
  formData: Record<string, any>;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldsReorder: (fields: FormField[]) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldValueChange: (fieldId: string, value: any) => void;
  isMultiStep: boolean;
  onAddField?: (fieldType: FormField["type"]) => void;
}

// Props for FormActions component
export interface FormActionsProps {
  schema: FormSchema;
  currentStepIndex: number;
  fieldsLength: number;
  isMultiStep: boolean;
  onNextStep: () => void;
}

// Props for EditableField component
export interface EditableFieldProps {
  value: string;
  placeholder?: string;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  inputClassName?: string;
  component?: "input" | "textarea";
  rows?: number;
}
