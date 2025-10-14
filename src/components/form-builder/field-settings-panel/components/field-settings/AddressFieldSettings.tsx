import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function AddressFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">
        Address Field Settings
      </h3>
      <div className="flex flex-col gap-2">
        <Label
          className="text-card-foreground"
          htmlFor="address-required-lines"
        >
          Required Address Lines
        </Label>
        <Input
          className="border-border bg-input"
          id="address-required-lines"
          max={5}
          min={1}
          onChange={(e) =>
            onUpdateSettings({
              requiredLines: Number.parseInt(e.target.value),
            })
          }
          placeholder="e.g. 2 (Address Line 1 & City required)"
          type="number"
          value={field.settings?.requiredLines ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-card-foreground" htmlFor="address-message">
          Custom Error Message
        </Label>
        <Input
          className="border-border bg-input"
          id="address-message"
          onChange={(e) =>
            onUpdateSettings({ requiredMessage: e.target.value })
          }
          placeholder="Please complete all required address fields"
          value={field.settings?.requiredMessage ?? ""}
        />
      </div>
    </Card>
  );
}
