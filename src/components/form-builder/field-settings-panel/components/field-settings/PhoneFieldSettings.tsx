import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function PhoneFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">Phone Field Settings</h3>
      <div className="flex flex-col gap-2">
        <Label className="text-card-foreground" htmlFor="phone-pattern">
          Custom Regex Pattern
        </Label>
        <Input
          className="border-border bg-input"
          id="phone-pattern"
          onChange={(e) => onUpdateSettings({ pattern: e.target.value })}
          placeholder="e.g. ^\\+?[0-9]{10,15}$"
          value={field.settings?.pattern ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-card-foreground" htmlFor="phone-message">
          Custom Error Message
        </Label>
        <Input
          className="border-border bg-input"
          id="phone-message"
          onChange={(e) => onUpdateSettings({ patternMessage: e.target.value })}
          placeholder="Please enter a valid phone number"
          value={field.settings?.patternMessage ?? ""}
        />
      </div>
    </Card>
  );
}
