// Types for forms management component
import type { Form } from "@/lib/database";

export interface FormsManagementProps {
  className?: string;
}

export interface DeleteModalState {
  open: boolean;
  formId: string;
  formTitle: string;
}

export interface FormStatsProps {
  forms: Form[];
}

export interface FormCardProps {
  form: Form;
  onEdit: (formId: string) => void;
  onPreview: (formId: string) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export interface FormHeaderProps {
  onCreateForm: () => void;
}

export interface EmptyStateProps {
  onCreateForm: () => void;
}

export interface AIFormSuggestionsProps {
  onCreateForm: (prompt: string) => void;
}

export interface FormActionsProps {
  form: Form;
  onEdit: (formId: string) => void;
  onPreview: (formId: string) => void;
  onViewAnalytics: (formId: string) => void;
  onShare: (form: Form) => void;
  onDelete: (formId: string, formTitle: string) => void;
}

export interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualCreate: () => void;
  onAICreate: () => void;
}

export interface LoadingSkeletonProps {
  className?: string;
}

export interface AISuggestion {
  title: string;
  prompt: string;
}
