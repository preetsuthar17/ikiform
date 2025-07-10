// Type imports
import type { FormField } from "@/lib/database";
import type { RefObject } from "react";

// Interfaces
export interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldRef?: RefObject<any>;
}

export interface FieldWrapperProps {
  field: FormField;
  error?: string;
  children: React.ReactNode;
}

export interface BaseFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldRef?: RefObject<any>;
  className?: string;
}

// Type definitions
export type FieldSize = "sm" | "lg" | "default";
export type FieldVariant = "filled" | "ghost" | "underline" | "default";
export type FieldWidth = "half" | "third" | "quarter" | "full";
