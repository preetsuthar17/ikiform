// Type imports
import type { FormSchema } from "@/lib/database";
import type { LucideIcon } from "lucide-react";

// Interfaces
export interface FormCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFormTypeSelect: (schema: FormSchema) => void;
}

export type FormType = "single" | "multi";

export interface FormTypeDefinition {
  id: FormType;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  preview?: React.ReactNode;
}

export interface FormTypeCardProps {
  type: FormTypeDefinition;
  isSelected: boolean;
  onSelect: (typeId: FormType) => void;
}

export interface FormTypePreviewProps {
  type: FormType;
}
