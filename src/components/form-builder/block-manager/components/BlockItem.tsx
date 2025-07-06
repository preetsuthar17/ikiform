// Components
import { Card } from "@/components/ui/card";
import { BlockHeader } from "./BlockHeader";
import { BlockEditForm } from "./BlockEditForm";
import { BlockFieldsList } from "./BlockFieldsList";

// Libraries
import { Draggable } from "@hello-pangea/dnd";

// Icons
import { GripVertical } from "lucide-react";

// Types
import type { BlockItemProps } from "../types";

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
    <Draggable key={block.id} draggableId={block.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-all duration-200 flex flex-col gap-3 ${
            isSelected ? "border border-primary/40" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              {...provided.dragHandleProps}
              className="text-muted-foreground hover:text-foreground cursor-grab"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {isEditing ? (
              <BlockEditForm
                title={editTitle}
                description={editDescription}
                onTitleChange={onTitleChange}
                onDescriptionChange={onDescriptionChange}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
              />
            ) : (
              <div className="flex-1">
                <BlockHeader
                  block={block}
                  index={index}
                  isSelected={isSelected}
                  isEditing={isEditing}
                  onBlockSelect={onBlockSelect}
                  onStartEditing={onStartEditing}
                  onBlockDelete={onBlockDelete}
                  onToggleExpansion={onToggleExpansion}
                  isExpanded={isExpanded}
                  canDelete={canDelete}
                />
              </div>
            )}
          </div>

          {isExpanded && !isEditing && (
            <div className="flex flex-col gap-3">
              <BlockFieldsList
                fields={block.fields}
                selectedFieldId={selectedFieldId}
                onFieldSelect={onFieldSelect}
                onFieldDelete={onFieldDelete}
              />
            </div>
          )}
        </Card>
      )}
    </Draggable>
  );
}
