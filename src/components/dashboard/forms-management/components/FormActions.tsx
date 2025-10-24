import {
  BarChart3,
  Code2,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Share,
  Trash2,
} from "lucide-react";
import { memo, useCallback } from "react";
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

export const FormActions = memo(function FormActions({
  form,
  onEdit,
  onDuplicate,
  onViewForm,
  onViewAnalytics,
  onShare,
  onDelete,
}: FormActionsProps) {
  const handleEdit = useCallback(() => {
    onEdit(form.id);
  }, [onEdit, form.id]);

  const handleShare = useCallback(() => {
    onShare(form);
  }, [onShare, form]);

  const handleDuplicate = useCallback(() => {
    onDuplicate(form.id);
  }, [onDuplicate, form.id]);

  const handleViewForm = useCallback(() => {
    onViewForm(form);
  }, [onViewForm, form]);

  const handleViewAnalytics = useCallback(() => {
    onViewAnalytics(form.id);
  }, [onViewAnalytics, form.id]);

  const handleEmbed = useCallback(() => {
    window.open(`/embed?formid=${form.id}`, "_blank");
  }, [form.id]);

  const handleDelete = useCallback(() => {
    onDelete(form.id, form.title);
  }, [onDelete, form.id, form.title]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-row flex-wrap items-center gap-2 max-[330px]:justify-center sm:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Edit form"
                className="size-10 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleEdit}
                size="sm"
                variant="ghost"
              >
                <Edit aria-hidden="true" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              <p>Edit form</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Share form"
                className="size-10 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleShare}
                size="sm"
                variant="ghost"
              >
                <Share aria-hidden="true" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              <p>Share form</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="More actions"
                    className="size-10 p-0 transition-all duration-200 hover:scale-105 hover:bg-muted/80 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    size="sm"
                    variant="ghost"
                  >
                    <MoreHorizontal aria-hidden="true" className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                <p>More actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleDuplicate}
              >
                <Copy aria-hidden="true" className="size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleViewForm}
              >
                <Eye aria-hidden="true" className="size-4" />
                View form
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleViewAnalytics}
              >
                <BarChart3 aria-hidden="true" className="size-4" />
                View analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleEmbed}
              >
                <Code2 aria-hidden="true" className="size-4" />
                Embed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          aria-hidden="true"
          className="mx-3 hidden h-4 w-px bg-border/50 sm:block"
        />

        <div className="flex w-full justify-end sm:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Delete form"
                className="size-10 p-0 transition-all duration-200 hover:scale-105 hover:bg-destructive/10 hover:text-destructive focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                onClick={handleDelete}
                size="sm"
                variant="ghost"
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              <p>Delete form</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
});
