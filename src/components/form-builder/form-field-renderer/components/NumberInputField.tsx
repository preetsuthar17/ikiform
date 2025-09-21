import type React from "react";

import { Input } from "@/components/ui/input";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function NumberInputField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const baseClasses = getBaseClasses(field, error);
  const builderMode = getBuilderMode(props);

  const inputProps = applyBuilderMode(
    {
      className: `flex gap-2 ${baseClasses}`,
      disabled,
      id: field.id,
      max: field.validation?.max,
      min: field.validation?.min,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value),
      placeholder: field.placeholder,
      type: "number",
      value: value || "",
    },
    builderMode
  );

  return <Input {...inputProps} />;
}
