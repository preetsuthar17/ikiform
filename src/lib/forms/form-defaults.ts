import type { FormSchema } from "@/lib/database";

/**
 * Default rate limiting settings for all forms
 */
export const DEFAULT_RATE_LIMIT_SETTINGS = {
  enabled: true,
  maxSubmissions: 5,
  timeWindow: 30,
  blockDuration: 60,
  message: "Please wait before submitting another request.",
};

/**
 * Default profanity filter settings for all forms
 */
export const DEFAULT_PROFANITY_FILTER_SETTINGS = {
  enabled: true,
  strictMode: true,
  replaceWithAsterisks: false,
  customWords: [],
  customMessage: "Please keep your submission respectful.",
  whitelistedWords: [],
};

/**
 * Default response limit for all forms
 */

export const DEFAULT_RESPONSE_LIMIT_SETTINGS = {
  enabled: false,
  maxResponses: 100,
  message: "This form is no longer accepting responses.",
};

/**
 * Default password protection settings for all forms
 */
export const DEFAULT_PASSWORD_PROTECTION_SETTINGS = {
  enabled: false,
  password: "",
  message:
    "This form is password protected. Please enter the password to continue.",
};

/**
 * Default duplicate prevention settings for all forms
 */
export const DEFAULT_DUPLICATE_PREVENTION_SETTINGS = {
  enabled: false,
  strategy: "combined" as const,
  mode: "one-time" as const,
  timeWindow: 1440,
  message:
    "You have already submitted this form. Each user can only submit once.",
  allowOverride: false,
  maxAttempts: 1,
};

/**
 * Default bot protection settings for all forms
 */
export const DEFAULT_BOT_PROTECTION_SETTINGS = {
  enabled: false,
  message: "Bot detected. Access denied.",
};

export const DEFAULT_SOCIAL_MEDIA_SETTINGS = {
  enabled: true,
  platforms: {
    github: "https://github.com/preetsuthar17",
    twitter: "https://x.com/preetsuthar17",
  },
  showIcons: true,
  iconSize: "md" as const,
  position: "footer" as const,
};

export const DEFAULT_EMAIL_VALIDATION_SETTINGS = {
  allowedDomains: [],
  blockedDomains: [],
  autoCompleteDomain: "",
  requireBusinessEmail: false,
  customValidationMessage: "",
};

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  email: "",
  subject: "You received a submission! 🥳",
  message: "Whoo-hoo!! You have received a new submission on your form.",
};

export const DEFAULT_LAYOUT_SETTINGS = {
  margin: "md" as const,
  padding: "lg" as const,
  maxWidth: "md" as const,
  borderRadius: "md" as const,
  spacing: "normal" as const,
  alignment: "left" as const,
};

/**
 * Default behavior settings for all forms
 */
export const DEFAULT_BEHAVIOR_SETTINGS = {
  autoFocusFirstField: false,
};

/**
 * Default color settings for all forms
 */
export const DEFAULT_COLOR_SETTINGS = {
  text: "#1f2937",
  border: "#e5e7eb",
  primary: "#3b82f6",
  background: "transparent",
};

/**
 * Default typography settings for all forms
 */
export const DEFAULT_TYPOGRAPHY_SETTINGS = {
  fontSize: "base" as const,
  fontFamily: "Inter",
  fontWeight: "normal" as const,
  lineHeight: "normal" as const,
  letterSpacing: "normal" as const,
};

/**
 * Ensures a form schema has the default rate limiting and profanity filter settings
 * This is used to handle legacy forms and ensure all forms have these settings
 */
export function ensureDefaultFormSettings(schema: FormSchema): FormSchema {
  return {
    ...schema,
    settings: {
      title: schema.settings?.title || "Untitled Form",
      publicTitle: schema.settings?.publicTitle || "",
      description: schema.settings?.description || "",
      submitText: schema.settings?.submitText || "Submit",
      successMessage:
        schema.settings?.successMessage || "Thank you for your submission!",
      redirectUrl: schema.settings?.redirectUrl || "",
      multiStep: schema.settings?.multiStep,
      showProgress: schema.settings?.showProgress !== false,
      hideHeader: schema.settings?.hideHeader,
      colors: {
        ...DEFAULT_COLOR_SETTINGS,
        ...schema.settings?.colors,
      },
      typography: {
        ...DEFAULT_TYPOGRAPHY_SETTINGS,
        ...schema.settings?.typography,
      },
      branding: {
        ...schema.settings?.branding,
        socialMedia: {
          ...DEFAULT_SOCIAL_MEDIA_SETTINGS,
          ...schema.settings?.branding?.socialMedia,
        },
      },
      layout: {
        ...DEFAULT_LAYOUT_SETTINGS,
        ...schema.settings?.layout,
      },
      behavior: {
        ...DEFAULT_BEHAVIOR_SETTINGS,
        ...schema.settings?.behavior,
      },
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings?.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings?.profanityFilter,
      },
      responseLimit: {
        ...DEFAULT_RESPONSE_LIMIT_SETTINGS,
        ...schema.settings?.responseLimit,
      },
      passwordProtection: {
        ...DEFAULT_PASSWORD_PROTECTION_SETTINGS,
        ...schema.settings?.passwordProtection,
      },
      notifications: {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...schema.settings?.notifications,
      },
      duplicatePrevention: {
        ...DEFAULT_DUPLICATE_PREVENTION_SETTINGS,
        ...schema.settings?.duplicatePrevention,
      },
      botProtection: {
        ...DEFAULT_BOT_PROTECTION_SETTINGS,
        ...schema.settings?.botProtection,
      },
      api: {
        enabled: false,
        apiKey: undefined,
        allowExternalSubmissions: false,
        ...schema.settings?.api,
      },
    },
  };
}

export function ensureDefaultRateLimitSettings(schema: FormSchema): FormSchema {
  return ensureDefaultFormSettings(schema);
}

/**
 * Creates a default form schema with rate limiting enabled
 */
export function createDefaultFormSchema(options: {
  title?: string;
  publicTitle?: string;
  description?: string;
  multiStep?: boolean;
}): FormSchema {
  return {
    blocks: options.multiStep
      ? [
          {
            id: "step-1",
            title: "Step 1",
            description: "First step of your form",
            fields: [],
          },
        ]
      : [
          {
            id: "default",
            title: "Form Fields",
            description: "",
            fields: [],
          },
        ],
    fields: [],
    settings: {
      title: options.title || "Untitled Form",
      publicTitle: options.publicTitle || "",
      description: options.description || "",
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
      redirectUrl: "",
      multiStep: options.multiStep,
      showProgress: options.multiStep !== false,
      hideHeader: false,
      colors: { ...DEFAULT_COLOR_SETTINGS },
      typography: { ...DEFAULT_TYPOGRAPHY_SETTINGS },
      branding: {
        socialMedia: { ...DEFAULT_SOCIAL_MEDIA_SETTINGS },
      },
      layout: { ...DEFAULT_LAYOUT_SETTINGS },
      rateLimit: { ...DEFAULT_RATE_LIMIT_SETTINGS },
      profanityFilter: { ...DEFAULT_PROFANITY_FILTER_SETTINGS },
      responseLimit: { ...DEFAULT_RESPONSE_LIMIT_SETTINGS },
      passwordProtection: { ...DEFAULT_PASSWORD_PROTECTION_SETTINGS },
      notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
      duplicatePrevention: { ...DEFAULT_DUPLICATE_PREVENTION_SETTINGS },
      botProtection: { ...DEFAULT_BOT_PROTECTION_SETTINGS },
    },
  };
}
