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
import { Separator } from "@/components/ui/separator";

export const OptionsSettings: React.FC<OptionsSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);
  const { addOption, updateOption, removeOption } = createOptionHandlers(
    field,
    updateField,
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {
    sanitizeOptions,
  } = require("@/components/form-builder/form-field-renderer/utils/sanitizeOptions");

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
        {sanitizeOptions(field.options || []).map(
          (option: any, index: number) => {
            let value = "";
            if (typeof option === "string") {
              value = option;
            } else if (
              option &&
              typeof option === "object" &&
              "value" in option
            ) {
              value = option.value;
            }
            return (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={value}
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
            );
          },
        )}
        {(field.options || []).length === 0 && (
          <p className="text-sm text-muted-foreground">No options added yet</p>
        )}
      </div>
      <Separator>OR</Separator>
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-card-foreground">Fetch from API</h3>
        <Input
          id="optionsApi"
          type="url"
          placeholder="https://your-api.com/options"
          value={field.optionsApi || ""}
          onChange={(e) => updateField({ optionsApi: e.target.value })}
          className="bg-input border-border"
        />
        <div className="flex gap-2">
          <Input
            id="valueKey"
            type="text"
            placeholder="Value key (e.g. id)"
            value={field.valueKey || ""}
            onChange={(e) => updateField({ valueKey: e.target.value })}
            className="bg-input border-border"
          />
          <Input
            id="labelKey"
            type="text"
            placeholder="Label key (e.g. name)"
            value={field.labelKey || ""}
            onChange={(e) => updateField({ labelKey: e.target.value })}
            className="bg-input border-border"
          />
        </div>
        {field.optionsApi && (
          <div className="flex flex-col gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
            <strong>API Data Guidance:</strong> This field will fetch options
            from the API endpoint:
            <span className="font-mono text-xs">{field.optionsApi}</span>
            <span>
              The API should return either:
              <ul className="list-disc ml-6">
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
                  <code>[&#123; id: "opt1", name: "Option 1" &#125;, ...]</code>{" "}
                  <em>(custom keys)</em>
                </li>
              </ul>
              <span>
                You can specify custom keys above to map your API data.
                <br />
                Each option must have a <code>value</code> property (or your
                custom key). <code>label</code> is optional.
              </span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
