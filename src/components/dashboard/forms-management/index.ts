// Main export for forms management module
export { FormsManagement } from "./FormsManagement";
export { FormsManagement as default } from "./FormsManagement";

// Export types for external use
export type {
  FormsManagementProps,
  FormCardProps,
  FormStatsProps,
  AIFormSuggestionsProps,
} from "./types";

// Export utilities for external use
export {
  getTotalFields,
  formatDate,
  generateShareUrl,
  generatePreviewUrl,
} from "./utils";

// Export hook for external use
export { useFormsManagement } from "./hooks";
