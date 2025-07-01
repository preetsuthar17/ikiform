import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="h-full bg-card border-l border-border">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div
            className="p-6 bg-accent/50 rounded-lg mb-4"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div
              className="w-12 h-12 bg-muted rounded-lg mx-auto mb-3"
              style={{ borderRadius: "var(--radius)" }}
            ></div>
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
    validationUpdates: Partial<FormField["validation"]>
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
    <div className="h-full bg-card border-l border-border">
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
          <Card
            className="p-4 bg-card border-border"
            style={{ borderRadius: "var(--radius)" }}
          >
            <h3 className="font-medium mb-3 text-card-foreground">
              Basic Settings
            </h3>
            <div className="space-y-4">
              <div>
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

              <div>
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

              <div className="flex items-center space-x-2">
                <Switch
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
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-card-foreground">Options</h3>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
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
                      size="sm"
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
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
              <h3 className="font-medium mb-3 text-card-foreground">
                Validation
              </h3>
              <div className="space-y-4">
                {isTextType && (
                  <>
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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

          {/* Field-specific Settings - Only render if field has specific settings */}
          {isTextareaType && (
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
              <h3 className="font-medium mb-3 text-card-foreground">
                Field Settings
              </h3>
              <div className="space-y-4">
                <div>
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
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
              <h3 className="font-medium mb-3 text-card-foreground">
                Slider Settings
              </h3>
              <div className="space-y-4">
                <div>
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
                <div>
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
                <div>
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
                <div>
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
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
              <h3 className="font-medium mb-3 text-card-foreground">
                Tags Settings
              </h3>
              <div className="space-y-4">
                <div>
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
            <Card
              className="p-4 bg-card border-border"
              style={{ borderRadius: "var(--radius)" }}
            >
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
          <Card
            className="p-4 bg-accent/50 border-accent"
            style={{ borderRadius: "var(--radius)" }}
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
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
