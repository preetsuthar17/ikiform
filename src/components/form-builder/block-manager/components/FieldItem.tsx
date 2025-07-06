import React from "react";

// Components
import { Badge } from "@/components/ui/badge";

// Types
import type { FieldItemProps } from "../types";

export function FieldItem({
  field,
  isSelected,
  onFieldSelect,
}: FieldItemProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-ele cursor-pointer transition-colors ${
        isSelected ? "bg-primary/10 border border-primary/20" : "bg-accent"
      }`}
      onClick={() => onFieldSelect(field.id)}
    >
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {field.type}
          </Badge>
          {field.required && <span className="text-destructive">*</span>}
        </div>
        <span className="text-sm font-medium">{field.label}</span>
      </div>
    </div>
  );
}
