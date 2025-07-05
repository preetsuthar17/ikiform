// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

// Utility imports
import { createFieldUpdater } from "../utils";

// Type imports
import type { BasicSettingsProps } from "../types";

export const BasicSettings: React.FC<BasicSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);

  return (
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <h3 className="font-medium text-card-foreground">Basic Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="field-label" className="text-card-foreground">
            Field Label
          </Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder="Enter field label"
            className="bg-input border-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="field-placeholder" className="text-card-foreground">
            Placeholder
          </Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ""}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="bg-input border-border"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="field-description" className="text-card-foreground">
            Description
          </Label>
          <Textarea
            id="field-description"
            value={field.description || ""}
            onChange={(e) => updateField({ description: e.target.value })}
            placeholder="Enter field description (shown below the field)"
            className="bg-input border-border"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="field-required"
            checked={field.required}
            onCheckedChange={(required) => updateField({ required })}
          />
          <Label htmlFor="field-required" className="text-card-foreground">
            Required field
          </Label>
        </div>
      </div>
    </Card>
  );
};
