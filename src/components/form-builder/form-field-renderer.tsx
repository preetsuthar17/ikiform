import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TagInput } from "@/components/ui/tag-input";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import type { FormField } from "@/lib/database.types";

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
}: FormFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        );

      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={error ? "border-red-500" : ""}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.settings?.rows || 4}
            className={error ? "border-red-500" : ""}
          />
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className={error ? "border-red-500" : ""}
          >
            {field.options?.map((option, index) => (
              <RadioItem
                key={index}
                value={option}
                id={`${field.id}-${index}`}
                label={option}
              />
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <Checkbox
                key={index}
                id={`${field.id}-${index}`}
                label={option}
                checked={(value || []).includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = value || [];
                  if (checked) {
                    onChange([...currentValues, option]);
                  } else {
                    onChange(currentValues.filter((v: string) => v !== option));
                  }
                }}
              />
            ))}
          </div>
        );

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue
                placeholder={field.placeholder || "Select an option..."}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "slider":
        return (
          <Slider
            value={[value || field.settings?.defaultValue || 0]}
            onValueChange={(values) => onChange(values[0])}
            min={field.settings?.min || 0}
            max={field.settings?.max || 100}
            step={field.settings?.step || 1}
            className={error ? "border-red-500" : ""}
            showValue
          />
        );

      case "tags":
        return (
          <TagInput
            tags={value || []}
            onTagsChange={onChange}
            placeholder={field.placeholder || "Type and press Enter..."}
            maxTags={field.settings?.maxTags}
            allowDuplicates={field.settings?.allowDuplicates}
            className={error ? "border-red-500" : ""}
          />
        );

      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
