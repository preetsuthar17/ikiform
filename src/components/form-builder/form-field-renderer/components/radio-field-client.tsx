"use client";

import { useEffect, useState } from "react";
import type { BaseFieldProps } from "../types";

/**
 * Optimized client component for RadioField
 * Minimizes state and effects, focuses only on interactive functionality
 */
export function RadioFieldClient({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const [options, setOptions] = useState<
    Array<string | { value: string; label?: string }>
  >(field.options ?? []);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!field.optionsApi) {
      setOptions(field.options ?? []);
      return;
    }

    setLoading(true);
    setFetchError(null);

    fetch(field.optionsApi)
      .then((res) => res.json())
      .then((data) => {
        let processedOptions: Array<
          string | { value: string; label?: string }
        > = [];

        if (Array.isArray(data)) {
          processedOptions = data.map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              const valueKey = field.valueKey ?? "value";
              const labelKey = field.labelKey ?? "label";
              return {
                value: item[valueKey] ?? item.value ?? String(item),
                label:
                  item[labelKey] ??
                  item.label ??
                  item[valueKey] ??
                  String(item),
              };
            }
            return String(item);
          });
        }

        setOptions(processedOptions);
      })
      .catch((err) => {
        console.error("Failed to fetch options:", err);
        setFetchError("Failed to load options");
        setOptions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [field.optionsApi, field.valueKey, field.labelKey, field.options]);

  const handleChange = (selectedValue: string) => {
    if (!disabled) {
      onChange(selectedValue);
    }
  };

  const getOptionValue = (
    option: string | { value: string; label?: string },
  ): string => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") return option.value || "";
    return "";
  };

  const getOptionLabel = (
    option: string | { value: string; label?: string },
  ): string => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object")
      return option.label || option.value || "";
    return "";
  };

  const errorClasses = error ? "border-red-500 ring-red-500" : "";

  if (loading) {
    return (
      <div className="space-y-2">
        {field.label && (
          <label className="font-medium text-foreground text-sm">
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex items-center space-x-3" key={index}>
              <div className="h-4 w-4 animate-pulse rounded-full bg-accent" />
              <div className="h-4 w-20 animate-pulse rounded bg-accent" />
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">Loading options...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="space-y-2">
        {field.label && (
          <label className="font-medium text-foreground text-sm">
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <p className="text-destructive text-sm">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {field.label && (
        <label className="font-medium text-foreground text-sm">
          {field.label}
          {field.required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      <div className={`space-y-3 ${errorClasses}`}>
        {options.filter(Boolean).map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);

          if (!optionValue) return null;

          const isSelected = value === optionValue;

          return (
            <label
              className={`flex cursor-pointer items-center space-x-3 ${
                disabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              key={index}
            >
              <input
                checked={isSelected}
                className="h-4 w-4 border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={disabled}
                name={field.id}
                onChange={() => handleChange(optionValue)}
                type="radio"
                value={optionValue}
              />
              <span className="select-none text-foreground text-sm">
                {optionLabel}
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {field.description && (
        <p className="text-muted-foreground text-sm">{field.description}</p>
      )}
    </div>
  );
}
