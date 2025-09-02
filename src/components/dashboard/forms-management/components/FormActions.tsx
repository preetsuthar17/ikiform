import { BarChart3, Code2, Copy, Edit, Eye, MoreHorizontal, Share, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { FormActionsProps } from "../types";

export function FormActions({
  form,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormActionsProps) {
  return (
    <TooltipProvider>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Primary Actions Group */}
        <div className="flex w-full flex-row flex-wrap items-center gap-1 max-[330px]:justify-center sm:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80"
                onClick={() => onEdit(form.id)}
                size="sm"
                variant="ghost"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit form</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-medium text-xs" side="top" sideOffset={8}>
              Edit form
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80"
                onClick={() => onShare(form)}
                size="sm"
                variant="ghost"
              >
                <Share className="h-4 w-4" />
                <span className="sr-only">Share form</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-medium text-xs" side="top" sideOffset={8}>
              Share form
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80"
                    size="sm"
                    variant="ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="font-medium text-xs" side="top" sideOffset={8}>
                More actions
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex gap-1" icon={Copy} onClick={() => onDuplicate(form.id)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-1" icon={Eye} onClick={() => onViewForm(form)}>
                View form
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-1" icon={BarChart3} onClick={() => onViewAnalytics(form.id)}>
                View analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-1" icon={Code2} onClick={() => window.open(`/embed?formid=${form.id}`, "_blank")}>
                Embed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Separator */}
        <div className="mx-3 hidden h-4 w-px bg-border/50 sm:block" />

        {/* Destructive Action */}
        <div className="flex w-full justify-end sm:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 p-0 transition-all duration-200 hover:scale-105 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(form.id, form.title)}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete form</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="border-destructive/20 font-medium text-destructive text-xs"
              side="top"
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
