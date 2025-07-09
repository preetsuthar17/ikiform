// External libraries
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus, ChevronDown } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Internal components
import { FormFieldRenderer } from "../../form-field-renderer";

// Types
import type { FormFieldsContainerProps } from "../types";

const FIELD_TYPES = [
  { type: "text", label: "Text Input" },
  { type: "email", label: "Email" },
  { type: "textarea", label: "Text Area" },
  { type: "number", label: "Number" },
  { type: "select", label: "Dropdown" },
  { type: "radio", label: "Radio Buttons" },
  { type: "checkbox", label: "Checkboxes" },
  { type: "slider", label: "Slider" },
  { type: "tags", label: "Tags" },
  { type: "social", label: "Social Media" },
] as const;

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
}: FormFieldsContainerProps) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = [...fields];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onFieldsReorder(items);
  };

  const AddFieldButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-42 border-dashed border-2 hover:border-primary/50 hover:bg-accent/10 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        {FIELD_TYPES.map((fieldType) => (
          <DropdownMenuItem
            key={fieldType.type}
            onClick={() => onAddField?.(fieldType.type)}
            className="cursor-pointer"
          >
            {fieldType.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
        <div className="w-16 h-16 bg-accent rounded-card flex items-center justify-center">
          <div className="w-8 h-8 bg-muted rounded-ele"></div>
        </div>
        <p className="text-lg font-medium text-foreground">
          {isMultiStep ? "No fields in this step" : "No fields added yet"}
        </p>
        <p className="text-sm text-muted-foreground">
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
            ref={provided.innerRef}
            className="flex flex-col gap-4"
          >
            {fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="relative group"
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
                      className={`p-4 transition-all duration-200 border bg-card rounded-card ${
                        snapshot.isDragging
                          ? "shadow-lg ring-2 ring-ring/20"
                          : ""
                      } ${
                        selectedFieldId === field.id
                          ? "border-primary bg-accent/10 ring-2 ring-primary/20"
                          : "border-border hover:bg-accent/5"
                      }`}
                      onClick={() =>
                        onFieldSelect(
                          selectedFieldId === field.id ? null : field.id,
                        )
                      }
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFieldDelete(field.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing h-8 w-8 flex items-center justify-center hover:bg-muted/20 transition-colors rounded-ele"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>

                      <FormFieldRenderer
                        field={field}
                        value={
                          typeof formData[field.id] === "object"
                            ? (formData[field.id].text ??
                              JSON.stringify(formData[field.id]))
                            : formData[field.id]
                        }
                        onChange={(value) =>
                          onFieldValueChange(field.id, value)
                        }
                      />
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {onAddField && <AddFieldButton />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
