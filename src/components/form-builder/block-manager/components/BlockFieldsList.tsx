// Components
import { FieldItem } from "./FieldItem";

// Types
import type { BlockFieldsListProps } from "../types";

export function BlockFieldsList({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldDelete,
}: BlockFieldsListProps) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic flex py-3">
        No fields yet. Add fields from the palette on the right.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => (
        <FieldItem
          key={field.id}
          field={field}
          isSelected={selectedFieldId === field.id}
          onFieldSelect={onFieldSelect}
          onFieldDelete={onFieldDelete}
        />
      ))}
    </div>
  );
}
