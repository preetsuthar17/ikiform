import type React from "react";

import { Label } from "@/components/ui/label";
import { APPEARANCE_SETTINGS } from "../constants";

import type { Theme } from "../types";

import { ThemeCard } from "./ThemeCard";

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme?: string;
  onThemeChange: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Label className="font-medium text-base">
        {APPEARANCE_SETTINGS.THEME_LABEL}
      </Label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard
            isSelected={selectedTheme === theme.id}
            key={theme.id}
            onSelect={onThemeChange}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};
