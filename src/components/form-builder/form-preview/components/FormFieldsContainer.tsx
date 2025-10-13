import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { EyeOff, GripVertical, Lock, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PALETTE_DRAG_TYPE } from "../../field-palette/components/FieldItem";
import { FIELD_TYPES } from "../../field-palette/constants";

import { FormFieldRenderer } from "../../form-field-renderer";

import type { FormFieldsContainerProps } from "../types";

export function FormFieldsContainer({
  fields,
  selectedFieldId,
  formData,
  onFieldSelect,
  onFieldsReorder,
  onFieldDelete,
  onFieldValueChange,
  isMultiStep,
  onAddField,
  fieldVisibility,
  showLogicCues = false,
}: FormFieldsContainerProps & { showLogicCues?: boolean }) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (
      result.type === PALETTE_DRAG_TYPE ||
      result.source.droppableId === "palette-droppable" ||
      (typeof result.source.droppableId === "string" &&
        result.source.droppableId.startsWith("palette-"))
    ) {
      const type = result.draggableId.replace("palette-", "");
      if (onAddField) onAddField(type);
      return;
    }

    const items = [...fields];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onFieldsReorder(items);
  };

  const AddFieldButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-42 w-full border-2 border-dashed transition-colors hover:border-primary/50 hover:bg-accent/10"
          style={{
            borderRadius: "1.2rem",
          }}
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="h-42 w-48">
        <ScrollArea type="always">
          {FIELD_TYPES.map((fieldType: { type: string; label: string }) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={fieldType.type}
              onClick={() =>
                onAddField?.(
                  fieldType.type as (typeof FIELD_TYPES)[number]["type"]
                )
              }
            >
              {fieldType.label}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderFields = showLogicCues
    ? fields
    : fieldVisibility
      ? fields.filter((field) => fieldVisibility[field.id]?.visible !== false)
      : fields;

  if (renderFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          <div className="h-8 w-8 rounded-2xl bg-muted" />
        </div>
        <p className="font-medium text-foreground text-lg">
          {isMultiStep ? "No fields in this step" : "No fields added yet"}
        </p>
        <p className="text-muted-foreground text-sm">
          {isMultiStep
            ? "Add fields from the palette to this step"
            : "Add fields from the left panel to start building your form"}
        </p>
        {onAddField && <AddFieldButton />}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="form-fields">
        {(provided) => (
          <div
            {...provided.droppableProps}
            className="flex flex-col gap-4"
            ref={provided.innerRef}
          >
            {renderFields.map((field, index) => {
              const isHidden = fieldVisibility?.[field.id]?.visible === false;
              const isDisabled = fieldVisibility?.[field.id]?.disabled;
              return (
                <Draggable draggableId={field.id} index={index} key={field.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group relative"
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" ||
                            e.key === "Backspace" ||
                            e.key === "Delete") &&
                          (e.target instanceof HTMLInputElement ||
                            e.target instanceof HTMLTextAreaElement)
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <Card
                        className={`rounded-2xl border bg-card p-4 transition-all duration-200 ${
                          snapshot.isDragging ? "ring-2 ring-ring/20" : ""
                        } ${
                          selectedFieldId === field.id
                            ? "border-primary bg-accent/10 ring-2 ring-primary/20"
                            : "border-border hover:bg-accent/5"
                        } ${
                          showLogicCues && isHidden
                            ? "pointer-events-none relative border-2 border-muted border-dashed opacity-50"
                            : showLogicCues && isDisabled
                              ? "relative opacity-60"
                              : ""
                        }`}
                        onClick={() =>
                          onFieldSelect(
                            selectedFieldId === field.id ? null : field.id
                          )
                        }
                      >
                        {}
                        {showLogicCues && (isHidden || isDisabled) && (
                          <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                            {isHidden && (
                              <span className="flex items-center gap-1 rounded-xl border border-muted/40 bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                                <EyeOff className="mr-1 h-4 w-4" /> Hidden
                              </span>
                            )}
                            {!isHidden && isDisabled && (
                              <span className="flex items-center gap-1 rounded-xl border border-muted/40 bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                                <Lock className="mr-1 h-4 w-4" /> Disabled
                              </span>
                            )}
                          </div>
                        )}
                        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFieldDelete(field.id);
                            }}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div
                            {...provided.dragHandleProps}
                            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-xl transition-colors hover:bg-muted/20 active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <FormFieldRenderer
                          builderMode={true}
                          disabled={fieldVisibility?.[field.id]?.disabled}
                          field={field}
                          onChange={(value) =>
                            onFieldValueChange(field.id, value)
                          }
                          value={
                            typeof formData[field.id] === "object"
                              ? (formData[field.id].text ??
                                JSON.stringify(formData[field.id]))
                              : formData[field.id]
                          }
                        />
                      </Card>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            {onAddField && <AddFieldButton />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
