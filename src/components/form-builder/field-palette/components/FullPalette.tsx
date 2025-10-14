import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FIELD_CATEGORIES,
  FIELD_TYPE_CONFIGS,
} from "@/lib/fields/field-config";

import { PALETTE_CONFIG } from "../constants";

import type { FieldPaletteProps } from "../types";
import { FieldItem } from "./FieldItem";
import { PaletteHeader } from "./PaletteHeader";

export function FullPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField" | "formSchema" | "onSchemaUpdate">) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter fields based on search term
  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) {
      return FIELD_TYPE_CONFIGS;
    }

    const term = searchTerm.toLowerCase();
    return FIELD_TYPE_CONFIGS.filter(
      (field) =>
        field.label.toLowerCase().includes(term) ||
        field.description.toLowerCase().includes(term) ||
        field.type.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // Group filtered fields by category
  const groupedFields = useMemo(() => {
    const groups: Record<string, typeof FIELD_TYPE_CONFIGS> = {};

    filteredFields.forEach((field) => {
      if (!groups[field.category]) {
        groups[field.category] = [];
      }
      groups[field.category].push(field);
    });

    return groups;
  }, [filteredFields]);

  return (
    <div className="flex h-full flex-col gap-6 border-border p-2 lg:border-r lg:p-4">
      <div className="flex flex-col gap-4">
        <PaletteHeader
          description={PALETTE_CONFIG.HEADER.DESCRIPTION}
          title={PALETTE_CONFIG.HEADER.TITLE}
        />
      </div>
      <div className="relative">
        <Input
          leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search fields..."
          value={searchTerm}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 rounded-2xl pr-2">
          {Object.entries(groupedFields).length > 0 ? (
            Object.entries(groupedFields).map(([key, fields]) => {
              const colCount = 2;
              const columns = Array.from({ length: colCount }, (_, colIdx) =>
                fields.filter((_, idx) => idx % colCount === colIdx)
              );

              return (
                <div className="flex flex-col gap-2" key={key}>
                  <div className="px-1 text-muted-foreground text-xs uppercase tracking-wide">
                    {FIELD_CATEGORIES[key as keyof typeof FIELD_CATEGORIES]}
                  </div>
                  <DragDropContext onDragEnd={() => {}}>
                    <Droppable
                      direction="vertical"
                      droppableId={`palette-${key}`}
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <div
                          className="grid grid-cols-2 gap-2 rounded-2xl"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {columns.map((col, colIdx) => (
                            <div className="flex flex-col gap-2" key={colIdx}>
                              {col.map((f) => (
                                <FieldItem
                                  fieldType={{
                                    type: f.type,
                                    label: f.label,
                                    description: f.description,
                                    icon: f.icon,
                                  }}
                                  index={fields.findIndex(
                                    (x) => x.type === f.type
                                  )}
                                  key={f.type}
                                  onAddField={onAddField}
                                />
                              ))}
                            </div>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                No fields found matching "{searchTerm}"
              </p>
              <p className="text-muted-foreground text-xs">
                Try searching by field name, description, or type
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
