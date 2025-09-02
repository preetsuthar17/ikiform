import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function SliderFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Slider Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="slider-min">
            Minimum Value
          </Label>
          <Input
            className="border-border bg-input"
            id="slider-min"
            onChange={(e) =>
              onUpdateSettings({
                min: Number.parseInt(e.target.value) || 0,
              })
            }
            type="number"
            value={field.settings?.min || 0}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="slider-max">
            Maximum Value
          </Label>
          <Input
            className="border-border bg-input"
            id="slider-max"
            onChange={(e) =>
              onUpdateSettings({
                max: Number.parseInt(e.target.value) || 100,
              })
            }
            type="number"
            value={field.settings?.max || 100}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="slider-step">
            Step Size
          </Label>
          <Input
            className="border-border bg-input"
            id="slider-step"
            min="1"
            onChange={(e) =>
              onUpdateSettings({
                step: Number.parseInt(e.target.value) || 1,
              })
            }
            type="number"
            value={field.settings?.step || 1}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="slider-default">
            Default Value
          </Label>
          <Input
            className="border-border bg-input"
            id="slider-default"
            onChange={(e) =>
              onUpdateSettings({
                defaultValue: Number.parseInt(e.target.value) || 50,
              })
            }
            type="number"
            value={field.settings?.defaultValue || 50}
          />
        </div>
      </div>
    </Card>
  );
}
