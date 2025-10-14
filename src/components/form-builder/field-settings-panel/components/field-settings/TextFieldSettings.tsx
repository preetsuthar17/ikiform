import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function TextFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
      <h3 className="font-medium text-card-foreground">Text Field Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="text-max-length">
            Maximum Length
          </Label>
          <Input
            className="border-border bg-input"
            id="text-max-length"
            max="1000"
            min="1"
            onChange={(e) =>
              onFieldUpdate({
                ...field,
                validation: {
                  ...field.validation,
                  maxLength: Number.parseInt(e.target.value) || undefined,
                },
              })
            }
            placeholder="No limit"
            type="number"
            value={field.validation?.maxLength || ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="text-min-length">
            Minimum Length
          </Label>
          <Input
            className="border-border bg-input"
            id="text-min-length"
            max="1000"
            min="0"
            onChange={(e) =>
              onFieldUpdate({
                ...field,
                validation: {
                  ...field.validation,
                  minLength: Number.parseInt(e.target.value) || undefined,
                },
              })
            }
            placeholder="No minimum"
            type="number"
            value={field.validation?.minLength || ""}
          />
        </div>
      </div>
    </Card>
  );
}
