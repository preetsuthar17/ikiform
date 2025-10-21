import { ChevronDown, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const handleBlockSelect = () => {
    onBlockSelect(block.id);
  };

  const handleBlockSelectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBlockSelect();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartEditing(block);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBlockDelete(block.id);
  };

  const handleToggleExpansion = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpansion(block.id);
  };

  const handleToggleExpansionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onToggleExpansion(block.id);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div
        className="flex flex-1 cursor-pointer items-center gap-3"
        onClick={handleBlockSelect}
        onKeyDown={handleBlockSelectKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{block.title}</h4>
            <Badge className="text-xs" variant="outline">
              Step {index + 1}
            </Badge>
          </div>
          {block.description && (
            <p className="text-muted-foreground text-sm">{block.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={`Edit ${block.title} step`}
              className="size-8"
              onClick={handleEditClick}
              size="icon-sm"
              variant="ghost"
            >
              <Edit3 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Edit step</TooltipContent>
        </Tooltip>

        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={`Delete ${block.title} step`}
                className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
                onClick={handleDeleteClick}
                size="icon-sm"
                variant="ghost"
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete step</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label={isExpanded ? "Collapse step" : "Expand step"}
              className="size-8"
              onClick={handleToggleExpansion}
              onKeyDown={handleToggleExpansionKeyDown}
              size="icon-sm"
              variant="ghost"
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isExpanded ? "Collapse step" : "Expand step"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
