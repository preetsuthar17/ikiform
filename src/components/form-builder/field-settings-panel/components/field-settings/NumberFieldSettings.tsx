import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function NumberFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Number Field Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="number-min">
            Minimum Value
          </Label>
          <Input
            className="border-border bg-input"
            id="number-min"
            onChange={(e) =>
              onUpdateSettings({
                min: Number.parseFloat(e.target.value) || undefined,
              })
            }
            placeholder="No minimum"
            type="number"
            value={field.settings?.min || ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="number-max">
            Maximum Value
          </Label>
          <Input
            className="border-border bg-input"
            id="number-max"
            onChange={(e) =>
              onUpdateSettings({
                max: Number.parseFloat(e.target.value) || undefined,
              })
            }
            placeholder="No maximum"
            type="number"
            value={field.settings?.max || ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="number-step">
            Step Size
          </Label>
          <Input
            className="border-border bg-input"
            id="number-step"
            min="0.01"
            onChange={(e) =>
              onUpdateSettings({
                step: Number.parseFloat(e.target.value) || 1,
              })
            }
            placeholder="1"
            type="number"
            value={field.settings?.step || 1}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="number-default">
            Default Value
          </Label>
          <Input
            className="border-border bg-input"
            id="number-default"
            onChange={(e) =>
              onUpdateSettings({
                defaultValue: Number.parseFloat(e.target.value) || undefined,
              })
            }
            placeholder="No default"
            type="number"
            value={field.settings?.defaultValue || ""}
          />
        </div>
      </div>
    </Card>
  );
}
