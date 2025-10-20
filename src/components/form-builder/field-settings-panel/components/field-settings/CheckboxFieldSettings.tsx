import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { FieldSettingsProps } from "./types";

export function CheckboxFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const [newOption, setNewOption] = useState("");

  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Checkbox Options</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="checkbox-options">
            Options
          </Label>
          <div className="flex gap-2">
            <Input
              aria-describedby="checkbox-options-help"
              autoComplete="off"
              className="flex-1"
              id="checkbox-option-input"
              name="checkbox-option-input"
              onChange={(e) => setNewOption(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newOption.trim()) {
                  e.preventDefault();
                  onFieldUpdate({
                    ...field,
                    options: [...(field.options || []), newOption.trim()],
                  });
                  setNewOption("");
                } else if (e.key === "Escape") {
                  e.currentTarget.blur();
                }
              }}
              placeholder="Add option"
              type="text"
              value={newOption || ""}
            />
            <Button
              aria-label="Add checkbox option"
              className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              disabled={!(newOption && newOption.trim())}
              onClick={() => {
                if (newOption && newOption.trim()) {
                  onFieldUpdate({
                    ...field,
                    options: [...(field.options || []), newOption.trim()],
                  });
                  setNewOption("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (newOption && newOption.trim()) {
                    onFieldUpdate({
                      ...field,
                      options: [...(field.options || []), newOption.trim()],
                    });
                    setNewOption("");
                  }
                }
              }}
              size="icon"
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />
            </Button>
          </div>
          <p
            className="text-muted-foreground text-xs"
            id="checkbox-options-help"
          >
            Add checkbox options that users can select from
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {(field.options || []).map((option, idx) => (
            <div className="flex items-center gap-2" key={idx}>
              <span className="flex-1 truncate">
                {typeof option === "string"
                  ? option
                  : (option.label ?? option.value)}
              </span>
              <Button
                aria-label={`Remove option ${idx + 1}`}
                className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                onClick={() => {
                  const updated = [...(field.options || [])];
                  updated.splice(idx, 1);
                  onFieldUpdate({ ...field, options: updated });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const updated = [...(field.options || [])];
                    updated.splice(idx, 1);
                    onFieldUpdate({ ...field, options: updated });
                  }
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label
              className="font-medium text-sm"
              htmlFor="checkbox-allow-multiple"
            >
              Allow multiple selection
            </Label>
            <p className="text-muted-foreground text-xs">
              If enabled, users can select more than one option. If disabled,
              only one option can be selected.
            </p>
          </div>
          <Switch
            aria-describedby="checkbox-allow-multiple-help"
            checked={!!field.settings?.allowMultiple}
            id="checkbox-allow-multiple"
            name="checkbox-allow-multiple"
            onCheckedChange={(checked) =>
              onUpdateSettings({ allowMultiple: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
