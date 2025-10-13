import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import type { FormField } from "@/lib/database";

interface VisualSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
}

export function VisualSettings({
  field,
  onUpdateSettings,
}: VisualSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="mb-3 font-medium text-card-foreground">Visual Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="help-text">
            Help Text
          </Label>
          <Textarea
            className="border-border bg-input"
            id="help-text"
            onChange={(e) =>
              onUpdateSettings({ helpText: e.target.value || undefined })
            }
            placeholder="Additional help text shown below the field"
            rows={2}
            value={field.settings?.helpText || ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="field-size">
              Size
            </Label>
            <Select
              onValueChange={(value) =>
                onUpdateSettings({
                  size: value as "sm" | "md" | "lg",
                })
              }
              value={field.settings?.size || "md"}
            >
              <SelectTrigger className="border-border bg-input">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="field-width">
              Width
            </Label>
            <Select
              onValueChange={(value) =>
                onUpdateSettings({
                  width: value as "full" | "half" | "third" | "quarter",
                })
              }
              value={field.settings?.width || "full"}
            >
              <SelectTrigger className="border-border bg-input">
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Width</SelectItem>
                <SelectItem value="half">Half Width</SelectItem>
                <SelectItem value="third">Third Width</SelectItem>
                <SelectItem value="quarter">Quarter Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="field-variant">
            Variant
          </Label>
          <Select
            onValueChange={(value) =>
              onUpdateSettings({
                variant: value as "default" | "filled" | "ghost" | "underline",
              })
            }
            value={field.settings?.variant || "default"}
          >
            <SelectTrigger className="border-border bg-input">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
