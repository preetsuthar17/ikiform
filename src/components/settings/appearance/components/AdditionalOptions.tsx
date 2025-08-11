import type React from "react";
import { Label } from "@/components/ui/label";

import { APPEARANCE_SETTINGS } from "../constants";

export const AdditionalOptions: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Label className="font-medium text-base">
        {APPEARANCE_SETTINGS.ADDITIONAL_OPTIONS_LABEL}
      </Label>
      <div className="text-muted-foreground text-sm">
        <span>{APPEARANCE_SETTINGS.ADDITIONAL_OPTIONS_DESCRIPTION}</span>
      </div>
    </div>
  );
};
