// Type imports
import type { FormField } from "@/lib/database";
import type { RefObject } from "react";

// Interfaces
export interface FormFieldRendererProps {
  field: FormField;
  value: string | number | boolean | object | null;
  onChange: (value: string | number | boolean | object | null) => void;
  error?: string;
  fieldRef?: RefObject<unknown>;
  disabled?: boolean;
}

export interface FieldWrapperProps {
  field: FormField;
  error?: string;
  children: React.ReactNode;
}

export interface BaseFieldProps {
  field: FormField;
  value: string | number | boolean | object | null;
  onChange: (value: string | number | boolean | object | null) => void;
  error?: string;
  fieldRef?: RefObject<unknown>;
  className?: string;
  disabled?: boolean;
}

// Type definitions
export type FieldSize = "sm" | "lg" | "default";
export type FieldVariant = "filled" | "ghost" | "underline" | "default";
export type FieldWidth = "half" | "third" | "quarter" | "full";
