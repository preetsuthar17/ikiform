import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { BaseFieldProps } from "../types";

import { applyBuilderMode, getBaseClasses, getBuilderMode } from "../utils";

const ADDRESS_FIELD_CONFIGS = [
  { key: "line1", label: "Address Line 1", required: true },
  { key: "line2", label: "Address Line 2", required: false },
  { key: "city", label: "City", required: true },
  { key: "state", label: "State", required: true },
  { key: "zip", label: "Zip Code", required: true },
  { key: "country", label: "Country", required: true },
];

export function AddressField(props: BaseFieldProps) {
  const { field, value, onChange, error, disabled } = props;
  const builderMode = getBuilderMode(props);
  const baseClasses = getBaseClasses(field, error);
  const [address, setAddress] = useState(value || {});

  const getAddressFields = () => ADDRESS_FIELD_CONFIGS;

  const getAddressValue = (key: string) => address[key] || "";

  const getFieldId = (key: string) => `${field.id}-${key}`;

  const getFieldPlaceholder = (label: string) => label;

  const handleAddressFieldChange = (key: string, newValue: string) => {
    const trimmedValue = newValue.trim();
    const updated = { ...address, [key]: trimmedValue };
    setAddress(updated);
    onChange(updated);
  };

  const handleAddressInputChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleAddressFieldChange(key, e.target.value);
    };

  const handleAddressInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  const renderAddressField = (fieldConfig: any) => {
    const fieldId = getFieldId(fieldConfig.key);
    const fieldValue = getAddressValue(fieldConfig.key);
    const placeholder = getFieldPlaceholder(fieldConfig.label);

    const inputProps = applyBuilderMode(
      {
        className: `${baseClasses}`,
        disabled,
        id: fieldId,
        name: fieldId,
        autoComplete: getAutoCompleteValue(fieldConfig.key),
        onChange: handleAddressInputChange(fieldConfig.key),
        onKeyDown: handleAddressInputKeyDown,
        placeholder,
        required: fieldConfig.required,
        value: fieldValue,
        "aria-invalid": !!error || undefined,
      },
      builderMode
    );

    return (
      <div className="flex flex-col gap-1" key={fieldConfig.key}>
        <Label
          className="font-medium text-foreground text-sm"
          htmlFor={fieldId}
        >
          {fieldConfig.label}
          {fieldConfig.required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
        <Input {...inputProps} />
      </div>
    );
  };

  const getAutoCompleteValue = (key: string) => {
    const autoCompleteMap: Record<string, string> = {
      line1: "address-line1",
      line2: "address-line2",
      city: "address-level2",
      state: "address-level1",
      zip: "postal-code",
      country: "country",
    };
    return autoCompleteMap[key] || "off";
  };

  useEffect(() => {
    setAddress(value || {});
  }, [value]);

  const addressFields = getAddressFields();

  return (
    <div className={builderMode ? "pointer-events-none" : ""}>
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3">
            {addressFields.map(renderAddressField)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
