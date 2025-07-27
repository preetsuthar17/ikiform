// Type imports

import type { RefObject } from 'react';
import type { FormField } from '@/lib/database';

// Interfaces
export interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  fieldRef?: RefObject<any>;
  disabled?: boolean;
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
  disabled?: boolean;
}

// Type definitions
export type FieldSize = 'sm' | 'lg' | 'default';
export type FieldVariant = 'filled' | 'ghost' | 'underline' | 'default';
export type FieldWidth = 'half' | 'third' | 'quarter' | 'full';
