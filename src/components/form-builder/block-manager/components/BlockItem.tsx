import { Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import type { BlockItemProps } from "../types";
import { BlockEditForm } from "./BlockEditForm";
import { BlockFieldsList } from "./BlockFieldsList";
import { BlockHeader } from "./BlockHeader";

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
			{(provided, snapshot) => (
				<Card
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={`group p-0 shadow-none transition-all duration-200 ${
						isSelected
							? "border-primary bg-accent/10 ring-2 ring-primary/20"
							: "border-border hover:bg-accent/5"
					} ${snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}
				>
					<CardContent className="p-0">
						<div className="flex items-center gap-3 p-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										{...provided.dragHandleProps}
										aria-label={`Drag to reorder ${block.title} step`}
										className="flex size-8 cursor-grab items-center justify-center rounded-md border border-muted-foreground/30 border-dashed bg-muted/30 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:bg-muted/50 hover:text-foreground active:cursor-grabbing"
									>
										<GripVertical className="size-4" />
									</div>
								</TooltipTrigger>
								<TooltipContent side="left">Drag to reorder</TooltipContent>
							</Tooltip>

							<div className="min-w-0 flex-1">
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
								)}
							</div>
						</div>

						{isExpanded && !isEditing && (
							<div className="border-border border-t bg-muted/20">
								<div className="p-4">
									<BlockFieldsList
										fields={block.fields}
										onFieldDelete={onFieldDelete}
										onFieldSelect={onFieldSelect}
										selectedFieldId={selectedFieldId}
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</Draggable>
	);
}
