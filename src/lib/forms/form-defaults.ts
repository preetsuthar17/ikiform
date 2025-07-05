import type { FormSchema } from "./database.types";

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
 * Ensures a form schema has the default rate limiting and profanity filter settings
 * This is used to handle legacy forms and ensure all forms have these settings
 */
export function ensureDefaultFormSettings(schema: FormSchema): FormSchema {
  return {
    ...schema,
    settings: {
      ...schema.settings,
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings.profanityFilter,
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
      rateLimit: { ...DEFAULT_RATE_LIMIT_SETTINGS },
    },
  };
}
