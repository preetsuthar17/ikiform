import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { validateUrl } from "@/lib/validation/url-validation";
import type { BaseFieldProps } from "../types";
import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function LinkInputField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const baseClasses = getBaseClasses(field, error);
  const [inputValue, setInputValue] = useState(value || "");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setIsValidating(true);
  };

  const validation = validateUrl(inputValue);
  const errorMessage =
    error || (isValidating && !validation.isValid ? validation.message : "");

  const inputProps = applyBuilderMode({
    className: `flex gap-2 ${baseClasses}`,
    disabled,
    id: field.id,
    onBlur: handleBlur,
    onChange: handleInputChange,
    placeholder: field.placeholder || "https://",
    type: "url",
    value: inputValue,
  }, builderMode);

  return (
    <div className={`flex flex-col gap-2 ${builderMode ? 'pointer-events-none' : ''}`}>
      <Input {...inputProps} />
      {errorMessage && (
        <span className="text-destructive text-xs">{errorMessage}</span>
      )}
    </div>
  );
}
