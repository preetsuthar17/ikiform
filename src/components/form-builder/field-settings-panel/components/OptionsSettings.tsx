import { Plus, X } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import type { OptionsSettingsProps } from "../types";

import { createFieldUpdater, createOptionHandlers } from "../utils";

export const OptionsSettings: React.FC<OptionsSettingsProps> = ({
  field,
  onFieldUpdate,
}) => {
  const { updateField } = createFieldUpdater(field, onFieldUpdate);
  const { addOption, updateOption, removeOption } = createOptionHandlers(
    field,
    updateField
  );

  const {
    sanitizeOptions,
  } = require("@/components/form-builder/form-field-renderer/utils/sanitizeOptions");

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-card-foreground">Options</h3>
        <Button
          className="flex gap-2"
          onClick={addOption}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
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
              <div className="flex items-center gap-2" key={index}>
                <Input
                  className="border-border bg-input"
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  value={value}
                />
                <Button
                  className="flex gap-2 text-destructive hover:text-destructive/80"
                  onClick={() => removeOption(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          }
        )}
        {(field.options || []).length === 0 && (
          <p className="text-muted-foreground text-sm">No options added yet</p>
        )}
      </div>
      <Separator>OR</Separator>
      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-card-foreground">Fetch from API</h3>
        <Input
          className="border-border bg-input"
          id="optionsApi"
          onChange={(e) => updateField({ optionsApi: e.target.value })}
          placeholder="https://your-api.com/options"
          type="url"
          value={field.optionsApi || ""}
        />
        <div className="flex gap-2">
          <Input
            className="border-border bg-input"
            id="valueKey"
            onChange={(e) => updateField({ valueKey: e.target.value })}
            placeholder="Value key (e.g. id)"
            type="text"
            value={field.valueKey || ""}
          />
          <Input
            className="border-border bg-input"
            id="labelKey"
            onChange={(e) => updateField({ labelKey: e.target.value })}
            placeholder="Label key (e.g. name)"
            type="text"
            value={field.labelKey || ""}
          />
        </div>
        {field.optionsApi && (
          <div className="flex flex-col gap-2 rounded border border-blue-200 bg-blue-50 p-2 text-blue-900 text-xs">
            <strong>API Data Guidance:</strong> This field will fetch options
            from the API endpoint:
            <span className="font-mono text-xs">{field.optionsApi}</span>
            <span>
              The API should return either:
              <ul className="ml-6 list-disc">
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
