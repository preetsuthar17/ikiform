// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Type imports
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

  // Don't render if field doesn't support validation
  if (!isTextType && !isNumberType) {
    return null;
  }

  return (
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <h3 className="font-medium mb-3 text-card-foreground">Validation</h3>
      <div className="flex flex-col gap-4">
        {isTextType && (
          <>
            <div className="flex flex-col gap-1">
              <Label htmlFor="min-length" className="text-card-foreground">
                Minimum Length
              </Label>
              <Input
                id="min-length"
                type="number"
                value={field.validation?.minLength || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    minLength: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Min characters"
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="max-length" className="text-card-foreground">
                Maximum Length
              </Label>
              <Input
                id="max-length"
                type="number"
                value={field.validation?.maxLength || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    maxLength: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Max characters"
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="pattern" className="text-card-foreground">
                Pattern (Regex)
              </Label>
              <Input
                id="pattern"
                value={field.validation?.pattern || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    pattern: e.target.value || undefined,
                  })
                }
                placeholder="Regular expression"
                className="bg-input border-border"
              />
            </div>
          </>
        )}

        {isNumberType && (
          <>
            <div className="flex flex-col gap-1">
              <Label htmlFor="min-value" className="text-card-foreground">
                Minimum Value
              </Label>
              <Input
                id="min-value"
                type="number"
                value={field.validation?.min || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    min: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Min value"
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="max-value" className="text-card-foreground">
                Maximum Value
              </Label>
              <Input
                id="max-value"
                type="number"
                value={field.validation?.max || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    max: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="Max value"
                className="bg-input border-border"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
