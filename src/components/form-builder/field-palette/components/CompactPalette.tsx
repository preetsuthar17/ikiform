// Components
import { CompactFieldItem } from "./CompactFieldItem";

// Constants
import { FIELD_TYPES, PALETTE_CONFIG } from "../constants";

// Types
import type { FieldPaletteProps } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CompactPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
  return (
    <ScrollArea className="max-h-[60vh] p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {FIELD_TYPES.map((fieldType) => (
          <CompactFieldItem
            key={fieldType.type}
            fieldType={fieldType}
            onAddField={onAddField}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
