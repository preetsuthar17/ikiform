'use client';

// Components
import { BlockManagerHeader, BlocksList } from './components';

// Hooks
import { useBlockEditing, useBlockExpansion } from './hooks';

// Types
import type { BlockManagerProps } from './types';

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
    <div className="flex h-full flex-col gap-8 p-4">
      <BlockManagerHeader blocksCount={blocks.length} onBlockAdd={onBlockAdd} />
      <BlocksList
        blocks={blocks}
        editDescription={editingState.editDescription}
        editingBlock={editingState.editingBlock}
        editTitle={editingState.editTitle}
        expandedBlocks={expandedBlocks}
        onBlockDelete={onBlockDelete}
        onBlockSelect={onBlockSelect}
        onBlocksUpdate={onBlocksUpdate}
        onCancelEdit={cancelBlockEdit}
        onDescriptionChange={updateEditDescription}
        onFieldDelete={onFieldDelete}
        onFieldSelect={onFieldSelect}
        onSaveEdit={saveBlockEdit}
        onStartEditing={startEditingBlock}
        onTitleChange={updateEditTitle}
        onToggleExpansion={toggleBlockExpansion}
        selectedBlockId={selectedBlockId}
        selectedFieldId={selectedFieldId}
      />
    </div>
  );
}
