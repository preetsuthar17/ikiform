// Components
import { Card } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";

// Types
import type { FieldItemProps } from "../types";

export const PALETTE_DRAG_TYPE = "palette-field-type";

// NOTE: FieldItem should be rendered inside a DragDropContext and Droppable in the palette for DnD to work.
// Pass the correct index prop from the parent (FullPalette or CompactPalette).
export function FieldItem({
  fieldType,
  onAddField,
  index,
}: FieldItemProps & { index: number }) {
  const IconComponent = fieldType.icon;
  return (
    <Draggable draggableId={`palette-${fieldType.type}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            className="group bg-background border-border hover:border-ring/20 transition-all duration-200 cursor-pointer hover:shadow-md/2 p-1"
            onClick={() => onAddField(fieldType.type)}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex-shrink-0 bg-accent rounded-card group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center p-2">
                <IconComponent className="w-4 h-4 text-accent-foreground group-hover:text-primary transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 text-sm">
                  {fieldType.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fieldType.description}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
