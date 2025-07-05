"use client";

// External imports
import React from "react";
import { AlertTriangle } from "lucide-react";

// Internal component imports
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalHeader,
} from "@/components/ui/modal";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
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
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md flex flex-col gap-3">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            )}
            <span>{title}</span>
          </ModalTitle>
        </ModalHeader>
        <div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
