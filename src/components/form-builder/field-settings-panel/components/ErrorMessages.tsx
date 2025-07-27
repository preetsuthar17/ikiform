// External imports
import React from 'react';
import { Card } from '@/components/ui/card';
// UI components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Types
import type { FormField } from '@/lib/database';

interface ErrorMessagesProps {
  field: FormField;
  onUpdateValidation: (updates: Partial<FormField['validation']>) => void;
}

export function ErrorMessages({
  field,
  onUpdateValidation,
}: ErrorMessagesProps) {
  const isTextType = ['text', 'email', 'textarea'].includes(field.type);
  const isNumberType = field.type === 'number';

  // Don't render if field doesn't support validation or isn't required
  if (!(field.required || isTextType || isNumberType)) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">
        Custom Error Messages
      </h3>
      <div className="flex flex-col gap-4">
        {field.required && (
          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="required-message">
              Required Field Message
            </Label>
            <Input
              className="border-border bg-input"
              id="required-message"
              onChange={(e) =>
                onUpdateValidation({
                  requiredMessage: e.target.value || undefined,
                })
              }
              placeholder="This field is required"
              value={field.validation?.requiredMessage || ''}
            />
          </div>
        )}

        {isTextType && (
          <>
            {field.validation?.minLength && (
              <div className="flex flex-col gap-2">
                <Label
                  className="text-card-foreground"
                  htmlFor="min-length-message"
                >
                  Min Length Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="min-length-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      minLengthMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be at least ${field.validation.minLength} characters`}
                  value={field.validation?.minLengthMessage || ''}
                />
              </div>
            )}

            {field.validation?.maxLength && (
              <div className="flex flex-col gap-2">
                <Label
                  className="text-card-foreground"
                  htmlFor="max-length-message"
                >
                  Max Length Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="max-length-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      maxLengthMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be no more than ${field.validation.maxLength} characters`}
                  value={field.validation?.maxLengthMessage || ''}
                />
              </div>
            )}

            {field.validation?.pattern && (
              <div className="flex flex-col gap-2">
                <Label
                  className="text-card-foreground"
                  htmlFor="pattern-message"
                >
                  Pattern Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="pattern-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      patternMessage: e.target.value || undefined,
                    })
                  }
                  placeholder="Please enter a valid format"
                  value={field.validation?.patternMessage || ''}
                />
              </div>
            )}

            {field.type === 'email' && (
              <div className="flex flex-col gap-2">
                <Label className="text-card-foreground" htmlFor="email-message">
                  Email Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="email-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      emailMessage: e.target.value || undefined,
                    })
                  }
                  placeholder="Please enter a valid email address"
                  value={field.validation?.emailMessage || ''}
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
                  className="text-card-foreground"
                  htmlFor="min-value-message"
                >
                  Min Value Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="min-value-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      minMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be at least ${field.validation.min}`}
                  value={field.validation?.minMessage || ''}
                />
              </div>
            )}

            {field.validation?.max !== undefined && (
              <div className="flex flex-col gap-2">
                <Label
                  className="text-card-foreground"
                  htmlFor="max-value-message"
                >
                  Max Value Error Message
                </Label>
                <Input
                  className="border-border bg-input"
                  id="max-value-message"
                  onChange={(e) =>
                    onUpdateValidation({
                      maxMessage: e.target.value || undefined,
                    })
                  }
                  placeholder={`Must be no more than ${field.validation.max}`}
                  value={field.validation?.maxMessage || ''}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="number-message">
                Invalid Number Message
              </Label>
              <Input
                className="border-border bg-input"
                id="number-message"
                onChange={(e) =>
                  onUpdateValidation({
                    numberMessage: e.target.value || undefined,
                  })
                }
                placeholder="Please enter a valid number"
                value={field.validation?.numberMessage || ''}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
