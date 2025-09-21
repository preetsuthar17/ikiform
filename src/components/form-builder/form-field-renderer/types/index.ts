import type { RefObject } from "react";
import type { FormField } from "@/lib/database";

export interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldRef?: RefObject<any>;
  disabled?: boolean;
  formId?: string; // Optional form ID for file uploads
  builderMode?: boolean; // When true, makes fields non-interactable for selection
}

export interface FieldWrapperProps {
  field: FormField;
  error?: string;
  children: React.ReactNode;
  builderMode?: boolean;
}

export interface BaseFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldRef?: RefObject<any>;
  className?: string;
  disabled?: boolean;
  formId?: string; // Optional form ID for file uploads
  builderMode?: boolean; // When true, makes fields non-interactable for selection
}

export type FieldSize = "sm" | "lg" | "default";
export type FieldVariant = "filled" | "ghost" | "underline" | "default";
export type FieldWidth = "half" | "third" | "quarter" | "full";
