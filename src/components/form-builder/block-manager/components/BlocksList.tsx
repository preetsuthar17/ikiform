import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { FormBlock } from "@/lib/database";

import { canDeleteBlock, handleBlockReorder } from "../utils";
import { BlockItem } from "./BlockItem";

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
		<ScrollArea className="h-0 min-h-0 flex-1">
			<div className="flex flex-col gap-4 p-1">
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="blocks">
						{(provided) => (
							<div
								{...provided.droppableProps}
								className="flex flex-col gap-3"
								ref={provided.innerRef}
							>
								{blocks.map((block, index) => (
									<BlockItem
										block={block}
										canDelete={canDeleteBlock(blocks)}
										editDescription={editDescription}
										editTitle={editTitle}
										index={index}
										isEditing={editingBlock === block.id}
										isExpanded={expandedBlocks.has(block.id)}
										isSelected={selectedBlockId === block.id}
										key={block.id}
										onBlockDelete={onBlockDelete}
										onBlockSelect={onBlockSelect}
										onCancelEdit={onCancelEdit}
										onDescriptionChange={onDescriptionChange}
										onFieldDelete={onFieldDelete}
										onFieldSelect={onFieldSelect}
										onSaveEdit={onSaveEdit}
										onStartEditing={onStartEditing}
										onTitleChange={onTitleChange}
										onToggleExpansion={onToggleExpansion}
										selectedFieldId={selectedFieldId}
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
