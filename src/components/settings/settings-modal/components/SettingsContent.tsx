// External imports
import React from "react";

// Internal imports
import { SettingsSection } from "../types";
import { AppearanceSettings } from "../../appearance-settings";

interface SettingsContentProps {
  section: SettingsSection;
}

export function SettingsContent({ section }: SettingsContentProps) {
  switch (section) {
    case "appearance":
      return <AppearanceSettings />;

    case "notifications":
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Notifications</h2>
            <p className="text-muted-foreground">
              Manage how you receive notifications from the app.
            </p>
          </div>
          <div className="flex justify-center items-center h-32 text-muted-foreground">
            Notification settings coming soon...
          </div>
        </div>
      );

    default:
      return null;
  }
}
