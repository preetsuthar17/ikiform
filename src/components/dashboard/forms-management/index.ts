// Main export for forms management module
export { FormsManagement, FormsManagement as default } from './FormsManagement';
// Export hook for external use
export { useFormsManagement } from './hooks';
// Export types for external use
export type {
  AIFormSuggestionsProps,
  FormCardProps,
  FormStatsProps,
  FormsManagementProps,
} from './types';
// Export utilities for external use
export { formatDate, generateShareUrl, getTotalFields } from './utils';
