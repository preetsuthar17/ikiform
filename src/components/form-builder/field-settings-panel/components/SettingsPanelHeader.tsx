// External imports
import React from "react";

// Component imports
import { Button } from "@/components/ui/button";

// Icon imports
import { X } from "lucide-react";

interface SettingsPanelHeaderProps {
  onClose: () => void;
}

export function SettingsPanelHeader({ onClose }: SettingsPanelHeaderProps) {
  return (
    <div className="p-4 lg:flex hidden">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-foreground">
          Field Settings
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex gap-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
