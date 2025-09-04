import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";
import { OptionsSettings } from "../OptionsSettings";

export function SelectFieldSettings({
  field,
  onFieldUpdate,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Select Options</h3>
      <Label className="text-muted-foreground text-sm">
        Configure options for Select dropdown. You can add options manually or
        fetch them from an API.
      </Label>
      <OptionsSettings field={field} onFieldUpdate={onFieldUpdate} />
    </Card>
  );
}


