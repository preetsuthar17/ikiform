import { FIELD_TYPES } from "@/lib/fields/field-config";
import type { FieldTypeConfig } from "../types";

// Re-export the global field types for backward compatibility
export { FIELD_TYPES };

export const PALETTE_CONFIG = {
  COMPACT_GRID_COLS: 2,
  COMPACT_MAX_HEIGHT: "max-h-64",

  HEADER: {
    TITLE: "Form Fields",
    DESCRIPTION: "Click to add fields to your form",
  },
} as const;
