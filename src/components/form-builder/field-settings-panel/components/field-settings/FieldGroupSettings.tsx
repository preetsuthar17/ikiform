import { ChevronDown, Settings, X } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  createFieldFromType,
  FIELD_CATEGORIES,
  FIELD_TYPE_CONFIGS,
} from "@/lib/fields/field-config";
import { FieldSpecificSettings } from "../FieldSpecificSettings";
import type { FieldSettingsProps } from "./types";

export function FieldGroupSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const groupFields = field.settings?.groupFields || [];
  const groupLayout = field.settings?.groupLayout || "horizontal";
  const groupSpacing = field.settings?.groupSpacing || "normal";
  const groupColumns = field.settings?.groupColumns || 2;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const addFieldToGroup = (fieldType: string) => {
    const newField = createFieldFromType(fieldType as any);
    const updatedGroupFields = [...groupFields, newField];
    onUpdateSettings({
      groupFields: updatedGroupFields,
    });
  };

  const removeFieldFromGroup = (fieldId: string) => {
    const updatedGroupFields = groupFields.filter((f) => f.id !== fieldId);
    onUpdateSettings({
      groupFields: updatedGroupFields,
    });
  };

  const updateGroupField = (fieldId: string, updates: any) => {
    const updatedGroupFields = groupFields.map((f) =>
      f.id === fieldId ? { ...f, ...updates } : f
    );
    onUpdateSettings({
      groupFields: updatedGroupFields,
    });
  };

  const toggleFieldExpansion = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Layout Settings */}
      <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
        <h3 className="font-medium text-card-foreground">Layout Settings</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="group-layout">
              Layout Direction
            </Label>
            <Select
              onValueChange={(value) =>
                onUpdateSettings({
                  groupLayout: value as "horizontal" | "vertical",
                })
              }
              value={groupLayout}
            >
              <SelectTrigger className="border-border bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">
                  Horizontal (Side by Side)
                </SelectItem>
                <SelectItem value="vertical">Vertical (Stacked)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {groupLayout === "horizontal" && (
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="group-columns">
                Number of Columns
              </Label>
              <Select
                onValueChange={(value) =>
                  onUpdateSettings({
                    groupColumns: Number.parseInt(value) as 2 | 3 | 4,
                  })
                }
                value={groupColumns.toString()}
              >
                <SelectTrigger className="border-border bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="group-spacing">
              Field Spacing
            </Label>
            <Select
              onValueChange={(value) =>
                onUpdateSettings({
                  groupSpacing: value as "compact" | "normal" | "relaxed",
                })
              }
              value={groupSpacing}
            >
              <SelectTrigger className="border-border bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Field Management */}
      <Card className="flex flex-col gap-4 rounded-2xl bg-background p-4">
        <h3 className="font-medium text-card-foreground">
          Group Fields ({groupFields.length})
        </h3>

        {/* Add Field Picker */}
        <div className="flex justify-start">
          <Dialog onOpenChange={setPickerOpen} open={pickerOpen}>
            <DialogTrigger asChild>
              <Button size="sm" type="button" variant="outline">
                + Add field
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl p-0">
              <DialogHeader className="px-4 pt-4">
                <DialogTitle>Add a field</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] p-4 pt-2">
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(FIELD_CATEGORIES).map(([key, title]) => (
                    <div className="flex flex-col gap-3" key={key}>
                      <div className="px-1 text-muted-foreground text-xs uppercase tracking-wide">
                        {title}
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {FIELD_TYPE_CONFIGS.filter(
                          (f) => f.category === (key as any)
                        ).map((f) => (
                          <button
                            className="flex items-start gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-accent"
                            key={f.type}
                            onClick={() => {
                              addFieldToGroup(f.type);
                              setPickerOpen(false);
                            }}
                            type="button"
                          >
                            <f.icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground text-sm">
                                {f.label}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {f.description}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Field List */}
        {groupFields.length === 0 ? (
          <div className="rounded-md border border-border border-dashed p-6 text-center text-muted-foreground">
            <p className="text-sm">No fields in this group yet.</p>
            <p className="text-xs">
              Add fields using the dropdown or quick add buttons above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-3xl bg-background p-2">
            {groupFields.map((groupField) => (
              <Card className="rounded-2xl p-3" key={groupField.id}>
                <div className="flex flex-col gap-3">
                  {/* Field Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-card-foreground text-sm">
                        {groupField.label || `${groupField.type} Field`}
                      </h4>
                      <span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
                        {groupField.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        className="h-8 w-8 p-0"
                        onClick={() => toggleFieldExpansion(groupField.id)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeFieldFromGroup(groupField.id)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Basic Field Settings */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label
                        className="text-card-foreground text-xs"
                        htmlFor={`${groupField.id}-label`}
                      >
                        Field Label
                      </Label>
                      <Input
                        className="border-border bg-input"
                        id={`${groupField.id}-label`}
                        onChange={(e) =>
                          updateGroupField(groupField.id, {
                            label: e.target.value,
                          })
                        }
                        placeholder="Enter field label"
                        value={groupField.label}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        className="text-card-foreground text-xs"
                        htmlFor={`${groupField.id}-placeholder`}
                      >
                        Placeholder Text
                      </Label>
                      <Input
                        className="border-border bg-input"
                        id={`${groupField.id}-placeholder`}
                        onChange={(e) =>
                          updateGroupField(groupField.id, {
                            placeholder: e.target.value,
                          })
                        }
                        placeholder="Enter placeholder text"
                        value={groupField.placeholder || ""}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={groupField.required}
                      id={`${groupField.id}-required`}
                      onCheckedChange={(checked) =>
                        updateGroupField(groupField.id, { required: checked })
                      }
                      size="sm"
                    />
                    <Label
                      className="text-card-foreground text-xs"
                      htmlFor={`${groupField.id}-required`}
                    >
                      Required field
                    </Label>
                  </div>

                  {/* Field-Specific Settings */}
                  <Collapsible
                    onOpenChange={() => toggleFieldExpansion(groupField.id)}
                    open={expandedFields.has(groupField.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        className="w-full justify-between"
                        type="button"
                        variant="outline"
                      >
                        <span className="text-card-foreground text-sm">
                          Advance Settings
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedFields.has(groupField.id) ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-4 rounded-3xl border border-border">
                      <div className="rounded-md bg-background p-3">
                        <FieldSpecificSettings
                          field={groupField}
                          onFieldUpdate={(updatedField) =>
                            updateGroupField(groupField.id, updatedField)
                          }
                          onUpdateSettings={(settings) =>
                            updateGroupField(groupField.id, {
                              settings: { ...groupField.settings, ...settings },
                            })
                          }
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
