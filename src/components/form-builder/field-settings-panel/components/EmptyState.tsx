// External imports
import React from "react";

// Type imports
import type { EmptyStateProps } from "../types";

export const EmptyState: React.FC<EmptyStateProps> = ({ onClose }) => {
  return (
    <div className="h-full bg-background border-border flex flex-col items-center justify-center">
      <div className="p-6 bg-accent/50 rounded-card flex flex-col items-center">
        <div className="w-12 h-12 bg-muted rounded-ele"></div>
      </div>
      <p className="text-lg font-medium text-foreground">No field selected</p>
      <p className="text-sm text-muted-foreground">
        Click on a field in the preview to edit its settings
      </p>
    </div>
  );
};
