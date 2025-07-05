// External imports
import React from "react";

// UI components
import { Label } from "@/components/ui/label";

// types and constants
import { Theme } from "../types";
import { APPEARANCE_SETTINGS } from "../constants";

// components
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
      <Label className="text-base font-medium">
        {APPEARANCE_SETTINGS.THEME_LABEL}
      </Label>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme === theme.id}
            onSelect={onThemeChange}
          />
        ))}
      </div>
    </div>
  );
};
