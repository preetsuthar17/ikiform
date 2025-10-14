import { DatePicker } from "@/components/ui/date-picker";
import type { BaseFieldProps } from "../types";
import { getBaseClasses } from "../utils";

export function DateInputField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);

  const dateValue = value ? new Date(value) : undefined;
  return (
    <DatePicker
      className={baseClasses}
      disabled={disabled}
      onChange={(date) => {
        onChange(date ? date.toISOString().slice(0, 10) : "");
      }}
      placeholder={field.placeholder || "Pick a date"}
      value={dateValue}
    />
  );
}
