import { BarChart3, Code2, Edit, Eye, Share, Trash2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { FormActionsProps } from '../types';

export function FormActions({
  form,
  onEdit,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormActionsProps) {
  const primaryActions = [
    {
      icon: Edit,
      label: 'Edit form',
      onClick: () => onEdit(form.id),
      variant: 'ghost' as const,
    },
    {
      icon: Eye,
      label: 'View form',
      onClick: () => onViewForm(form),
      variant: 'ghost' as const,
    },
    {
      icon: BarChart3,
      label: 'View analytics',
      onClick: () => onViewAnalytics(form.id),
      variant: 'ghost' as const,
    },
    {
      icon: Share,
      label: 'Share form',
      onClick: () => onShare(form),
      variant: 'ghost' as const,
    },
    {
      icon: Code2,
      label: 'Embed form',
      onClick: () => window.open(`/embed?formid=${form.id}`, '_blank'),
      variant: 'ghost' as const,
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Primary Actions Group */}
        <div className="flex flex-row flex-wrap items-center gap-1 w-full sm:w-auto max-[330px]:justify-center">
          {primaryActions.map(({ icon: Icon, label, onClick, variant }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button
                  onClick={onClick}
                  size="sm"
                  variant={variant}
                  className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="text-xs font-medium"
                sideOffset={8}
              >
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Separator */}
        <div className="hidden sm:block mx-3 h-4 w-px bg-border/50" />

        {/* Destructive Action */}
        <div className="flex w-full sm:w-auto justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onDelete(form.id, form.title)}
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete form</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-xs font-medium text-destructive border-destructive/20"
              sideOffset={8}
            >
              Delete form
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}