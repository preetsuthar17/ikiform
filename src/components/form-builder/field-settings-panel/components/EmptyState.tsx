import type React from "react";

import type { EmptyStateProps } from "../types";

export const EmptyState: React.FC<EmptyStateProps> = ({ onClose }) => (
  <div className="flex h-full flex-col items-center justify-center gap-2 border-border bg-background pt-12">
    <div className="flex flex-col items-center rounded-2xl bg-accent/50 p-6">
      <div className="h-12 w-12 rounded-xl bg-muted" />
    </div>
    <p className="font-medium text-foreground text-lg">No field selected</p>
    <p className="text-muted-foreground text-sm">
      Click on a field in the preview to edit its settings
    </p>
  </div>
);
