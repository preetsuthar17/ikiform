// Components
import { CompactFieldItem } from "./CompactFieldItem";

// Constants
import { FIELD_TYPES, PALETTE_CONFIG } from "../constants";

// Types
import type { FieldPaletteProps } from "../types";

export function CompactPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
  return (
    <div className={PALETTE_CONFIG.COMPACT_MAX_HEIGHT}>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto">
        {FIELD_TYPES.map((fieldType) => (
          <CompactFieldItem
            key={fieldType.type}
            fieldType={fieldType}
            onAddField={onAddField}
          />
        ))}
      </div>
    </div>
  );
}
