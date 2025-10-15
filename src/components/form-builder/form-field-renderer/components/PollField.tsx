import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BaseFieldProps } from "../types";
import { sanitizeOptions } from "../utils/sanitizeOptions";

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

          if (field.valueKey || field.labelKey) {
            options = options.map((item: any) => ({
              value: field.valueKey ? item[field.valueKey] : item.value,
              label: field.labelKey
                ? item[field.labelKey]
                : item.label || item.value,
            }));
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

  const fakeResults = options.map((opt, i) => ({
    label: typeof opt === "string" ? opt : opt.label || opt.value,
    votes: Math.floor(Math.random() * 20),
  }));
  const totalVotes = fakeResults.reduce((sum, o) => sum + o.votes, 0);

  return (
    <RadioGroup
      disabled={disabled || loading}
      onValueChange={onChange}
      value={value || ""}
    >
      {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
      {options.map((option, idx) => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel =
          typeof option === "string" ? option : option.label || option.value;
        return (
          <>
            <RadioGroupItem
              disabled={disabled || loading}
              key={idx}
              value={optionValue}
            />
            <Label htmlFor={optionValue}>{optionLabel}</Label>
          </>
        );
      })}
    </RadioGroup>
  );
}
