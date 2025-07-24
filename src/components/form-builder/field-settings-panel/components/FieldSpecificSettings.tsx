// External imports
import React from "react";
import { useState } from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Component imports
import { EmailValidationSettings } from "./EmailValidationSettings";

// Type imports
import type { FormField } from "@/lib/database";
import { Cross, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FieldSpecificSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
  onFieldUpdate: (field: FormField) => void;
}

export function FieldSpecificSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSpecificSettingsProps) {
  const isTextareaType = field.type === "textarea";
  const isSliderType = field.type === "slider";
  const isTagsType = field.type === "tags";
  const isSelectType = field.type === "select";
  const isEmailType = field.type === "email";
  const isDateType = field.type === "date";
  const isSocialType = field.type === "social";
  const isTimeType = field.type === "time";

  // Don't render if field doesn't have specific settings
  if (
    !isTextareaType &&
    !isSliderType &&
    !isTagsType &&
    !isSelectType &&
    !isEmailType &&
    !isDateType &&
    !isSocialType &&
    !isTimeType &&
    field.type !== "poll" &&
    field.type !== "rating"
  ) {
    return null;
  }
  if (isTimeType) {
    return (
      <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
        <h3 className="font-medium text-card-foreground">
          Time Field Settings
        </h3>
        <div className="flex items-center gap-2">
          <Switch
            id="showCurrentTimeButton"
            checked={!!field.settings?.showCurrentTimeButton}
            onCheckedChange={(checked) =>
              onUpdateSettings({ showCurrentTimeButton: checked })
            }
            label="Show 'Set Current Time' Button"
            size="sm"
          />
        </div>
      </Card>
    );
  }

  const [newOption, setNewOption] = useState("");

  return (
    <>
      {/* Email Validation Settings */}
      {isEmailType && (
        <EmailValidationSettings
          field={field}
          onUpdateSettings={onUpdateSettings}
        />
      )}

      {/* Date Field Settings */}
      {isDateType && null}

      {/* Textarea Settings */}
      {isTextareaType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Field Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="textarea-rows" className="text-card-foreground">
                Number of Rows
              </Label>
              <Input
                id="textarea-rows"
                type="number"
                value={field.settings?.rows || 4}
                onChange={(e) =>
                  onUpdateSettings({ rows: parseInt(e.target.value) || 4 })
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
          <h3 className="font-medium text-card-foreground">Slider Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-min" className="text-card-foreground">
                Minimum Value
              </Label>
              <Input
                id="slider-min"
                type="number"
                value={field.settings?.min || 0}
                onChange={(e) =>
                  onUpdateSettings({ min: parseInt(e.target.value) || 0 })
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
                  onUpdateSettings({ max: parseInt(e.target.value) || 100 })
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
                  onUpdateSettings({ step: parseInt(e.target.value) || 1 })
                }
                min="1"
                className="bg-input border-border"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slider-default" className="text-card-foreground">
                Default Value
              </Label>
              <Input
                id="slider-default"
                type="number"
                value={field.settings?.defaultValue || 50}
                onChange={(e) =>
                  onUpdateSettings({
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
          <h3 className="font-medium text-card-foreground">Tags Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tags-max" className="text-card-foreground">
                Maximum Tags
              </Label>
              <Input
                id="tags-max"
                type="number"
                value={field.settings?.maxTags || 10}
                onChange={(e) =>
                  onUpdateSettings({
                    maxTags: parseInt(e.target.value) || 10,
                  })
                }
                min="1"
                className="bg-input border-border"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="tags-duplicates"
                checked={field.settings?.allowDuplicates || false}
                onCheckedChange={(checked) =>
                  onUpdateSettings({ allowDuplicates: checked })
                }
              />
              <Label htmlFor="tags-duplicates" className="text-card-foreground">
                Allow Duplicate Tags
              </Label>
            </div>
          </div>
        </Card>
      )}

      {/* Social Field Settings */}
      {isSocialType && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Social Platforms</h3>
          <div className="flex flex-wrap gap-3 mb-2">
            {[
              { key: "github", label: "GitHub" },
              { key: "twitter", label: "Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "facebook", label: "Facebook" },
              { key: "instagram", label: "Instagram" },
              { key: "youtube", label: "YouTube" },
              { key: "website", label: "Website" },
            ].map((platform) => (
              <label
                key={platform.key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    field.settings?.socialPlatforms?.includes(platform.key) ||
                    false
                  }
                  onChange={(e) => {
                    const prev = field.settings?.socialPlatforms || [];
                    onUpdateSettings({
                      socialPlatforms: e.target.checked
                        ? [...prev, platform.key]
                        : prev.filter((p) => p !== platform.key),
                    });
                  }}
                />
                {platform.label}
              </label>
            ))}
          </div>
          <h4 className="font-medium text-card-foreground mt-4">
            Custom Links
          </h4>
          <div className="flex flex-col gap-2">
            {(field.settings?.customLinks || []).map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    onUpdateSettings({ customLinks: updated });
                  }}
                />
                <Input
                  type="text"
                  placeholder="Placeholder (optional)"
                  value={link.placeholder || ""}
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = {
                      ...updated[idx],
                      placeholder: e.target.value,
                    };
                    onUpdateSettings({ customLinks: updated });
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="shrink-0"
                  onClick={() => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated.splice(idx, 1);
                    onUpdateSettings({ customLinks: updated });
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-fit mt-2"
              onClick={() => {
                const updated = [
                  ...(field.settings?.customLinks || []),
                  { label: "", placeholder: "" },
                ];
                onUpdateSettings({ customLinks: updated });
              }}
            >
              + Add Custom Link
            </Button>
          </div>
        </Card>
      )}

      {field.type === "poll" && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Poll Settings</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="poll-options" className="text-card-foreground">
              Poll Options
            </Label>
            <div className="flex gap-2">
              <Input
                id="poll-option-input"
                type="text"
                value={newOption || ""}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newOption.trim()) {
                    onUpdateSettings({
                      pollOptions: [
                        ...(field.settings?.pollOptions || []),
                        newOption.trim(),
                      ],
                    });
                    setNewOption("");
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (newOption && newOption.trim()) {
                    onUpdateSettings({
                      pollOptions: [
                        ...(field.settings?.pollOptions || []),
                        newOption.trim(),
                      ],
                    });
                    setNewOption("");
                  }
                }}
                disabled={!newOption || !newOption.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {(field.settings?.pollOptions || []).map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={option}
                    className="flex-1"
                    onChange={(e) => {
                      const updated = [...(field.settings?.pollOptions || [])];
                      updated[idx] = e.target.value;
                      onUpdateSettings({ pollOptions: updated });
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const updated = [...(field.settings?.pollOptions || [])];
                      updated.splice(idx, 1);
                      onUpdateSettings({ pollOptions: updated });
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <Separator>OR</Separator>
            <div className="flex flex-col gap-2">
              <Label htmlFor="poll-options" className="text-card-foreground">
                Fetch Options from API
              </Label>
              <Input
                id="poll-options-api"
                type="url"
                placeholder="https://your-api.com/options"
                value={field.optionsApi || ""}
                onChange={(e) =>
                  onFieldUpdate({ ...field, optionsApi: e.target.value })
                }
                className="bg-input border-border mb-2"
              />
              <div className="flex gap-2 mb-2">
                <Input
                  id="poll-valueKey"
                  type="text"
                  placeholder="Value key (e.g. id)"
                  value={field.valueKey || ""}
                  onChange={(e) =>
                    onFieldUpdate({ ...field, valueKey: e.target.value })
                  }
                  className="bg-input border-border"
                />
                <Input
                  id="poll-labelKey"
                  type="text"
                  placeholder="Label key (e.g. name)"
                  value={field.labelKey || ""}
                  onChange={(e) =>
                    onFieldUpdate({ ...field, labelKey: e.target.value })
                  }
                  className="bg-input border-border"
                />
              </div>
              {field.optionsApi && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
                  <strong>API Data Guidance:</strong> This field will fetch
                  options from the API endpoint:
                  <br />
                  <span className="font-mono text-xs">{field.optionsApi}</span>
                  <br />
                  <span>
                    The API should return either:
                    <ul className="list-disc ml-6 mt-1">
                      <li>
                        <code>["Option 1", "Option 2", ...]</code>{" "}
                        <em>(array of strings)</em>
                      </li>
                      <li>
                        <code>
                          [&#123; value: "opt1", label: "Option 1" &#125;, ...]
                        </code>{" "}
                        <em>(array of objects)</em>
                      </li>
                      <li>
                        <code>&#123; options: [...] &#125;</code>{" "}
                        <em>(object with options array)</em>
                      </li>
                      <li>
                        <code>
                          [&#123; id: "opt1", name: "Option 1" &#125;, ...]
                        </code>{" "}
                        <em>(custom keys)</em>
                      </li>
                    </ul>
                    <span className="block mt-1">
                      You can specify custom keys above to map your API data.
                      <br />
                      Each option must have a <code>value</code> property (or
                      your custom key). <code>label</code> is optional.
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              size={"sm"}
              id="poll-show-results"
              checked={!!field.settings?.showResults}
              onCheckedChange={(checked) =>
                onUpdateSettings({ showResults: checked })
              }
            />
            <Label htmlFor="poll-show-results" className="text-card-foreground">
              Show results after voting
            </Label>
          </div>
        </Card>
      )}

      {field.type === "rating" && (
        <Card className="p-4 bg-background flex flex-col gap-3 rounded-card ">
          <h3 className="font-medium text-card-foreground mb-2">
            Rating Settings
          </h3>
          <div className="grid grid-cols-2 gap-2 items-center">
            <Label htmlFor="rating-star-count" className="text-card-foreground">
              Number of Stars
            </Label>
            <Input
              id="rating-star-count"
              type="number"
              min={1}
              max={10}
              value={field.settings?.starCount || 5}
              onChange={(e) =>
                onUpdateSettings({
                  starCount: Math.max(
                    1,
                    Math.min(10, parseInt(e.target.value) || 5),
                  ),
                })
              }
              className="w-20"
            />
            <Label htmlFor="rating-star-size" className="text-card-foreground">
              Star Size
            </Label>
            <div className="flex items-center gap-2">
              <Slider
                min={16}
                max={64}
                step={1}
                value={[field.settings?.starSize || 28]}
                onValueChange={([val]) => onUpdateSettings({ starSize: val })}
                className="w-28"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">
                {field.settings?.starSize || 28}px
              </span>
            </div>
            <Label htmlFor="rating-icon" className="text-card-foreground">
              Icon Type
            </Label>
            <Select
              value={field.settings?.icon || "star"}
              onValueChange={(val) => onUpdateSettings({ icon: val })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star">Star</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="rating-color" className="text-card-foreground">
              Icon Color
            </Label>
            <Input
              id="rating-color"
              type="color"
              value={field.settings?.color || "#fbbf24"}
              onChange={(e) => onUpdateSettings({ color: e.target.value })}
              className="w-12 h-8 p-0 border-none bg-transparent"
            />
          </div>
        </Card>
      )}

      {field.type === "checkbox" && (
        <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
          <h3 className="font-medium text-card-foreground">Checkbox Options</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkbox-options" className="text-card-foreground">
              Options
            </Label>
            <div className="flex gap-2">
              <Input
                id="checkbox-option-input"
                type="text"
                value={newOption || ""}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newOption.trim()) {
                    onFieldUpdate({
                      ...field,
                      options: [...(field.options || []), newOption.trim()],
                    });
                    setNewOption("");
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (newOption && newOption.trim()) {
                    onFieldUpdate({
                      ...field,
                      options: [...(field.options || []), newOption.trim()],
                    });
                    setNewOption("");
                  }
                }}
                disabled={!newOption || !newOption.trim()}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              {(field.options || []).map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 truncate">
                    {typeof option === "string"
                      ? option
                      : (option.label ?? option.value)}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const updated = [...(field.options || [])];
                      updated.splice(idx, 1);
                      onFieldUpdate({ ...field, options: updated });
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Switch
              id="checkbox-allow-multiple"
              checked={!!field.settings?.allowMultiple}
              onCheckedChange={(checked) =>
                onUpdateSettings({ allowMultiple: checked })
              }
              size="sm"
            />
            <Label
              htmlFor="checkbox-allow-multiple"
              className="text-card-foreground"
            >
              Allow multiple selection
            </Label>
          </div>
          <p className="text-xs text-muted-foreground ml-8">
            If enabled, users can select more than one option. If disabled, only
            one option can be selected.
          </p>
        </Card>
      )}
    </>
  );
}
