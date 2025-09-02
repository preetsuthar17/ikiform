/**
 * Server-only exports for forms module.
 * This file should only be imported in server-side code (API routes, server components, etc.)
 */

export * from "./form-defaults";
// Re-export commonly needed constants for server-side use
export {
  DEFAULT_PROFANITY_FILTER_SETTINGS,
  DEFAULT_RATE_LIMIT_SETTINGS,
} from "./form-defaults";
export * from "./rate-limit";
