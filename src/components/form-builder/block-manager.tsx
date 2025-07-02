"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Settings,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { FormBlock, FormField } from "@/lib/database.types";

interface BlockManagerProps {
  blocks: FormBlock[];
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  onBlockSelect: (blockId: string | null) => void;
  onFieldSelect: (fieldId: string | null) => void;
  onBlocksUpdate: (blocks: FormBlock[]) => void;
  onBlockAdd: () => void;
  onBlockDelete: (blockId: string) => void;
  onFieldDelete: (fieldId: string) => void;
}

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
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    new Set(blocks.map((block) => block.id)),
  );
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const toggleBlockExpansion = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const startEditingBlock = (block: FormBlock) => {
    setEditingBlock(block.id);
    setEditTitle(block.title);
    setEditDescription(block.description || "");
  };

  const saveBlockEdit = () => {
    if (!editingBlock) return;

    const updatedBlocks = blocks.map((block) =>
      block.id === editingBlock
        ? {
            ...block,
            title: editTitle.trim(),
            description: editDescription.trim(),
          }
        : block,
    );

    onBlocksUpdate(updatedBlocks);
    setEditingBlock(null);
    setEditTitle("");
    setEditDescription("");
  };

  const cancelBlockEdit = () => {
    setEditingBlock(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleBlockDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedBlocks = Array.from(blocks);
    const [movedBlock] = reorderedBlocks.splice(result.source.index, 1);
    reorderedBlocks.splice(result.destination.index, 0, movedBlock);

    onBlocksUpdate(reorderedBlocks);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Form Structure</h3>
            <p className="text-sm text-muted-foreground">
              {blocks.length} {blocks.length === 1 ? "step" : "steps"}
            </p>
          </div>
          <Button size="sm" onClick={onBlockAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <DragDropContext onDragEnd={handleBlockDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {blocks.map((block, index) => {
                    const isExpanded = expandedBlocks.has(block.id);
                    const isSelected = selectedBlockId === block.id;
                    const isEditing = editingBlock === block.id;

                    return (
                      <Draggable
                        key={block.id}
                        draggableId={block.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all duration-200 p-2 ${
                              isSelected ? "ring-2 ring-primary" : ""
                            }`}
                          >
                            <div className="p-2 flex flex-col gap-2">
                              {/* Block Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-muted-foreground hover:text-foreground cursor-grab"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </div>

                                  {isEditing ? (
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        value={editTitle}
                                        onChange={(e) =>
                                          setEditTitle(e.target.value)
                                        }
                                        placeholder="Step title"
                                        className="font-medium"
                                      />
                                      <Textarea
                                        value={editDescription}
                                        onChange={(e) =>
                                          setEditDescription(e.target.value)
                                        }
                                        placeholder="Step description (optional)"
                                        rows={2}
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={saveBlockEdit}
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="secondary"
                                          onClick={cancelBlockEdit}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="flex-1 cursor-pointer"
                                      onClick={() => onBlockSelect(block.id)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium">
                                          {block.title}
                                        </h4>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Step {index + 1}
                                        </Badge>
                                      </div>
                                      {block.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {block.description}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {!isEditing && (
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => startEditingBlock(block)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </Button>
                                      {blocks.length > 1 && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            onBlockDelete(block.id)
                                          }
                                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          toggleBlockExpansion(block.id)
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        {isExpanded ? (
                                          <ChevronDown className="w-4 h-4" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Block Fields */}
                              {isExpanded && !isEditing && (
                                <div className="ml-7 space-y-2">
                                  {block.fields.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic py-2">
                                      No fields yet. Add fields from the palette
                                      on the right.
                                    </p>
                                  ) : (
                                    block.fields.map((field) => (
                                      <div
                                        key={field.id}
                                        className={`flex items-center justify-between p-2 rounded-ele cursor-pointer transition-colors ${
                                          selectedFieldId === field.id
                                            ? "bg-primary/10 border border-primary/20"
                                            : "bg-muted/30 hover:bg-muted/50"
                                        }`}
                                        onClick={() => onFieldSelect(field.id)}
                                      >
                                        <div className="flex items-start justify-center gap-2 flex-col">
                                          <div className="flex items-center justify-start gap-2">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {field.type}
                                            </Badge>
                                            {field.required && (
                                              <p className="text-destructive">
                                                *
                                              </p>
                                            )}
                                          </div>
                                          <span className="text-sm font-medium">
                                            {field.label}
                                          </span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onFieldDelete(field.id);
                                          }}
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
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
