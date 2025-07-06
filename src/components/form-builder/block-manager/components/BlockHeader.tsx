// Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from "lucide-react";

// Types
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
      <div className="flex items-center gap-3 flex-1">
        <div
          className="flex-1 cursor-pointer flex flex-col gap-2"
          onClick={() => onBlockSelect(block.id)}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium">{block.title}</h4>
            <Badge variant="secondary" className="text-xs">
              Step {index + 1}
            </Badge>
          </div>
          {block.description && (
            <p className="text-sm text-muted-foreground">{block.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStartEditing(block)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          {canDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onBlockDelete(block.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onToggleExpansion(block.id)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
