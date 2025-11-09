"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBuilderMode, getErrorClasses } from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function SelectField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const errorClasses = getErrorClasses(error);
  const [apiOptions, setApiOptions] = React.useState<string[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const fetchOptions = async () => {
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
    fetchOptions();
  }, [field.optionsApi, field.valueKey ?? "", field.labelKey ?? ""]);

  const getOptions = () => apiOptions ?? field.options ?? [];

  const getPlaceholder = () => {
    if (isLoading) return "Loading...";
    return field.placeholder || "Select an option...";
  };

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  const renderSelectField = () => {
    const selectProps = applyBuilderMode(
      {
        disabled: disabled || isLoading,
        onValueChange: handleValueChange,
        value: value || "",
      },
      builderMode
    );

    const selectTriggerProps = applyBuilderMode(
      {
        className: errorClasses,
        disabled: disabled || isLoading,
      },
      builderMode
    );

    return (
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="p-0">
          <Select {...selectProps}>
            <SelectTrigger
              {...selectTriggerProps}
              aria-busy={isLoading}
              className="h-12"
            >
              <SelectValue placeholder={getPlaceholder()} />
            </SelectTrigger>
            <SelectContent>
              {fetchError && (
                <div
                  className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
                  role="alert"
                >
                  {fetchError}
                </div>
              )}
              {getOptions()
                .filter((option) => {
                  if (typeof option === "string") {
                    return option.trim() !== "";
                  }
                  if (option && typeof option === "object") {
                    return option.value && String(option.value).trim() !== "";
                  }
                  return false;
                })
                .map((option, index) => {
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
        </CardContent>
      </Card>
    );
  };

  if (isLoading && !apiOptions) {
    return <SelectFieldSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={builderMode ? "pointer-events-none" : ""}>
        {renderSelectField()}
      </div>
    </div>
  );
}

function SelectFieldSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-12 w-full rounded-md border" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
