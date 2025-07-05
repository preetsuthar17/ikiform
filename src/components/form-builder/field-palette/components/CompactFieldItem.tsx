// Types
import type { CompactFieldItemProps } from "../types";

// React
import React from "react";

export function CompactFieldItem({
  fieldType,
  onAddField,
}: CompactFieldItemProps) {
  const Icon = fieldType.icon;

  return (
    <button
      onClick={() => onAddField(fieldType.type)}
      className="rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left flex gap-2 items-center p-3"
    >
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <span className="text-xs font-medium truncate">{fieldType.label}</span>
    </button>
  );
}
