import type React from "react";

import type { FormTypePreviewProps } from "../types";

export const FormTypePreview: React.FC<FormTypePreviewProps> = ({ type }) => {
  if (type === "single") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-muted/20 p-4">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-8 rounded bg-muted/60" />
        <div className="h-8 rounded bg-muted/60" />
        <div className="h-8 rounded bg-muted/60" />
        <div className="h-10 w-24 rounded bg-primary/20" />
      </div>
    );
  }

  if (type === "multi") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-muted/20 p-4">
        <div className="h-2 w-1/3 rounded-2xl bg-primary" />
        <div className="text-muted-foreground text-xs">Step 1 of 3</div>
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-8 rounded bg-muted/60" />
        <div className="h-8 rounded bg-muted/60" />
        <div className="flex justify-between">
          <div className="h-8 w-16 rounded bg-muted/40" />
          <div className="h-8 w-16 rounded bg-primary/20" />
        </div>
      </div>
    );
  }

  return null;
};
