import type { FormSettingsSection, FormSettingsSectionConfig } from './types';

export const FORM_SETTINGS_SECTIONS: FormSettingsSectionConfig[] = [
  { id: 'basic', label: 'Basic Info', iconName: 'Info' },
  { id: 'limits', label: 'Limits', iconName: 'BarChart2' },
  { id: 'security', label: 'Security', iconName: 'Shield' },
  { id: 'branding', label: 'Branding', iconName: 'User' },
  { id: 'notifications', label: 'Notifications', iconName: 'Mail' },
  { id: 'webhooks', label: 'Webhooks', iconName: 'Link2' },
  { id: 'design', label: 'Design', iconName: 'Palette' },
];

export {
  BasicInfoSection,
  ProfanityFilterSection,
  RateLimitSection,
} from './components';

export { FormSettingsModal } from './FormSettingsModal';

export { useFormSettings } from './hooks';

export type * from './types';
