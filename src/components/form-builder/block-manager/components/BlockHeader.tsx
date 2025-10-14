import { ChevronDown, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { BlockHeaderProps } from "../types";

export function BlockHeader({
  block,
  index,
  isSelected,
  isEditing,
  onBlockSelect,
  onStartEditing,
  onBlockDelete,
  onToggleExpansion,
  isExpanded,
  canDelete,
}: BlockHeaderProps) {
  if (isEditing) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-1 items-center gap-3">
        <div
          className="flex flex-1 cursor-pointer flex-col gap-2"
          onClick={() => onBlockSelect(block.id)}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium">{block.title}</h4>
            <Badge className="text-xs" variant="secondary">
              Step {index + 1}
            </Badge>
          </div>
          {block.description && (
            <p className="text-muted-foreground text-sm">{block.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            className="h-8 w-8 p-0"
            onClick={() => onStartEditing(block)}
            size="icon"
            variant="ghost"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          {canDelete && (
            <Button
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => onBlockDelete(block.id)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            className="h-8 w-8 p-0"
            onClick={() => onToggleExpansion(block.id)}
            size="icon"
            variant="ghost"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
