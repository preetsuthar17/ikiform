import type { LucideIcon } from "lucide-react";
import type { FormSchema } from "@/lib/database";

export interface FormCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFormTypeSelect: (schema: FormSchema) => void;
}

export type FormType = "single" | "multi";

export type WizardStep = "type" | "configure" | "review";

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

export interface FormConfiguration {
  title: string;
  publicTitle?: string;
  description: string;
  type: FormType;
}

export interface FormConfigurationStepProps {
  configuration: FormConfiguration;
  onConfigurationChange: (config: Partial<FormConfiguration>) => void;
}
