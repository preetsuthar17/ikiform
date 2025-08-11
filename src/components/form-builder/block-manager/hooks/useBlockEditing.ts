import { useState } from "react";

import type { FormBlock } from "@/lib/database";
import type { BlockEditingState } from "../types";

export function useBlockEditing(
  onBlocksUpdate: (blocks: FormBlock[]) => void,
  blocks: FormBlock[],
) {
  const [editingState, setEditingState] = useState<BlockEditingState>({
    editingBlock: null,
    editTitle: "",
    editDescription: "",
  });

  const startEditingBlock = (block: FormBlock) => {
    setEditingState({
      editingBlock: block.id,
      editTitle: block.title,
      editDescription: block.description || "",
    });
  };

  const saveBlockEdit = () => {
    if (!editingState.editingBlock) return;

    const updatedBlocks = blocks.map((block) =>
      block.id === editingState.editingBlock
        ? {
            ...block,
            title: editingState.editTitle.trim(),
            description: editingState.editDescription.trim(),
          }
        : block,
    );

    onBlocksUpdate(updatedBlocks);
    setEditingState({
      editingBlock: null,
      editTitle: "",
      editDescription: "",
    });
  };

  const cancelBlockEdit = () => {
    setEditingState({
      editingBlock: null,
      editTitle: "",
      editDescription: "",
    });
  };

  const updateEditTitle = (title: string) => {
    setEditingState((prev) => ({ ...prev, editTitle: title }));
  };

  const updateEditDescription = (description: string) => {
    setEditingState((prev) => ({ ...prev, editDescription: description }));
  };

  return {
    editingState,
    startEditingBlock,
    saveBlockEdit,
    cancelBlockEdit,
    updateEditTitle,
    updateEditDescription,
  };
}
