import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FIELD_TYPES } from "../constants";

import type { FieldPaletteProps } from "../types";
import { CompactFieldItem } from "./CompactFieldItem";

export function CompactPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) {
      return FIELD_TYPES;
    }

    const term = searchTerm.toLowerCase();
    return FIELD_TYPES.filter(
      (field) =>
        field.label.toLowerCase().includes(term) ||
        field.description.toLowerCase().includes(term) ||
        field.type.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-3">
      {}
      <div className="relative px-2">
        <Search className="-translate-y-1/2 absolute top-1/2 left-4 size-4 text-muted-foreground" />
        <Input
          className="pl-10"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search fields..."
          value={searchTerm}
        />
      </div>

      <ScrollArea className="max-h-[60vh] p-2">
        {filteredFields.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filteredFields.map((fieldType) => (
              <CompactFieldItem
                fieldType={fieldType}
                key={fieldType.type}
                onAddField={onAddField}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Search className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No fields found matching "{searchTerm}"
            </p>
            <p className="text-muted-foreground text-xs">
              Try searching by field name, description, or type
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
