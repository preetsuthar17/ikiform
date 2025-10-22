import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { MultiStepNavigationProps } from "../types";

export function MultiStepNavigation({
  schema,
  currentStepIndex,
  onStepSelect,
  onStepChange,
  onBlockAdd,
  onBlockDelete,
}: MultiStepNavigationProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<number | null>(null);

  if (!schema.blocks || schema.blocks.length <= 1) {
    return null;
  }

  const handlePrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      onStepChange(prevIndex);
      onStepSelect?.(prevIndex);
    }
  };

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < schema.blocks.length) {
      onStepChange(nextIndex);
      onStepSelect?.(nextIndex);
    }
  };

  const handleStepClick = (index: number) => {
    onStepChange(index);
    onStepSelect?.(index);
  };

  const handleAddStep = () => {
    onBlockAdd?.();
  };

  const handleDeleteStep = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (schema.blocks.length <= 1) return;

    setStepToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (stepToDelete !== null && onBlockDelete) {
      const blockToDelete = schema.blocks[stepToDelete];
      onBlockDelete(blockToDelete.id);

      if (stepToDelete === currentStepIndex && stepToDelete > 0) {
        onStepChange(stepToDelete - 1);
        onStepSelect?.(stepToDelete - 1);
      }
    }
    setDeleteDialogOpen(false);
    setStepToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setStepToDelete(null);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-2 flex-1 overflow-hidden rounded-2xl bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / schema.blocks.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Pagination>
          <PaginationContent className="flex w-full items-center justify-between">
            <PaginationItem>
              <PaginationPrevious
                className={
                  "rounded-md border border-border" +
                  (currentStepIndex === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer")
                }
                onClick={handlePrevStep}
              />
            </PaginationItem>

            <div className="flex items-center gap-2">
              {schema.blocks.map((block, index) => {
                const isActive = index === currentStepIndex;
                return (
                  <PaginationItem className="group relative" key={block.id}>
                    <PaginationLink
                      className={`relative ${isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""}`}
                      isActive={isActive}
                      onClick={() => handleStepClick(index)}
                    >
                      {index + 1}
                    </PaginationLink>

                    {schema.blocks.length > 1 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="Delete step"
                            className="-top-1.5 -right-1.5 absolute flex size-4 items-center justify-center rounded-full bg-destructive/80 text-white opacity-100 transition-opacity hover:bg-destructive/100 md:opacity-0 md:group-hover:opacity-100"
                            onClick={(e) => handleDeleteStep(index, e)}
                            size="icon"
                            tabIndex={0}
                          >
                            <span className="flex h-full w-full items-center justify-center">
                              <X className="size-2.5" />
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete step</TooltipContent>
                      </Tooltip>
                    )}
                  </PaginationItem>
                );
              })}

              {onBlockAdd && (
                <PaginationItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="size-9 rounded-md"
                        onClick={handleAddStep}
                        size="icon"
                        variant="outline"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add step</TooltipContent>
                  </Tooltip>
                </PaginationItem>
              )}
            </div>

            <PaginationItem>
              <PaginationNext
                className={
                  "rounded-md border border-border" +
                  (currentStepIndex === schema.blocks.length - 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer")
                }
                onClick={handleNextStep}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Step</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this step? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={cancelDelete} variant="outline">
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              Delete Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
