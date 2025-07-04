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
 * Ensures a form schema has the default rate limiting settings
 * This is used to handle legacy forms and ensure all forms have rate limiting enabled
 */
export function ensureDefaultRateLimitSettings(schema: FormSchema): FormSchema {
  return {
    ...schema,
    settings: {
      ...schema.settings,
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit, // Keep any existing custom settings
      },
    },
  };
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
      showProgress: options.multiStep !== false, // Default to true unless explicitly single-step
      rateLimit: { ...DEFAULT_RATE_LIMIT_SETTINGS },
    },
  };
}
