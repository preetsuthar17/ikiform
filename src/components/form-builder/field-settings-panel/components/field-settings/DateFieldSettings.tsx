import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function DateFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Date Field Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="date-min">
            Minimum Date
          </Label>
          <Input
            className="border-border bg-input"
            id="date-min"
            onChange={(e) =>
              onUpdateSettings({
                min: e.target.value ? new Date(e.target.value).getTime() : undefined,
              })
            }
            type="date"
            value={
              typeof field.settings?.min === "number"
                ? new Date(field.settings.min).toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="date-max">
            Maximum Date
          </Label>
          <Input
            className="border-border bg-input"
            id="date-max"
            onChange={(e) =>
              onUpdateSettings({
                max: e.target.value ? new Date(e.target.value).getTime() : undefined,
              })
            }
            type="date"
            value={
              typeof field.settings?.max === "number"
                ? new Date(field.settings.max).toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="date-default">
            Default Date
          </Label>
          <Input
            className="border-border bg-input"
            id="date-default"
            onChange={(e) =>
              onUpdateSettings({
                defaultValue: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
            type="date"
            value={
              field.settings?.defaultValue
                ? new Date(field.settings.defaultValue).toISOString().slice(0, 10)
                : ""
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!field.settings?.showCurrentTimeButton}
            id="date-show-current"
            onCheckedChange={(checked) =>
              onUpdateSettings({ showCurrentTimeButton: checked })
            }
            size="sm"
          />
          <Label className="text-card-foreground" htmlFor="date-show-current">
            Show "Today" button
          </Label>
        </div>
      </div>
    </Card>
  );
}
