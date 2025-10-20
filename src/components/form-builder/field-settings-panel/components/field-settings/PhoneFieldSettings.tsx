import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FieldSettingsProps } from "./types";

export function PhoneFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card
      className="gap-2 p-4 shadow-none"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Phone Field Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="phone-pattern">
            Custom Regex Pattern
          </Label>
          <Input
            aria-describedby="phone-pattern-help"
            autoComplete="off"
            id="phone-pattern"
            name="phone-pattern"
            onChange={(e) =>
              onUpdateSettings({ pattern: e.target.value.trim() })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="e.g. ^\\+?[0-9]{10,15}$"
            type="text"
            value={field.settings?.pattern ?? ""}
          />
          <p className="text-muted-foreground text-xs" id="phone-pattern-help">
            Regular expression pattern for phone number validation
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="phone-message">
            Custom Error Message
          </Label>
          <Input
            aria-describedby="phone-message-help"
            autoComplete="off"
            id="phone-message"
            name="phone-message"
            onChange={(e) =>
              onUpdateSettings({ patternMessage: e.target.value.trim() })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="Please enter a valid phone number"
            type="text"
            value={field.settings?.patternMessage ?? ""}
          />
          <p className="text-muted-foreground text-xs" id="phone-message-help">
            Custom error message shown when phone validation fails
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
