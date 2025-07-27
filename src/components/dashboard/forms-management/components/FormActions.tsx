// Form actions component with tooltips

// Icons
import { BarChart3, Edit, Eye, Share, Trash2 } from 'lucide-react';
import React from 'react';
// UI Components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
import type { FormActionsProps } from '../types';

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
              onClick={() => onEdit(form.id)}
              size="icon"
              variant="secondary"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Edit form</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onViewAnalytics(form.id)}
              size="icon"
              variant="secondary"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">View analytics</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onShare(form)}
              size="icon"
              variant="secondary"
            >
              <Share className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Share form</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 p-0"
              onClick={() => onDelete(form.id, form.title)}
              size="icon"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent size="sm">Delete form</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
