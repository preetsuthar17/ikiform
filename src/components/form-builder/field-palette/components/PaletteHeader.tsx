// Types
import type { PaletteHeaderProps } from "../types";

// React
import React from "react";

export function PaletteHeader({ title, description }: PaletteHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
