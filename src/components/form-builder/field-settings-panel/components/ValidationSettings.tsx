import React from "react";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FormField } from "@/lib/database";

interface ValidationSettingsProps {
  field: FormField;
  onUpdateValidation: (updates: Partial<FormField["validation"]>) => void;
}

export function ValidationSettings({
  field,
  onUpdateValidation,
}: ValidationSettingsProps) {
  const isTextType = ["text", "email", "textarea"].includes(field.type);
  const isNumberType = field.type === "number";

  if (!(isTextType || isNumberType)) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="mb-3 font-medium text-card-foreground">Validation</h3>
      <div className="flex flex-col gap-4">
        {isTextType && (
          <>
            <div className="flex flex-col gap-1">
              <Label className="text-card-foreground" htmlFor="min-length">
                Minimum Length
              </Label>
              <Input
                className="border-border bg-input"
                id="min-length"
                onChange={(e) =>
                  onUpdateValidation({
                    minLength: Number.parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Min characters"
                type="number"
                value={field.validation?.minLength || ""}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-card-foreground" htmlFor="max-length">
                Maximum Length
              </Label>
              <Input
                className="border-border bg-input"
                id="max-length"
                onChange={(e) =>
                  onUpdateValidation({
                    maxLength: Number.parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Max characters"
                type="number"
                value={field.validation?.maxLength || ""}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-card-foreground" htmlFor="pattern">
                Pattern (Regex)
              </Label>
              <Input
                className="border-border bg-input"
                id="pattern"
                onChange={(e) =>
                  onUpdateValidation({
                    pattern: e.target.value || undefined,
                  })
                }
                placeholder="Regular expression"
                value={field.validation?.pattern || ""}
              />
            </div>
          </>
        )}

        {isNumberType && (
          <>
            <div className="flex flex-col gap-1">
              <Label className="text-card-foreground" htmlFor="min-value">
                Minimum Value
              </Label>
              <Input
                className="border-border bg-input"
                id="min-value"
                onChange={(e) =>
                  onUpdateValidation({
                    min: Number.parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Min value"
                type="number"
                value={field.validation?.min || ""}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-card-foreground" htmlFor="max-value">
                Maximum Value
              </Label>
              <Input
                className="border-border bg-input"
                id="max-value"
                onChange={(e) =>
                  onUpdateValidation({
                    max: Number.parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Max value"
                type="number"
                value={field.validation?.max || ""}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
