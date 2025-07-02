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
  // Get field width class
  const getWidthClass = () => {
    switch (field.settings?.width) {
      case "half":
        return "w-1/2";
      case "third":
        return "w-1/3";
      case "quarter":
        return "w-1/4";
      default:
        return "w-full";
    }
  };

  // Get field size classes
  const getSizeClasses = () => {
    switch (field.settings?.size) {
      case "sm":
        return "text-sm px-2 py-1 h-8";
      case "lg":
        return "text-lg px-4 py-3 h-14";
      default:
        return "h-10";
    }
  };

  // Get field variant classes
  const getVariantClasses = () => {
    switch (field.settings?.variant) {
      case "filled":
        return "bg-muted/50 border-muted";
      case "ghost":
        return "bg-transparent border-transparent shadow-none";
      default:
        return "";
    }
  };

  const renderField = () => {
    const baseClasses = `${getSizeClasses()} ${getVariantClasses()} ${
      error ? "border-destructive focus:border-destructive" : ""
    }`;

    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          />
        );

      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
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
            className={baseClasses}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.settings?.rows || 4}
            className={baseClasses}
          />
        );

      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className={error ? "ring-2 ring-destructive/20" : ""}
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
            <SelectTrigger
              className={
                error ? "border-destructive focus:border-destructive" : ""
              }
            >
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
            className={error ? "ring-2 ring-destructive/20" : ""}
            showValue
          />
        );

      case "tags":
        return (
          <TagInput
            tags={value || []}
            onTagsChange={onChange}
            tagVariant={"default"}
            tagSize="sm"
            placeholder={field.placeholder || "Type and press Enter..."}
            maxTags={field.settings?.maxTags}
            allowDuplicates={field.settings?.allowDuplicates}
            className={
              error ? "border-destructive focus:border-destructive" : ""
            }
          />
        );

      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className={`flex flex-col ${getWidthClass()}`}>
      <Label
        htmlFor={field.id}
        className="text-sm font-medium text-foreground mb-2"
      >
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {field.description && (
        <p className="text-sm text-muted-foreground mb-2">
          {field.description}
        </p>
      )}
      {renderField()}

      {field.settings?.helpText && (
        <p className="text-xs text-muted-foreground mt-2">
          {field.settings.helpText}
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-start gap-1 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
