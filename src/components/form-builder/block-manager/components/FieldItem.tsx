import React from "react";

// Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import { Trash2 } from "lucide-react";

// Types
import type { FieldItemProps } from "../types";

export function FieldItem({
  field,
  isSelected,
  onFieldSelect,
  onFieldDelete,
}: FieldItemProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-ele cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border border-primary/20"
          : "bg-muted/30 hover:bg-muted/50"
      }`}
      onClick={() => onFieldSelect(field.id)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {field.type}
          </Badge>
          {field.required && <span className="text-destructive">*</span>}
        </div>
        <span className="text-sm font-medium">{field.label}</span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onFieldDelete(field.id);
        }}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
}
