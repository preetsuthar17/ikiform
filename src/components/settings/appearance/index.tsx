"use client";

// External imports
import React from "react";
import { useTheme } from "next-themes";

// constants
import { THEMES } from "./constants";

// components
import {
  AppearanceHeader,
  ThemeSelector,
  AdditionalOptions,
} from "./components";

export const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <AppearanceHeader />
      <ThemeSelector
        themes={THEMES}
        selectedTheme={theme}
        onThemeChange={setTheme}
      />
      <AdditionalOptions />
    </div>
  );
};
