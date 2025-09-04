import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React from "react";
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
  return (
    <div className="flex h-full flex-col border-border p-2 lg:border-r lg:p-4">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 rounded-card pr-2">
          <PaletteHeader
            description={PALETTE_CONFIG.HEADER.DESCRIPTION}
            title={PALETTE_CONFIG.HEADER.TITLE}
          />
          {Object.entries(FIELD_CATEGORIES).map(([key, title]) => {
            const fields = FIELD_TYPE_CONFIGS.filter((f) => f.category === key);
            const colCount = 2;
            const columns = Array.from({ length: colCount }, (_, colIdx) =>
              fields.filter((_, idx) => idx % colCount === colIdx)
            );
            return (
              <div className="flex flex-col gap-2" key={key}>
                <div className="px-1 text-muted-foreground text-xs uppercase tracking-wide">
                  {title}
                </div>
                <DragDropContext onDragEnd={() => {}}>
                  <Droppable
                    direction="vertical"
                    droppableId={`palette-${key}`}
                    isDropDisabled={true}
                  >
                    {(provided) => (
                      <div
                        className="grid grid-cols-2 gap-2 rounded-card"
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
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
