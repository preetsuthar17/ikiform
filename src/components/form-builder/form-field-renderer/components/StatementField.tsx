import React from "react";
import type { BaseFieldProps } from "../types";
import { cn } from "@/lib/utils";

export function StatementField({ field }: BaseFieldProps) {
  // Use settings for custom heading/description, fallback to label/description
  const heading = field.settings?.statementHeading || field.label;
  const description = field.settings?.statementDescription || field.description;
  const align = field.settings?.statementAlign || "left";
  const size = field.settings?.statementSize || "md";

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" && "items-center",
        align === "right" && "items-end",
      )}
    >
      {heading && (
        <div
          className={cn(
            "font-semibold text-foreground",
            size === "lg"
              ? "text-2xl"
              : size === "sm"
                ? "text-base"
                : "text-xl",
          )}
        >
          {heading}
        </div>
      )}
      {description && (
        <div className="text-muted-foreground text-sm mt-1 max-w-prose">
          {description}
        </div>
      )}
    </div>
  );
}
