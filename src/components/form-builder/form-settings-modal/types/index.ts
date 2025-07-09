// External imports
import type { FormSchema } from "@/lib/database";

// Interfaces
export interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: FormSchema;
  onSchemaUpdate: (updates: Partial<FormSchema>) => void;
  userEmail?: string;
  formId?: string;
}

export interface NotificationLink {
  label: string;
  url: string;
}

export interface NotificationSettings {
  enabled?: boolean;
  email?: string;
  subject?: string;
  message?: string;
  customLinks?: NotificationLink[];
}

export interface LocalSettings {
  title: string;
  description?: string;
  submitText?: string;
  successMessage?: string;
  redirectUrl?: string;
  designMode?: "default" | "minimal";
  layout?: {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
    padding?: "none" | "sm" | "md" | "lg";
    margin?: "none" | "sm" | "md" | "lg";
    spacing?: "compact" | "normal" | "relaxed";
    alignment?: "left" | "center" | "right";
  };
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
    showIkiformBranding?: boolean;
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
  notifications?: NotificationSettings;
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

export type FormSettingsSection =
  | "basic"
  | "limits"
  | "security"
  | "branding"
  | "notifications"
  | "design";

export interface FormSettingsSectionConfig {
  id: FormSettingsSection;
  label: string;
  iconName: string;
}
