import { Draggable } from '@hello-pangea/dnd';

import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';

import type { BlockItemProps } from '../types';
import { BlockEditForm } from './BlockEditForm';
import { BlockFieldsList } from './BlockFieldsList';
import { BlockHeader } from './BlockHeader';

interface DraggableBlockItemProps extends BlockItemProps {
  editTitle: string;
  editDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function BlockItem({
  block,
  index,
  isExpanded,
  isSelected,
  isEditing,
  selectedFieldId,
  onBlockSelect,
  onFieldSelect,
  onToggleExpansion,
  onStartEditing,
  onBlockDelete,
  onFieldDelete,
  canDelete,
  editTitle,
  editDescription,
  onTitleChange,
  onDescriptionChange,
  onSaveEdit,
  onCancelEdit,
}: DraggableBlockItemProps) {
  return (
    <Draggable draggableId={block.id} index={index} key={block.id}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex flex-col gap-3 transition-all duration-200 ${
            isSelected ? 'border border-primary/40' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              {...provided.dragHandleProps}
              className="cursor-grab text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </div>

            {isEditing ? (
              <BlockEditForm
                description={editDescription}
                onCancel={onCancelEdit}
                onDescriptionChange={onDescriptionChange}
                onSave={onSaveEdit}
                onTitleChange={onTitleChange}
                title={editTitle}
              />
            ) : (
              <div className="flex-1">
                <BlockHeader
                  block={block}
                  canDelete={canDelete}
                  index={index}
                  isEditing={isEditing}
                  isExpanded={isExpanded}
                  isSelected={isSelected}
                  onBlockDelete={onBlockDelete}
                  onBlockSelect={onBlockSelect}
                  onStartEditing={onStartEditing}
                  onToggleExpansion={onToggleExpansion}
                />
              </div>
            )}
          </div>

          {isExpanded && !isEditing && (
            <div className="flex flex-col gap-3">
              <BlockFieldsList
                fields={block.fields}
                onFieldDelete={onFieldDelete}
                onFieldSelect={onFieldSelect}
                selectedFieldId={selectedFieldId}
              />
            </div>
          )}
        </Card>
      )}
    </Draggable>
  );
}
