// External imports
import type { FormSchema } from "@/lib/database";

// Interfaces
export interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: FormSchema;
  onSchemaUpdate: (updates: Partial<FormSchema>) => void;
}

export interface LocalSettings {
  title: string;
  description?: string;
  submitText?: string;
  successMessage?: string;
  redirectUrl?: string;
  rateLimit?: {
    enabled?: boolean;
    maxSubmissions?: number;
    timeWindow?: number;
    blockDuration?: number;
    message?: string;
  };
  profanityFilter?: {
    enabled?: boolean;
    strictMode?: boolean;
    replaceWithAsterisks?: boolean;
    customMessage?: string;
    customWords?: string[];
    whitelistedWords?: string[];
  };
}

export interface BasicInfoSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export interface RateLimitSectionProps {
  localSettings: LocalSettings;
  updateRateLimit: (
    updates: Partial<NonNullable<LocalSettings["rateLimit"]>>,
  ) => void;
}

export interface ProfanityFilterSectionProps {
  localSettings: LocalSettings;
  updateProfanityFilter: (
    updates: Partial<NonNullable<LocalSettings["profanityFilter"]>>,
  ) => void;
}
