import type React from "react";

import { Textarea } from "@/components/ui/textarea";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

export function TextareaField(props: BaseFieldProps) {
  const { field, value, onChange, error, fieldRef, disabled } = props;
  const baseClasses = getBaseClasses(field, error);
  const builderMode = getBuilderMode(props);

  const textareaProps = applyBuilderMode(
    {
      className: `flex gap-2 ${baseClasses}`,
      disabled,
      id: field.id,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value),
      placeholder: field.placeholder,
      ref: fieldRef,
      rows: field.settings?.rows || 4,
      value: value || "",
    },
    builderMode
  );

  return <Textarea {...textareaProps} />;
}
