import type { FormSchema } from "@/lib/database";

/**
 * Default rate limiting settings for all forms
 */
export const DEFAULT_RATE_LIMIT_SETTINGS = {
  enabled: true,
  maxSubmissions: 5,
  timeWindow: 10, // minutes
  blockDuration: 60, // minutes
  message: "Too many submissions. Please try again later.",
};

/**
 * Default profanity filter settings for all forms
 */
export const DEFAULT_PROFANITY_FILTER_SETTINGS = {
  enabled: false,
  strictMode: true,
  replaceWithAsterisks: false,
  customWords: [],
  customMessage:
    "Your submission contains inappropriate content. Please review and resubmit.",
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

export const DEFAULT_SOCIAL_MEDIA_SETTINGS = {
  enabled: false,
  platforms: {},
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
  email: "", // to be set to logged-in user
  subject: "You received a submission! 🥳",
  message: "Whoo-hoo!! You have received a new submission on your form.",
};

/**
 * Ensures a form schema has the default rate limiting and profanity filter settings
 * This is used to handle legacy forms and ensure all forms have these settings
 */
export function ensureDefaultFormSettings(schema: FormSchema): FormSchema {
  return {
    ...schema,
    settings: {
      ...schema.settings,
      branding: {
        ...schema.settings.branding,
        socialMedia: {
          ...DEFAULT_SOCIAL_MEDIA_SETTINGS,
          ...schema.settings.branding?.socialMedia,
        },
      },
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings.profanityFilter,
      },
      responseLimit: {
        ...DEFAULT_RESPONSE_LIMIT_SETTINGS,
        ...schema.settings.responseLimit,
      },
      passwordProtection: {
        ...DEFAULT_PASSWORD_PROTECTION_SETTINGS,
        ...schema.settings.passwordProtection,
      },
      notifications: {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...schema.settings.notifications,
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
      description: options.description || "",
      submitText: "Submit",
      successMessage: "Thank you for your submission!",
      redirectUrl: "",
      multiStep: options.multiStep || false,
      showProgress: options.multiStep !== false,
      branding: {
        socialMedia: { ...DEFAULT_SOCIAL_MEDIA_SETTINGS },
      },
      rateLimit: { ...DEFAULT_RATE_LIMIT_SETTINGS },
      profanityFilter: { ...DEFAULT_PROFANITY_FILTER_SETTINGS },
      responseLimit: { ...DEFAULT_RESPONSE_LIMIT_SETTINGS },
      passwordProtection: { ...DEFAULT_PASSWORD_PROTECTION_SETTINGS },
    },
  };
}
