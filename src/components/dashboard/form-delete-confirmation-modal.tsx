"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = useCallback(() => {
    if (!isLoading) {
      onConfirm();
      onOpenChange(false);
    }
  }, [onConfirm, onOpenChange, isLoading]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onOpenChange(false);
    }
  }, [onOpenChange, isLoading]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === "Escape") {
        handleCancel();
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleConfirm();
      }
    },
    [open, handleCancel, handleConfirm]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      const timer = setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [open, handleKeyDown]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        aria-describedby="confirmation-description"
        className="sm:max-w-md"
      >
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle
                  aria-hidden="true"
                  className="size-5 text-destructive"
                />
              </div>
            )}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription
            className="text-sm leading-relaxed"
            id="confirmation-description"
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            aria-label={cancelText}
            disabled={isLoading}
            onClick={handleCancel}
            ref={cancelButtonRef}
            variant="outline"
          >
            {cancelText}
          </Button>
          <Button
            aria-label={confirmText}
            disabled={isLoading}
            onClick={handleConfirm}
            ref={confirmButtonRef}
            variant={variant === "destructive" ? "destructive" : "default"}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
