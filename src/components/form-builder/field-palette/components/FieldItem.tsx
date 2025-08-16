import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';

import type { FieldItemProps } from '../types';

export const PALETTE_DRAG_TYPE = 'palette-field-type';

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
            className="group cursor-pointer border-border bg-background p-1  rounded-card transition-all duration-200 hover:border-ring/20 hover:shadow-md/2"
            onClick={() => onAddField(fieldType.type)}
          >
            <div className="flex items-center gap-3 p-3">
              <div className="flex flex-shrink-0 items-center justify-center rounded-card bg-accent p-2 transition-colors duration-200 group-hover:bg-primary/10">
                <IconComponent className="h-4 w-4 text-accent-foreground transition-colors duration-200 group-hover:text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground text-sm transition-colors duration-200 group-hover:text-primary">
                  {fieldType.label}
                </h3>
                <p className="mt-0.5 text-muted-foreground text-xs">
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
