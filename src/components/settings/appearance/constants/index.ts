// External imports
import { Monitor, Moon, Sun } from "lucide-react";

// types
import { Theme } from "../types";

export const THEMES: Theme[] = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
    image:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignNcDw6E5eyVbgp2n7JYomGh6T4jEWUOKDLF0v",
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    image:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignnWP3fXToBGdrcNZ1v6W3QOjouaypsXtEPR07",
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
    image:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignMyADVA2dw6Ha45juWrfNDgBbtFiz0UICck7Y",
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
