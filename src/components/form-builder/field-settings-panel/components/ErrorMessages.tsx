// External imports
import React from "react";

// UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Types
import type { FormField } from "@/lib/database";

interface ErrorMessagesProps {
  field: FormField;
  onUpdateValidation: (updates: Partial<FormField["validation"]>) => void;
}

export function ErrorMessages({
  field,
  onUpdateValidation,
}: ErrorMessagesProps) {
  const isTextType = ["text", "email", "textarea"].includes(field.type);
  const isNumberType = field.type === "number";

  // Don't render if field doesn't support validation or isn't required
  if (!field.required && !isTextType && !isNumberType) {
    return null;
  }

  return (
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <h3 className="font-medium text-card-foreground">
        Custom Error Messages
      </h3>
      <div className="flex flex-col gap-4">
        {field.required && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="required-message" className="text-card-foreground">
              Required Field Message
            </Label>
            <Input
              id="required-message"
              value={field.validation?.requiredMessage || ""}
              onChange={(e) =>
                onUpdateValidation({
                  requiredMessage: e.target.value || undefined,
                })
              }
              placeholder="This field is required"
              className="bg-input border-border"
            />
          </div>
        )}

        {isTextType && (
          <>
            {field.validation?.minLength && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="min-length-message"
                  className="text-card-foreground"
                >
                  Min Length Error Message
                </Label>
                <Input
                  id="min-length-message"
                  value={field.validation?.minLengthMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      minLengthMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be at least ${field.validation.minLength} characters`}
                  className="bg-input border-border"
                />
              </div>
            )}

            {field.validation?.maxLength && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="max-length-message"
                  className="text-card-foreground"
                >
                  Max Length Error Message
                </Label>
                <Input
                  id="max-length-message"
                  value={field.validation?.maxLengthMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      maxLengthMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be no more than ${field.validation.maxLength} characters`}
                  className="bg-input border-border"
                />
              </div>
            )}

            {field.validation?.pattern && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="pattern-message"
                  className="text-card-foreground"
                >
                  Pattern Error Message
                </Label>
                <Input
                  id="pattern-message"
                  value={field.validation?.patternMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      patternMessage: e.target.value || undefined,
                    })
                  }
                  placeholder="Please enter a valid format"
                  className="bg-input border-border"
                />
              </div>
            )}

            {field.type === "email" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="email-message" className="text-card-foreground">
                  Email Error Message
                </Label>
                <Input
                  id="email-message"
                  value={field.validation?.emailMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      emailMessage: e.target.value || undefined,
                    })
                  }
                  placeholder="Please enter a valid email address"
                  className="bg-input border-border"
                />
              </div>
            )}
          </>
        )}

        {isNumberType && (
          <>
            {field.validation?.min !== undefined && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="min-value-message"
                  className="text-card-foreground"
                >
                  Min Value Error Message
                </Label>
                <Input
                  id="min-value-message"
                  value={field.validation?.minMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      minMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be at least ${field.validation.min}`}
                  className="bg-input border-border"
                />
              </div>
            )}

            {field.validation?.max !== undefined && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="max-value-message"
                  className="text-card-foreground"
                >
                  Max Value Error Message
                </Label>
                <Input
                  id="max-value-message"
                  value={field.validation?.maxMessage || ""}
                  onChange={(e) =>
                    onUpdateValidation({
                      maxMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be no more than ${field.validation.max}`}
                  className="bg-input border-border"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="number-message" className="text-card-foreground">
                Invalid Number Message
              </Label>
              <Input
                id="number-message"
                value={field.validation?.numberMessage || ""}
                onChange={(e) =>
                  onUpdateValidation({
                    numberMessage: e.target.value || undefined,
                  })
                }
                placeholder="Please enter a valid number"
                className="bg-input border-border"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
