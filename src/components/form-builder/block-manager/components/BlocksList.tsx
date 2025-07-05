// Components
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockItem } from "./BlockItem";

// Libraries
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

// Utilities
import { handleBlockReorder, canDeleteBlock } from "../utils";

// Types
import type { FormBlock } from "@/lib/database";

interface BlocksListProps {
  blocks: FormBlock[];
  expandedBlocks: Set<string>;
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  editingBlock: string | null;
  editTitle: string;
  editDescription: string;
  onBlockSelect: (blockId: string | null) => void;
  onFieldSelect: (fieldId: string | null) => void;
  onToggleExpansion: (blockId: string) => void;
  onStartEditing: (block: FormBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onFieldDelete: (fieldId: string) => void;
  onBlocksUpdate: (blocks: FormBlock[]) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function BlocksList({
  blocks,
  expandedBlocks,
  selectedBlockId,
  selectedFieldId,
  editingBlock,
  editTitle,
  editDescription,
  onBlockSelect,
  onFieldSelect,
  onToggleExpansion,
  onStartEditing,
  onBlockDelete,
  onFieldDelete,
  onBlocksUpdate,
  onTitleChange,
  onDescriptionChange,
  onSaveEdit,
  onCancelEdit,
}: BlocksListProps) {
  const handleDragEnd = (result: any) => {
    handleBlockReorder(blocks, result, onBlocksUpdate);
  };

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-3"
              >
                {blocks.map((block, index) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    index={index}
                    isExpanded={expandedBlocks.has(block.id)}
                    isSelected={selectedBlockId === block.id}
                    isEditing={editingBlock === block.id}
                    selectedFieldId={selectedFieldId}
                    onBlockSelect={onBlockSelect}
                    onFieldSelect={onFieldSelect}
                    onToggleExpansion={onToggleExpansion}
                    onStartEditing={onStartEditing}
                    onBlockDelete={onBlockDelete}
                    onFieldDelete={onFieldDelete}
                    canDelete={canDeleteBlock(blocks)}
                    editTitle={editTitle}
                    editDescription={editDescription}
                    onTitleChange={onTitleChange}
                    onDescriptionChange={onDescriptionChange}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </ScrollArea>
  );
}
