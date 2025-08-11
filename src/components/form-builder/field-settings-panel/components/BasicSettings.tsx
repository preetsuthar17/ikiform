import type React from "react";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { BasicSettingsProps } from "../types";

import { createFieldUpdater } from "../utils";

export const BasicSettings: React.FC<BasicSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Basic Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="field-label">
            Field Label
          </Label>
          <Input
            className="border-border bg-input"
            id="field-label"
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
            value={field.label}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="field-placeholder">
            Placeholder
          </Label>
          <Input
            className="border-border bg-input"
            id="field-placeholder"
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            value={field.placeholder || ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="field-description">
            Description
          </Label>
          <Textarea
            className="border-border bg-input"
            id="field-description"
            onChange={(e) => updateField({ description: e.target.value })}
            placeholder="Enter field description (shown below the field)"
            rows={2}
            value={field.description || ""}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={field.required}
            id="field-required"
            onCheckedChange={(required) => updateField({ required })}
            size="sm"
          />
          <Label className="text-card-foreground" htmlFor="field-required">
            Required field
          </Label>
        </div>
      </div>
    </Card>
  );
};
