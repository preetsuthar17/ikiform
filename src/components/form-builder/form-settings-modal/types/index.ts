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
  branding?: {
    socialMedia?: {
      enabled?: boolean;
      platforms?: {
        linkedin?: string;
        twitter?: string;
        youtube?: string;
        instagram?: string;
        facebook?: string;
        github?: string;
        website?: string;
      };
      showIcons?: boolean;
      iconSize?: "sm" | "md" | "lg";
      position?: "footer" | "header" | "both";
    };
  };
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
  responseLimit?: {
    enabled?: boolean;
    maxResponses?: number;
    message?: string;
  };
  passwordProtection?: {
    enabled?: boolean;
    password?: string;
    message?: string;
  };
  rtl?: boolean;
}

export interface BasicInfoSectionProps {
  localSettings: LocalSettings;
  updateSettings: (updates: Partial<LocalSettings>) => void;
}

export interface RateLimitSectionProps {
  localSettings: LocalSettings;
  updateRateLimit: (
    updates: Partial<NonNullable<LocalSettings["rateLimit"]>>
  ) => void;
}

export interface ProfanityFilterSectionProps {
  localSettings: LocalSettings;
  updateProfanityFilter: (
    updates: Partial<NonNullable<LocalSettings["profanityFilter"]>>
  ) => void;
}

export interface SocialMediaSectionProps {
  localSettings: LocalSettings;
  updateSocialMedia: (
    updates: Partial<
      NonNullable<NonNullable<LocalSettings["branding"]>["socialMedia"]>
    >
  ) => void;
}
