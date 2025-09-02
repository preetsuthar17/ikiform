import React from "react";
import type { CompactFieldItemProps } from "../types";

export function CompactFieldItem({
  fieldType,
  onAddField,
}: CompactFieldItemProps) {
  const Icon = fieldType.icon;

  return (
    <button
      className="flex items-center gap-2 rounded-card border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
      onClick={() => onAddField(fieldType.type)}
    >
      <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <span className="truncate font-medium text-xs">{fieldType.label}</span>
    </button>
  );
}
