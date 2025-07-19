import React from "react";
import type { BaseFieldProps } from "../types";
import { sanitizeOptions } from "../utils/sanitizeOptions";
import { RadioGroup, RadioItem } from "@/components/ui/radio";

export function PollField({
  field,
  value,
  onChange,
  error,
  fieldRef,
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

  const options = apiOptions ?? field.settings?.pollOptions ?? [];
  const showResults = !!field.settings?.showResults;

  // For demo: fake results
  const fakeResults = options.map((opt, i) => ({
    label: typeof opt === "string" ? opt : opt.label || opt.value,
    votes: Math.floor(Math.random() * 20),
  }));
  const totalVotes = fakeResults.reduce((sum, o) => sum + o.votes, 0);

  return (
    <RadioGroup
      value={value || ""}
      onValueChange={onChange}
      error={error}
      disabled={disabled || loading}
    >
      {fetchError && <div className="text-red-500 p-2">{fetchError}</div>}
      {options.map((option, idx) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel =
          typeof option === "string" ? option : option.label || option.value;
        return (
          <RadioItem
            key={idx}
            value={optionValue}
            label={optionLabel}
            disabled={disabled || loading}
          />
        );
      })}
    </RadioGroup>
  );
}
