// External imports
import React from "react";

// Type imports
import type { FormTypePreviewProps } from "../types";

export const FormTypePreview: React.FC<FormTypePreviewProps> = ({ type }) => {
  if (type === "single") {
    return (
      <div className="flex flex-col p-4 bg-muted/20 rounded-lg">
        <div className="h-3 bg-muted rounded w-3/4"></div>
        <div className="h-8 bg-muted/60 rounded"></div>
        <div className="h-8 bg-muted/60 rounded"></div>
        <div className="h-8 bg-muted/60 rounded"></div>
        <div className="h-10 bg-primary/20 rounded w-24"></div>
      </div>
    );
  }

  if (type === "multi") {
    return (
      <div className="flex flex-col p-4 bg-muted/20 rounded-lg">
        <div className="h-2 bg-primary rounded-full w-1/3"></div>
        <div className="text-xs text-muted-foreground">Step 1 of 3</div>
        <div className="h-3 bg-muted rounded w-2/3"></div>
        <div className="h-8 bg-muted/60 rounded"></div>
        <div className="h-8 bg-muted/60 rounded"></div>
        <div className="flex justify-between">
          <div className="h-8 bg-muted/40 rounded w-16"></div>
          <div className="h-8 bg-primary/20 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return null;
};
