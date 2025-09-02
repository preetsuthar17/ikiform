import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function TagsFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Tags Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="tags-max">
            Maximum Tags
          </Label>
          <Input
            className="border-border bg-input"
            id="tags-max"
            min="1"
            onChange={(e) =>
              onUpdateSettings({
                maxTags: Number.parseInt(e.target.value) || 10,
              })
            }
            type="number"
            value={field.settings?.maxTags || 10}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={field.settings?.allowDuplicates}
            id="tags-duplicates"
            onCheckedChange={(checked) =>
              onUpdateSettings({ allowDuplicates: checked })
            }
          />
          <Label className="text-card-foreground" htmlFor="tags-duplicates">
            Allow Duplicate Tags
          </Label>
        </div>
      </div>
    </Card>
  );
}
