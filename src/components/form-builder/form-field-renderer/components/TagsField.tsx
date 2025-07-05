// External imports
import React from "react";

// Component imports
import { TagInput } from "@/components/ui/tag-input";

// Utility imports
import { getErrorClasses } from "../utils";

// Type imports
import type { BaseFieldProps } from "../types";

export function TagsField({ field, value, onChange, error }: BaseFieldProps) {
  const errorClasses = getErrorClasses(error);

  return (
    <TagInput
      tags={value || []}
      onTagsChange={onChange}
      tagVariant="default"
      tagSize="sm"
      placeholder={field.placeholder || "Type and press Enter..."}
      maxTags={field.settings?.maxTags}
      allowDuplicates={field.settings?.allowDuplicates}
      className={`flex gap-2 ${errorClasses}`}
    />
  );
}
