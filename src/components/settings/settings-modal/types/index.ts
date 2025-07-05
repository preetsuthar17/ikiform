export interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type SettingsSection = "appearance" | "notifications";

export interface SettingsSectionConfig {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
}
