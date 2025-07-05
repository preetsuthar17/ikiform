// External imports
import React from "react";
import { X } from "lucide-react";

// Internal imports
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-lg font-semibold">Settings</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="flex items-center justify-center"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
