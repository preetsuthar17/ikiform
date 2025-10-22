"use client";

import { CheckCircle } from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

import type { BaseFieldProps } from "../types";

import { getBuilderMode, getErrorRingClasses } from "../utils";
import { sanitizeOptions } from "../utils/sanitizeOptions";

export function RadioField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const errorRingClasses = getErrorRingClasses(error);
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const isFormBuilder =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/form-builder") ||
      window.location.pathname.includes("/demo-form-builder"));

  const isQuizField = field.settings?.isQuizField;
  const correctAnswer = field.settings?.correctAnswer;

  const labelId = `${field.id}-label`;
  const descId = `${field.id}-description`;
  const errorId = `${field.id}-error`;

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
  ): string => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") return option.value || "";
    return "";
  };

  const getOptionLabel = (
    option: string | { value: string; label?: string }
  ): string => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object")
      return option.label || option.value || "";
    return "";
  };

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  const renderRadioOptions = () => {
    const options = getAvailableOptions().filter(Boolean);

    return (
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="p-0">
          <RadioGroup
            aria-busy={isLoading ? true : undefined}
            aria-describedby={
              `${fetchError ? errorId : ""}${field.description ? (fetchError ? " " : "") + descId : ""}` ||
              undefined
            }
            aria-labelledby={field.label ? labelId : undefined}
            className={`flex flex-col gap-2 ${errorRingClasses}`}
            disabled={disabled || isLoading}
            onValueChange={handleValueChange}
            value={value || ""}
          >
            {fetchError && (
              <div
                aria-live="polite"
                className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
                id={errorId}
                role="alert"
              >
                {fetchError}
              </div>
            )}
            {options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);

              if (!optionValue) return null;

              const isCorrect = isQuizField && correctAnswer === optionValue;

              return (
                <div
                  className={`relative flex items-center gap-2 rounded-md border border-border px-3 transition-colors hover:bg-accent/50 ${
                    isFormBuilder && isCorrect
                      ? "bg-green-50 ring-1 ring-green-200"
                      : ""
                  }`}
                  key={index}
                >
                  <RadioGroupItem
                    className="mt-0"
                    disabled={disabled || isLoading}
                    id={`${field.id}-${index}`}
                    value={optionValue}
                  />
                  <Label
                    className="flex h-12 flex-1 cursor-pointer items-center font-medium text-sm"
                    htmlFor={`${field.id}-${index}`}
                  >
                    {optionLabel}
                  </Label>
                  {isFormBuilder && isCorrect && (
                    <div
                      className="-translate-y-1/2 absolute top-1/2 right-2"
                      title="Correct Answer"
                    >
                      <CheckCircle className="size-4 text-green-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    );
  };

  if (isLoading && !apiOptions) {
    return <RadioFieldSkeleton optionsCount={field.options?.length || 3} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={builderMode ? "pointer-events-none" : ""}>
        {renderRadioOptions()}
      </div>
      {error && (
        <div
          aria-live="polite"
          className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
          id={errorId}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

interface RadioFieldSkeletonProps {
  optionsCount?: number;
}

function RadioFieldSkeleton({ optionsCount = 3 }: RadioFieldSkeletonProps) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-24" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: optionsCount }).map((_, index) => (
          <div className="flex items-center gap-3" key={index}>
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
