import type { FormSettingsSectionConfig } from "./types";

export const FORM_SETTINGS_SECTIONS: FormSettingsSectionConfig[] = [
  { id: "basic", label: "Basic Info", iconName: "Info" },
  { id: "limits", label: "Limits", iconName: "BarChart2" },
  { id: "security", label: "Security", iconName: "Shield" },
  { id: "quiz", label: "Quiz & Scoring", iconName: "Trophy" },
  { id: "branding", label: "Branding", iconName: "User" },
  { id: "notifications", label: "Notifications", iconName: "Mail" },
  { id: "api", label: "API Access", iconName: "Key" },
  { id: "webhooks", label: "Webhooks", iconName: "Link2" },
  { id: "design", label: "Design", iconName: "Palette" },
  { id: "metadata", label: "Metadata", iconName: "Search" },
];

export {
  BasicInfoSection,
  BrandingSection,
  DesignSection,
  DuplicatePreventionSection,
  MetadataSection,
  NotificationsSection,
  PasswordProtectionSection,
  ProfanityFilterSection,
  QuizSection,
  RateLimitSection,
  ResponseLimitSection,
  WebhooksSettingsSection,
} from "./components";
export { FormSettingsModal } from "./FormSettingsModal";
export { useFormSettings } from "./hooks";
export { ApiSection } from "./sections/api-section";

export type * from "./types";
