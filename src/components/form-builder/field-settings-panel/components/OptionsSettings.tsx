// External imports
import React from "react";

// Component imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Icon imports
import { Plus, X } from "lucide-react";

// Utility imports
import { createFieldUpdater, createOptionHandlers } from "../utils";

// Type imports
import type { OptionsSettingsProps } from "../types";

export const OptionsSettings: React.FC<OptionsSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);
  const { addOption, updateOption, removeOption } = createOptionHandlers(
    field,
    updateField,
  );

  return (
    <Card className="p-4 bg-background flex flex-col gap-4 rounded-card">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">Options</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
          className="flex gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Option
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {(field.options || []).map((option, index) => (
          <div key={index} className="flex items-center gap-2">
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
              className="text-destructive hover:text-destructive/80 flex gap-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {(field.options || []).length === 0 && (
          <p className="text-sm text-muted-foreground">No options added yet</p>
        )}
      </div>
    </Card>
  );
};
