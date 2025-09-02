import React from "react";
import type { PaletteHeaderProps } from "../types";

export function PaletteHeader({ title, description }: PaletteHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-semibold text-foreground text-lg">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
