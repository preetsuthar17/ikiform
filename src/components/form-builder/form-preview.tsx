"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormFieldRenderer } from "./form-field-renderer";
import type { FormField, FormSchema } from "@/lib/database.types";

interface FormPreviewProps {
  schema: FormSchema;
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldsReorder: (fields: FormField[]) => void;
  onFieldDelete: (fieldId: string) => void;
}

export function FormPreview({
  schema,
  selectedFieldId,
  onFieldSelect,
  onFieldsReorder,
  onFieldDelete,
}: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(schema.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onFieldsReorder(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just for preview - actual submission will be handled elsewhere
    console.log("Form submission (preview):", formData);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Form Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {schema.settings.title || "Untitled Form"}
          </h1>
          {schema.settings.description && (
            <p className="text-muted-foreground">
              {schema.settings.description}
            </p>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {schema.fields.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                No fields added yet
              </p>
              <p className="text-sm text-muted-foreground">
                Add fields from the left panel to start building your form
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {schema.fields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative group`}
                          >
                            <Card
                              className={`p-4 transition-all duration-200 rounded-card ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              } ${
                                selectedFieldId === field.id
                                  ? "border-foreground rounded-card ring-0 shadow-md/2"
                                  : ""
                              }`}
                              onClick={() =>
                                onFieldSelect(
                                  selectedFieldId === field.id ? null : field.id
                                )
                              }
                            >
                              {/* Field Controls */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onFieldDelete(field.id);
                                  }}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>

                              {/* Field Content */}
                              <div className="pr-20">
                                <FormFieldRenderer
                                  field={field}
                                  value={formData[field.id]}
                                  onChange={(value) =>
                                    handleFieldValueChange(field.id, value)
                                  }
                                />
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {/* Submit Button */}
          {schema.fields.length > 0 && (
            <div className="pt-6">
              <Button type="submit" className="w-full sm:w-auto">
                {schema.settings.submitText || "Submit"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
