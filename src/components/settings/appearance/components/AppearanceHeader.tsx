import React from "react";

// constants
import { APPEARANCE_SETTINGS } from "../constants";

export const AppearanceHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">{APPEARANCE_SETTINGS.TITLE}</h2>
      <p className="text-muted-foreground">{APPEARANCE_SETTINGS.DESCRIPTION}</p>
    </div>
  );
};
