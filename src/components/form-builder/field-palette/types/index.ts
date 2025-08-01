import type { LucideIcon } from 'lucide-react';
import type { FormField } from '@/lib/database';

export interface FieldPaletteProps {
  onAddField: (fieldType: FormField['type']) => void;
  compact?: boolean;
}

export interface FieldTypeConfig {
  type: FormField['type'];
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface CompactFieldItemProps {
  fieldType: FieldTypeConfig;
  onAddField: (fieldType: FormField['type']) => void;
}

export interface FieldItemProps {
  fieldType: FieldTypeConfig;
  onAddField: (fieldType: FormField['type']) => void;
}

export interface PaletteHeaderProps {
  title: string;
  description: string;
}
