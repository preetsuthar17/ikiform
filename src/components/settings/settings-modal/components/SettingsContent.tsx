// External imports
import React from 'react';
import { AppearanceSettings } from '../../appearance-settings';
// Internal imports
import type { SettingsSection } from '../types';

interface SettingsContentProps {
  section: SettingsSection;
}

export function SettingsContent({ section }: SettingsContentProps) {
  switch (section) {
    case 'appearance':
      return <AppearanceSettings />;

    case 'notifications':
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl">Notifications</h2>
            <p className="text-muted-foreground">
              Manage how you receive notifications from the app.
            </p>
          </div>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            Notification settings coming soon...
          </div>
        </div>
      );

    default:
      return null;
  }
}
