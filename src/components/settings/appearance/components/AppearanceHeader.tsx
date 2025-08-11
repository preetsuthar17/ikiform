import type React from "react";

import { APPEARANCE_SETTINGS } from "../constants";

export const AppearanceHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold text-2xl">{APPEARANCE_SETTINGS.TITLE}</h2>
      <p className="text-muted-foreground">
        <span>{APPEARANCE_SETTINGS.DESCRIPTION}</span>
      </p>
    </div>
  );
};
