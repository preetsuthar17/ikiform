import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { FormField } from "@/lib/database.types";

interface FieldSettingsPanelProps {
  field: FormField | null;
  onFieldUpdate: (field: FormField) => void;
  onClose: () => void;
}

export function FieldSettingsPanel({
  field,
  onFieldUpdate,
  onClose,
}: FieldSettingsPanelProps) {
  if (!field) {
    return (
      <div className="h-full bg-background border-border">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="p-6 bg-accent/50 mb-4 rounded-card">
            <div className="w-12 h-12 bg-muted mx-auto mb-3 rounded-ele"></div>
          </div>
          <p className="text-lg font-medium text-foreground mb-2">
            No field selected
          </p>
          <p className="text-sm text-muted-foreground">
            Click on a field in the preview to edit its settings
          </p>
        </div>
      </div>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate({ ...field, ...updates });
  };

  const updateValidation = (
    validationUpdates: Partial<FormField["validation"]>,
  ) => {
    updateField({
      validation: { ...field.validation, ...validationUpdates },
    });
  };

  const updateSettings = (settingsUpdates: Partial<FormField["settings"]>) => {
    updateField({
      settings: { ...field.settings, ...settingsUpdates },
    });
  };

  const addOption = () => {
    const currentOptions = field.options || [];
    updateField({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    updateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const hasOptions = ["radio", "checkbox", "select"].includes(field.type);
  const isTextType = ["text", "email", "textarea"].includes(field.type);
  const isNumberType = field.type === "number";
  const isTextareaType = field.type === "textarea";
  const isSliderType = field.type === "slider";
  const isTagsType = field.type === "tags";
  const isSelectType = field.type === "select";

  return (
    <div className="h-full bg-card border-border">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Field Settings
            </h2>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* Basic Settings - Always shown */}
          <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
            <h3 className="font-medium mb-3 text-card-foreground">
              Basic Settings
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="field-label" className="text-card-foreground">
                  Field Label
                </Label>
                <Input
                  id="field-label"
                  value={field.label}
                  onChange={(e) => updateField({ label: e.target.value })}
                  placeholder="Enter field label"
                  className="bg-input border-border"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="field-placeholder"
                  className="text-card-foreground"
                >
                  Placeholder
                </Label>
                <Input
                  id="field-placeholder"
                  value={field.placeholder || ""}
                  onChange={(e) => updateField({ placeholder: e.target.value })}
                  placeholder="Enter placeholder text"
                  className="bg-input border-border"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="field-description"
                  className="text-card-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="field-description"
                  value={field.description || ""}
                  onChange={(e) => updateField({ description: e.target.value })}
                  placeholder="Enter field description (shown below the field)"
                  className="bg-input border-border"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  size={"sm"}
                  id="field-required"
                  checked={field.required}
                  onCheckedChange={(required) => updateField({ required })}
                />
                <Label
                  htmlFor="field-required"
                  className="text-card-foreground"
                >
                  Required field
                </Label>
              </div>
            </div>
          </Card>

          {/* Options for radio, checkbox - Only render if field has options */}
          {hasOptions && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-card-foreground">Options</h3>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {(field.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="bg-input border-border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(field.options || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No options added yet
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Validation Settings - Only render if field supports validation */}
          {(isTextType || isNumberType) && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Validation
              </h3>
              <div className="space-y-4">
                {isTextType && (
                  <>
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="min-length"
                        className="text-card-foreground"
                      >
                        Minimum Length
                      </Label>
                      <Input
                        id="min-length"
                        type="number"
                        value={field.validation?.minLength || ""}
                        onChange={(e) =>
                          updateValidation({
                            minLength: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Min characters"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="max-length"
                        className="text-card-foreground"
                      >
                        Maximum Length
                      </Label>
                      <Input
                        id="max-length"
                        type="number"
                        value={field.validation?.maxLength || ""}
                        onChange={(e) =>
                          updateValidation({
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
                          updateValidation({
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
                      <Label
                        htmlFor="min-value"
                        className="text-card-foreground"
                      >
                        Minimum Value
                      </Label>
                      <Input
                        id="min-value"
                        type="number"
                        value={field.validation?.min || ""}
                        onChange={(e) =>
                          updateValidation({
                            min: parseInt(e.target.value) || undefined,
                          })
                        }
                        placeholder="Min value"
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label
                        htmlFor="max-value"
                        className="text-card-foreground"
                      >
                        Maximum Value
                      </Label>
                      <Input
                        id="max-value"
                        type="number"
                        value={field.validation?.max || ""}
                        onChange={(e) =>
                          updateValidation({
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
          )}

          {/* Custom Error Messages - Only render if field has validation or is required */}
          {(field.required || isTextType || isNumberType) && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Custom Error Messages
              </h3>
              <div className="space-y-4">
                {field.required && (
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="required-message"
                      className="text-card-foreground"
                    >
                      Required Field Message
                    </Label>
                    <Input
                      id="required-message"
                      value={field.validation?.requiredMessage || ""}
                      onChange={(e) =>
                        updateValidation({
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
                            updateValidation({
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
                            updateValidation({
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
                            updateValidation({
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
                        <Label
                          htmlFor="email-message"
                          className="text-card-foreground"
                        >
                          Email Error Message
                        </Label>
                        <Input
                          id="email-message"
                          value={field.validation?.emailMessage || ""}
                          onChange={(e) =>
                            updateValidation({
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
                            updateValidation({
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
                            updateValidation({
                              maxMessage: e.target.value || undefined,
                            })
                          }
                          placeholder={`Must be no more than ${field.validation.max}`}
                          className="bg-input border-border"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="number-message"
                        className="text-card-foreground"
                      >
                        Invalid Number Message
                      </Label>
                      <Input
                        id="number-message"
                        value={field.validation?.numberMessage || ""}
                        onChange={(e) =>
                          updateValidation({
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
          )}

          {/* Visual Customization */}
          <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
            <h3 className="font-medium mb-3 text-card-foreground">
              Visual Settings
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="help-text" className="text-card-foreground">
                  Help Text
                </Label>
                <Textarea
                  id="help-text"
                  value={field.settings?.helpText || ""}
                  onChange={(e) =>
                    updateSettings({ helpText: e.target.value || undefined })
                  }
                  placeholder="Additional help text shown below the field"
                  className="bg-input border-border"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="field-size" className="text-card-foreground">
                    Size
                  </Label>
                  <Select
                    value={field.settings?.size || "md"}
                    onValueChange={(value) =>
                      updateSettings({
                        size: value as "sm" | "md" | "lg",
                      })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="field-width" className="text-card-foreground">
                    Width
                  </Label>
                  <Select
                    value={field.settings?.width || "full"}
                    onValueChange={(value) =>
                      updateSettings({
                        width: value as "full" | "half" | "third" | "quarter",
                      })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                      <SelectItem value="third">Third Width</SelectItem>
                      <SelectItem value="quarter">Quarter Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="field-variant" className="text-card-foreground">
                  Variant
                </Label>
                <Select
                  value={field.settings?.variant || "default"}
                  onValueChange={(value) =>
                    updateSettings({
                      variant: value as
                        | "default"
                        | "filled"
                        | "ghost"
                        | "underline",
                    })
                  }
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Field-specific Settings - Only render if field has specific settings */}
          {isTextareaType && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Field Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="textarea-rows"
                    className="text-card-foreground"
                  >
                    Number of Rows
                  </Label>
                  <Input
                    id="textarea-rows"
                    type="number"
                    value={field.settings?.rows || 4}
                    onChange={(e) =>
                      updateSettings({ rows: parseInt(e.target.value) || 4 })
                    }
                    min="2"
                    max="20"
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Slider Settings */}
          {isSliderType && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Slider Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slider-min" className="text-card-foreground">
                    Minimum Value
                  </Label>
                  <Input
                    id="slider-min"
                    type="number"
                    value={field.settings?.min || 0}
                    onChange={(e) =>
                      updateSettings({ min: parseInt(e.target.value) || 0 })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slider-max" className="text-card-foreground">
                    Maximum Value
                  </Label>
                  <Input
                    id="slider-max"
                    type="number"
                    value={field.settings?.max || 100}
                    onChange={(e) =>
                      updateSettings({ max: parseInt(e.target.value) || 100 })
                    }
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slider-step" className="text-card-foreground">
                    Step Size
                  </Label>
                  <Input
                    id="slider-step"
                    type="number"
                    value={field.settings?.step || 1}
                    onChange={(e) =>
                      updateSettings({ step: parseInt(e.target.value) || 1 })
                    }
                    min="1"
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="slider-default"
                    className="text-card-foreground"
                  >
                    Default Value
                  </Label>
                  <Input
                    id="slider-default"
                    type="number"
                    value={field.settings?.defaultValue || 50}
                    onChange={(e) =>
                      updateSettings({
                        defaultValue: parseInt(e.target.value) || 50,
                      })
                    }
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Tags Settings */}
          {isTagsType && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Tags Settings
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tags-max" className="text-card-foreground">
                    Maximum Tags
                  </Label>
                  <Input
                    id="tags-max"
                    type="number"
                    value={field.settings?.maxTags || 10}
                    onChange={(e) =>
                      updateSettings({
                        maxTags: parseInt(e.target.value) || 10,
                      })
                    }
                    min="1"
                    className="bg-input border-border"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tags-duplicates"
                    checked={field.settings?.allowDuplicates || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ allowDuplicates: checked })
                    }
                  />
                  <Label
                    htmlFor="tags-duplicates"
                    className="text-card-foreground"
                  >
                    Allow Duplicate Tags
                  </Label>
                </div>
              </div>
            </Card>
          )}

          {/* Select Settings */}
          {isSelectType && (
            <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
              <h3 className="font-medium mb-3 text-card-foreground">
                Select Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="select-multiple"
                    checked={field.settings?.allowMultiple || false}
                    onCheckedChange={(checked) =>
                      updateSettings({ allowMultiple: checked })
                    }
                  />
                  <Label
                    htmlFor="select-multiple"
                    className="text-card-foreground"
                  >
                    Allow Multiple Selection
                  </Label>
                </div>
              </div>
            </Card>
          )}

          {/* Field Type Info - Always shown */}
          {/* <Card
            className="p-4 bg-accent/50 border-accent rounded-ele"
          >
            <h3 className="font-medium text-accent-foreground mb-2">
              Field Type:{" "}
              {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {field.type === "text" &&
                "Single line text input for short responses"}
              {field.type === "email" &&
                "Email address input with built-in validation"}
              {field.type === "textarea" &&
                "Multi-line text input for longer responses"}
              {field.type === "radio" &&
                "Radio buttons for selecting one option"}
              {field.type === "checkbox" &&
                "Checkboxes for selecting multiple options"}
              {field.type === "number" && "Numeric input with validation"}
              {field.type === "select" && "Dropdown menu for selecting options"}
              {field.type === "slider" && "Range slider for numeric values"}
              {field.type === "tags" && "Input for adding multiple tags"}
            </p>
          </Card> */}
        </div>
      </ScrollArea>
    </div>
  );
}
