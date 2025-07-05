// External imports
import { Monitor, Moon, Sun } from "lucide-react";

// types
import { Theme } from "../types";

export const THEMES: Theme[] = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
    image: "./theme-preview/light.png",
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    image: "./theme-preview/dark.png",
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
    image: "./theme-preview/system.png",
  },
];

export const APPEARANCE_SETTINGS = {
  TITLE: "Appearance",
  DESCRIPTION:
    "Customize the appearance of the app. Choose between light, dark, or system theme.",
  THEME_LABEL: "Theme",
  ADDITIONAL_OPTIONS_LABEL: "Additional Options",
  ADDITIONAL_OPTIONS_DESCRIPTION:
    "More appearance customization options coming soon...",
} as const;
