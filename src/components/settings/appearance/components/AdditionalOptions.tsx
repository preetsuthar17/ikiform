// External imports
import React from "react";
import { Label } from "@/components/ui/label";

// constants
import { APPEARANCE_SETTINGS } from "../constants";

export const AdditionalOptions: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-base font-medium">
        {APPEARANCE_SETTINGS.ADDITIONAL_OPTIONS_LABEL}
      </Label>
      <div className="text-sm text-muted-foreground">
        {APPEARANCE_SETTINGS.ADDITIONAL_OPTIONS_DESCRIPTION}
      </div>
    </div>
  );
};
