'use client';

import { useTheme } from 'next-themes';

import type React from 'react';

import {
  AdditionalOptions,
  AppearanceHeader,
  ThemeSelector,
} from './components';

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
