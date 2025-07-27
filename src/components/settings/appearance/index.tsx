'use client';

import { useTheme } from 'next-themes';
// External imports
import type React from 'react';
// components
import {
  AdditionalOptions,
  AppearanceHeader,
  ThemeSelector,
} from './components';
// constants
import { THEMES } from './constants';

export const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <AppearanceHeader />
      <ThemeSelector
        onThemeChange={setTheme}
        selectedTheme={theme}
        themes={THEMES}
      />
      <AdditionalOptions />
    </div>
  );
};
