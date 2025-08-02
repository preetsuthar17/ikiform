import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { FIELD_TYPES, PALETTE_CONFIG } from '../constants';

import type { FieldPaletteProps } from '../types';
import { FieldItem, PALETTE_DRAG_TYPE } from './FieldItem';
import { PaletteHeader } from './PaletteHeader';

export function FullPalette({
  onAddField,
  formSchema,
  onSchemaUpdate,
}: Pick<FieldPaletteProps, 'onAddField' | 'formSchema' | 'onSchemaUpdate'>) {
  return (
    <div className="flex h-full flex-col border-border bg-card p-2 lg:border-r lg:p-4">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          <PaletteHeader
            description={PALETTE_CONFIG.HEADER.DESCRIPTION}
            title={PALETTE_CONFIG.HEADER.TITLE}
          />

          <DragDropContext onDragEnd={() => {}}>
            <Droppable
              direction="vertical"
              droppableId="palette-droppable"
              isDropDisabled={true}
            >
              {(provided) => (
                <div
                  className="flex flex-col gap-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {FIELD_TYPES.map((fieldType, idx) => (
                    <FieldItem
                      fieldType={fieldType}
                      index={idx}
                      key={fieldType.type}
                      onAddField={onAddField}
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
