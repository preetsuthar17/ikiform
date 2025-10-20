import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function AddressFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Address Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-sm"
            htmlFor="address-required-lines"
          >
            Required Address Lines
          </Label>
          <Input
            aria-describedby="address-required-lines-help"
            autoComplete="off"
            id="address-required-lines"
            max={5}
            min={1}
            name="address-required-lines"
            onChange={(e) =>
              onUpdateSettings({
                requiredLines: Number.parseInt(e.target.value),
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="e.g. 2 (Address Line 1 & City required)"
            type="number"
            value={field.settings?.requiredLines ?? ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="address-required-lines-help"
          >
            Number of address lines that must be filled (1-5)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="address-message">
            Custom Error Message
          </Label>
          <Input
            aria-describedby="address-message-help"
            autoComplete="off"
            id="address-message"
            name="address-message"
            onChange={(e) =>
              onUpdateSettings({ requiredMessage: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Please complete all required address fields"
            type="text"
            value={field.settings?.requiredMessage ?? ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="address-message-help"
          >
            Custom error message shown when required address fields are
            incomplete
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
