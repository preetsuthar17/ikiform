import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBuilderMode, getErrorClasses } from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function SelectField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const errorClasses = getErrorClasses(error);
  const [apiOptions, setApiOptions] = React.useState<string[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (field.optionsApi) {
      setLoading(true);
      fetch(field.optionsApi)
        .then((res) => res.json())
        .then((data) => {
          let options: Array<any> = [];
          if (Array.isArray(data)) {
            options = data;
          } else if (Array.isArray(data.options)) {
            options = data.options;
          }

          if (field.valueKey || field.labelKey) {
            options = options.map((item: any) => {
              return {
                value: field.valueKey ? item[field.valueKey] : item.value,
                label: field.labelKey
                  ? item[field.labelKey]
                  : item.label || item.value,
              };
            });
          }
          setApiOptions(sanitizeOptions(options));
          setLoading(false);
        })
        .catch((err) => {
          setFetchError("Failed to fetch options");
          setLoading(false);
        });
    } else {
      setApiOptions(null);
    }
  }, [field.optionsApi, field.valueKey ?? "", field.labelKey ?? ""]);

  const options = apiOptions ?? field.options ?? [];

  const selectProps = applyBuilderMode({
    disabled: disabled || loading,
    onValueChange: onChange,
    value: value || "",
  }, builderMode);

  const selectTriggerProps = applyBuilderMode({
    className: `flex gap-2 ${errorClasses}`,
    disabled: disabled || loading,
  }, builderMode);

  return (
    <div className={builderMode ? 'pointer-events-none' : ''}>
      <Select {...selectProps}>
        <SelectTrigger {...selectTriggerProps}>
          <SelectValue
            placeholder={
              field.placeholder ||
              (loading ? "Loading..." : "Select an option...")
            }
          />
        </SelectTrigger>
        <SelectContent>
          {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
          {options.map((option, index) => {
            if (typeof option === "string") {
              return (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              );
            }
            if (option && typeof option === "object" && option.value) {
              return (
                <SelectItem key={index} value={option.value}>
                  {option.label || option.value}
                </SelectItem>
              );
            }
            return null;
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
