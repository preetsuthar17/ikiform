"use client";

// Components
import { BlockManagerHeader, BlocksList } from "./components";

// Hooks
import { useBlockExpansion, useBlockEditing } from "./hooks";

// Types
import type { BlockManagerProps } from "./types";

export function BlockManager({
  blocks,
  selectedBlockId,
  selectedFieldId,
  onBlockSelect,
  onFieldSelect,
  onBlocksUpdate,
  onBlockAdd,
  onBlockDelete,
  onFieldDelete,
}: BlockManagerProps) {
  const { expandedBlocks, toggleBlockExpansion } = useBlockExpansion(blocks);
  const {
    editingState,
    startEditingBlock,
    saveBlockEdit,
    cancelBlockEdit,
    updateEditTitle,
    updateEditDescription,
  } = useBlockEditing(onBlocksUpdate, blocks);

  return (
    <div className="h-full flex flex-col">
      <BlockManagerHeader blocksCount={blocks.length} onBlockAdd={onBlockAdd} />
      <BlocksList
        blocks={blocks}
        expandedBlocks={expandedBlocks}
        selectedBlockId={selectedBlockId}
        selectedFieldId={selectedFieldId}
        editingBlock={editingState.editingBlock}
        editTitle={editingState.editTitle}
        editDescription={editingState.editDescription}
        onBlockSelect={onBlockSelect}
        onFieldSelect={onFieldSelect}
        onToggleExpansion={toggleBlockExpansion}
        onStartEditing={startEditingBlock}
        onBlockDelete={onBlockDelete}
        onFieldDelete={onFieldDelete}
        onBlocksUpdate={onBlocksUpdate}
        onTitleChange={updateEditTitle}
        onDescriptionChange={updateEditDescription}
        onSaveEdit={saveBlockEdit}
        onCancelEdit={cancelBlockEdit}
      />
    </div>
  );
}
