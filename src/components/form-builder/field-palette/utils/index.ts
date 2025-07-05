// Types
import type { FormField } from "@/lib/database";
import type { FieldTypeConfig } from "../types";

// Constants
import { FIELD_TYPES } from "../constants";

export const getFieldTypeConfig = (
  type: FormField["type"]
): FieldTypeConfig | undefined =>
  FIELD_TYPES.find((fieldType) => fieldType.type === type);

export const getAllFieldTypes = (): FormField["type"][] =>
  FIELD_TYPES.map((fieldType) => fieldType.type);

export const getFieldTypesByCategory = (
  category: "input" | "selection" | "special"
) => {
  const categories = {
    input: ["text", "email", "textarea", "number"],
    selection: ["select", "radio", "checkbox"],
    special: ["slider", "tags"],
  };

  return FIELD_TYPES.filter((field) =>
    categories[category]?.includes(field.type)
  );
};
