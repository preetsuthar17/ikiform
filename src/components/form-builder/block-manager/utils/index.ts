// Types
import type { FormBlock } from "@/lib/database";
import type { DragEndResult } from "../types";

export const handleBlockReorder = (
  blocks: FormBlock[],
  result: DragEndResult,
  onBlocksUpdate: (blocks: FormBlock[]) => void
) => {
  if (!result.destination) return;

  const reorderedBlocks = Array.from(blocks);
  const [movedBlock] = reorderedBlocks.splice(result.source.index, 1);
  reorderedBlocks.splice(result.destination.index, 0, movedBlock);

  onBlocksUpdate(reorderedBlocks);
};

export const getBlockStats = (blocks: FormBlock[]) => {
  const totalFields = blocks.reduce(
    (acc, block) => acc + block.fields.length,
    0
  );
  const completedBlocks = blocks.filter(
    (block) => block.fields.length > 0
  ).length;

  return {
    totalBlocks: blocks.length,
    totalFields,
    completedBlocks,
    emptyBlocks: blocks.length - completedBlocks,
  };
};

export const canDeleteBlock = (blocks: FormBlock[]): boolean => {
  return blocks.length > 1;
};
