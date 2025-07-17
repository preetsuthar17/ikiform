import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

// Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaletteHeader } from "./PaletteHeader";
import { FieldItem, PALETTE_DRAG_TYPE } from "./FieldItem";

// Constants
import { FIELD_TYPES, PALETTE_CONFIG } from "../constants";

// Types
import type { FieldPaletteProps } from "../types";

export function FullPalette({
  onAddField,
}: Pick<FieldPaletteProps, "onAddField">) {
  return (
    <div className="h-full bg-card lg:border-r border-border flex flex-col p-2 lg:p-4">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          <PaletteHeader
            title={PALETTE_CONFIG.HEADER.TITLE}
            description={PALETTE_CONFIG.HEADER.DESCRIPTION}
          />
          <DragDropContext onDragEnd={() => {}}>
            <Droppable
              droppableId="palette-droppable"
              isDropDisabled={true}
              direction="vertical"
            >
              {(provided) => (
                <div
                  className="flex flex-col gap-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {FIELD_TYPES.map((fieldType, idx) => (
                    <FieldItem
                      key={fieldType.type}
                      fieldType={fieldType}
                      onAddField={onAddField}
                      index={idx}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </ScrollArea>
    </div>
  );
}
