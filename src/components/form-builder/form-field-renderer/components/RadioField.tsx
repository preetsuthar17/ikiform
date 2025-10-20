import { CheckCircle } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BaseFieldProps } from "../types";
import {
  applyBuilderMode,
  getBuilderMode,
  getErrorRingClasses,
} from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function RadioField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const errorRingClasses = getErrorRingClasses(error);
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const isFormBuilder =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/form-builder") ||
      window.location.pathname.includes("/demo-form-builder"));

  const isQuizField = field.settings?.isQuizField;
  const correctAnswer = field.settings?.correctAnswer;

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

  const options = apiOptions ?? field.options ?? [];

  const radioGroupProps = applyBuilderMode(
    {
      className: `flex flex-col gap-2 ${errorRingClasses}`,
      disabled: disabled || loading,
      onValueChange: onChange,
      value: value || "",
    },
    builderMode
  );

  return (
    <div className={builderMode ? "pointer-events-none" : ""}>
      <RadioGroup {...radioGroupProps}>
        {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
        {options.filter(Boolean).map((option, index) => {
          let optionValue = "";
          let optionLabel = "";

          if (typeof option === "string") {
            optionValue = option;
            optionLabel = option;
          } else if (option && typeof option === "object") {
            optionValue = option.value || "";
            optionLabel = option.label || option.value || "";
          }

          if (!optionValue) return null;

          const isCorrect = isQuizField && correctAnswer === optionValue;

          if (typeof option === "string" || optionValue) {
            return (
              <div
                className={`relative ${isFormBuilder && isCorrect ? "rounded-md bg-green-50 p-1 ring-1 ring-green-200" : ""}`}
                key={index}
              >
                <RadioGroupItem
                  {...applyBuilderMode(
                    {
                      disabled: disabled || loading,
                      id: `${field.id}-${index}`,
                      value: optionValue,
                    },
                    builderMode
                  )}
                />
                <Label htmlFor={`${field.id}-${index}`}>{optionLabel}</Label>
                {isFormBuilder && isCorrect && (
                  <div
                    className="-translate-y-1/2 absolute top-1/2 right-2 transform"
                    title="Correct Answer"
                  >
                    <CheckCircle className="size-4 text-green-600" />
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </RadioGroup>
    </div>
  );
}
