"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import type { BaseFieldProps } from "../types";

import { getBuilderMode } from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function CheckboxField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const fetchApiOptions = async () => {
    if (!field.optionsApi) {
      setApiOptions(null);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(field.optionsApi);
      const data = await response.json();

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
    } catch (error) {
      setFetchError("Failed to fetch options");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApiOptions();
  }, [field.optionsApi, field.valueKey ?? "", field.labelKey ?? ""]);

  const getAvailableOptions = () => apiOptions ?? field.options ?? [];

  const getOptionValue = (
    option: string | { value: string; label?: string }
  ): string => (typeof option === "string" ? option : option.value);

  const getOptionLabel = (
    option: string | { value: string; label?: string }
  ): string =>
    typeof option === "string" ? option : option.label || option.value;

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = value || [];
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter((v: string) => v !== optionValue));
    }
  };

  if (isLoading && !apiOptions) {
    return <CheckboxFieldSkeleton />;
  }

  const renderCheckboxOptions = () => {
    const options = getAvailableOptions();

    return (
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col gap-2">
            {fetchError && (
              <div
                className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
                role="alert"
              >
                {fetchError}
              </div>
            )}
            {options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              const isChecked = (value || []).includes(optionValue);

              return (
                <div
                  className="flex items-center gap-2 rounded-md border border-border px-3 transition-colors hover:bg-accent/50"
                  key={index}
                >
                  <Checkbox
                    checked={isChecked}
                    className="mt-0"
                    disabled={disabled || isLoading}
                    id={`${field.id}-${index}`}
                    onCheckedChange={(checked: boolean) => {
                      handleCheckboxChange(optionValue, checked);
                    }}
                  />
                  <Label
                    className="flex h-12 flex-1 cursor-pointer items-center font-medium text-sm"
                    htmlFor={`${field.id}-${index}`}
                  >
                    {optionLabel}
                  </Label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={builderMode ? "pointer-events-none" : ""}>
        {renderCheckboxOptions()}
      </div>
      {error && (
        <div
          aria-live="polite"
          className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

function CheckboxFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-sm" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
