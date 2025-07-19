// External imports
import React from "react";

// Component imports
import { RadioGroup, RadioItem } from "@/components/ui/radio";

// Utility imports
import { getErrorRingClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function RadioField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
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
    <RadioGroup
      value={value || ""}
      onValueChange={onChange}
      className={`flex gap-2 ${errorRingClasses}`}
      disabled={disabled || loading}
    >
      {fetchError && <div className="text-red-500 p-2">{fetchError}</div>}
      {options.map((option, index) => {
        if (typeof option === "string") {
          return (
            <RadioItem
              key={index}
              value={option}
              id={`${field.id}-${index}`}
              label={option}
              disabled={disabled || loading}
            />
          );
        } else if (option && typeof option === "object" && option.value) {
          return (
            <RadioItem
              key={index}
              value={option.value}
              id={`${field.id}-${index}`}
              label={option.label || option.value}
              disabled={disabled || loading}
            />
          );
        }
        return null;
      })}
    </RadioGroup>
  );
}
