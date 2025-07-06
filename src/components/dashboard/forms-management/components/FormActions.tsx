// Form actions component with tooltips
import React from "react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { Edit, Eye, BarChart3, Share, Trash2 } from "lucide-react";

// Types
import type { FormActionsProps } from "../types";

export function FormActions({
  form,
  onEdit,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(form.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Edit form</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onViewAnalytics(form.id)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">View analytics</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onShare(form)}
            >
              <Share className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Share form</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1"></div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(form.id, form.title)}
              className="h-9 w-9 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Delete form</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
