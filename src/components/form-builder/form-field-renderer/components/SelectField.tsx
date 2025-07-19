// External imports
import React from "react";

// Component imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Utility imports
import { getErrorClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function SelectField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
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
          // Custom mapping
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
          setApiOptions(options);
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

  return (
    <>
      <Select
        value={value || ""}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger
          className={`flex gap-2 ${errorClasses}`}
          disabled={disabled || loading}
        >
          <SelectValue
            placeholder={
              field.placeholder ||
              (loading ? "Loading..." : "Select an option...")
            }
          />
        </SelectTrigger>
        <SelectContent>
          {fetchError && <div className="text-red-500 p-2">{fetchError}</div>}
          {options.map((option, index) => {
            if (typeof option === "string") {
              return (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              );
            } else if (option && typeof option === "object" && option.value) {
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
    </>
  );
}
