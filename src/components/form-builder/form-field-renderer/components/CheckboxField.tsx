// External imports
import React from "react";

// Component imports
import { Checkbox } from "@/components/ui/checkbox";

// Type imports
import type { BaseFieldProps } from "../types";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function CheckboxField({
  field,
  value,
  onChange,
  disabled,
}: BaseFieldProps) {
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

  return (
    <div className="flex flex-col gap-2">
      {fetchError && <div className="text-red-500 p-2">{fetchError}</div>}
      {options.map((option, index) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel =
          typeof option === "string" ? option : option.label || option.value;
        return (
          <Checkbox
            key={index}
            id={`${field.id}-${index}`}
            label={optionLabel}
            checked={(value || []).includes(optionValue)}
            onCheckedChange={(checked) => {
              const currentValues = value || [];
              if (checked) {
                onChange([...currentValues, optionValue]);
              } else {
                onChange(
                  currentValues.filter((v: string) => v !== optionValue)
                );
              }
            }}
            disabled={disabled || loading}
          />
        );
      })}
    </div>
  );
}
