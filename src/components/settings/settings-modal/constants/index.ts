import type { SettingsSection } from "../types";

export const SETTINGS_SECTIONS: Array<{
  id: SettingsSection;
  label: string;
  iconName: "Palette" | "Bell";
}> = [
  {
    id: "appearance",
    label: "Appearance",
    iconName: "Palette",
  },
  {
    id: "notifications",
    label: "Notifications",
    iconName: "Bell",
  },
];
