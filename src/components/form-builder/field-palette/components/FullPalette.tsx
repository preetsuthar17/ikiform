import React from "react";

// Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaletteHeader } from "./PaletteHeader";
import { FieldItem } from "./FieldItem";

// Constants
import { FIELD_TYPES, PALETTE_CONFIG } from "../constants";

// Types
import type { FieldPaletteProps } from "../types";

export function FullPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          <PaletteHeader
            title={PALETTE_CONFIG.HEADER.TITLE}
            description={PALETTE_CONFIG.HEADER.DESCRIPTION}
          />
          <div className="flex flex-col gap-2">
            {FIELD_TYPES.map((fieldType) => (
              <FieldItem
                key={fieldType.type}
                fieldType={fieldType}
                onAddField={onAddField}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
