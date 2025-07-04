"use client";

import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Trash2,
  Settings,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FormFieldRenderer } from "./form-field-renderer";
import type { FormField, FormSchema, FormBlock } from "@/lib/database.types";

interface FormPreviewProps {
  schema: FormSchema;
  selectedFieldId: string | null;
  selectedBlockId?: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldsReorder: (fields: FormField[]) => void;
  onFieldDelete: (fieldId: string) => void;
  onFormSettingsUpdate?: (settings: Partial<FormSchema["settings"]>) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<FormBlock>) => void;
  onStepSelect?: (stepIndex: number) => void;
}

export function FormPreview({
  schema,
  selectedFieldId,
  selectedBlockId,
  onFieldSelect,
  onFieldsReorder,
  onFieldDelete,
  onFormSettingsUpdate,
  onBlockUpdate,
  onStepSelect,
}: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingStepTitle, setEditingStepTitle] = useState(false);
  const [editingStepDescription, setEditingStepDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(schema.settings.title);
  const [tempDescription, setTempDescription] = useState(
    schema.settings.description || ""
  );
  const [tempStepTitle, setTempStepTitle] = useState("");
  const [tempStepDescription, setTempStepDescription] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const stepTitleInputRef = useRef<HTMLInputElement>(null);
  const stepDescriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Determine if this is a multi-step form
  const isMultiStep = schema.blocks && schema.blocks.length > 1;

  // Get all fields from either blocks or legacy fields array
  const allFields = schema.blocks?.length
    ? schema.blocks.flatMap((block) => block.fields)
    : schema.fields || [];

  // Get current step for multi-step forms
  const currentStep = isMultiStep ? schema.blocks?.[currentStepIndex] : null;
  const currentStepFields = isMultiStep ? currentStep?.fields || [] : allFields;

  // Update current step index when selectedBlockId changes
  useEffect(() => {
    if (selectedBlockId && schema.blocks) {
      const blockIndex = schema.blocks.findIndex(
        (block) => block.id === selectedBlockId
      );
      if (blockIndex !== -1) {
        setCurrentStepIndex(blockIndex);
      }
    }
  }, [selectedBlockId, schema.blocks]);

  // Update temp values when schema changes
  useEffect(() => {
    setTempTitle(schema.settings.title);
    setTempDescription(schema.settings.description || "");
  }, [schema.settings.title, schema.settings.description]);

  // Update temp step values when current step changes
  useEffect(() => {
    if (currentStep) {
      setTempStepTitle(currentStep.title);
      setTempStepDescription(currentStep.description || "");
    }
  }, [currentStep]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  useEffect(() => {
    if (editingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [editingDescription]);

  useEffect(() => {
    if (editingStepTitle && stepTitleInputRef.current) {
      stepTitleInputRef.current.focus();
      stepTitleInputRef.current.select();
    }
  }, [editingStepTitle]);

  useEffect(() => {
    if (editingStepDescription && stepDescriptionInputRef.current) {
      stepDescriptionInputRef.current.focus();
      stepDescriptionInputRef.current.select();
    }
  }, [editingStepDescription]);

  const handleFieldValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleTitleSave = () => {
    if (onFormSettingsUpdate && tempTitle.trim() !== schema.settings.title) {
      onFormSettingsUpdate({ title: tempTitle.trim() || "Untitled Form" });
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (
      onFormSettingsUpdate &&
      tempDescription !== schema.settings.description
    ) {
      onFormSettingsUpdate({ description: tempDescription });
    }
    setEditingDescription(false);
  };

  const handleStepTitleSave = () => {
    if (
      onBlockUpdate &&
      currentStep &&
      tempStepTitle.trim() !== currentStep.title
    ) {
      onBlockUpdate(currentStep.id, {
        title: tempStepTitle.trim(),
      });
    }
    setEditingStepTitle(false);
  };

  const handleStepDescriptionSave = () => {
    if (
      onBlockUpdate &&
      currentStep &&
      tempStepDescription !== currentStep.description
    ) {
      onBlockUpdate(currentStep.id, { description: tempStepDescription });
    }
    setEditingStepDescription(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTempTitle(schema.settings.title);
      setEditingTitle(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      setTempDescription(schema.settings.description || "");
      setEditingDescription(false);
    }
  };

  const handleStepTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleStepTitleSave();
    } else if (e.key === "Escape") {
      setTempStepTitle(currentStep?.title || "");
      setEditingStepTitle(false);
    }
  };

  const handleStepDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleStepDescriptionSave();
    } else if (e.key === "Escape") {
      setTempStepDescription(currentStep?.description || "");
      setEditingStepDescription(false);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    // For multi-step forms, only reorder within the current step
    const fieldsToReorder = isMultiStep ? currentStepFields : allFields;
    const items = Array.from(fieldsToReorder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onFieldsReorder(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just for preview - actual submission will be handled elsewhere
    console.log("Form submission (preview):", formData);
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < (schema.blocks?.length || 1)) {
      setCurrentStepIndex(nextIndex);
      onStepSelect?.(nextIndex);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
      onStepSelect?.(prevIndex);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Form Header */}
        <div>
          {/* Editable Title */}
          <div className="group relative mb-2 min-h-[44px] flex items-center">
            {editingTitle ? (
              <Input
                ref={titleInputRef}
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="text-3xl font-bold p-0 rounded-none flex items-center justify-start text-left h-11 bg-background ring-background border-background outline-background focus-visible:ring-background "
              />
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-ele p-2 -m-2 h-11 transition-colors w-full"
                onClick={() => onFormSettingsUpdate && setEditingTitle(true)}
              >
                <h1 className="text-3xl font-bold text-foreground truncate">
                  {schema.settings.title || "Untitled Form"}
                </h1>
                {onFormSettingsUpdate && (
                  <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            )}
          </div>

          {/* Editable Description */}
          <div className="group relative min-h-[28px] flex items-start">
            {editingDescription ? (
              <Textarea
                ref={descriptionInputRef}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                onKeyDown={handleDescriptionKeyDown}
                placeholder="Add a description for your form..."
                className="p-0 h-auto rounded-none py-1 min-h-[28px] bg-background ring-background border-background outline-background focus-visible:ring-background"
                rows={Math.max(tempDescription.split("\n").length || 1, 1)}
              />
            ) : (
              <div
                className="cursor-pointer hover:bg-accent/10 rounded-ele p-2 -m-2 transition-colors flex items-start gap-2 w-full min-h-[28px]"
                onClick={() =>
                  onFormSettingsUpdate && setEditingDescription(true)
                }
              >
                {schema.settings.description ? (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {schema.settings.description}
                  </p>
                ) : onFormSettingsUpdate ? (
                  <p className="text-muted-foreground italic">
                    Click to add a description...
                  </p>
                ) : null}
                {onFormSettingsUpdate && (
                  <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Multi-Step Progress */}
        {isMultiStep && schema.blocks && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${
                      ((currentStepIndex + 1) / schema.blocks.length) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="ml-4 text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {schema.blocks.length}
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {schema.blocks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStepIndex(index);
                      onStepSelect?.(index);
                    }}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      index === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : index < currentStepIndex
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextStep}
                disabled={currentStepIndex === schema.blocks.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Current Step Header (for multi-step) */}
        {isMultiStep && currentStep && (
          <Card className="p-6 bg-accent/5 border-accent/20">
            {/* Editable Step Title */}
            <div className="group relative mb-3 min-h-[32px] flex items-center">
              {editingStepTitle ? (
                <Input
                  ref={stepTitleInputRef}
                  value={tempStepTitle}
                  onChange={(e) => setTempStepTitle(e.target.value)}
                  onBlur={handleStepTitleSave}
                  onKeyDown={handleStepTitleKeyDown}
                  className="text-xl font-semibold bg-background w-full"
                />
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-ele p-2 -m-2 transition-colors w-full"
                  onClick={() => onBlockUpdate && setEditingStepTitle(true)}
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentStep.title}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    Step {currentStepIndex + 1}
                  </Badge>
                  {onBlockUpdate && (
                    <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              )}
            </div>

            {/* Editable Step Description */}
            <div className="group relative min-h-[24px] flex items-start">
              {editingStepDescription ? (
                <Textarea
                  ref={stepDescriptionInputRef}
                  value={tempStepDescription}
                  onChange={(e) => setTempStepDescription(e.target.value)}
                  onBlur={handleStepDescriptionSave}
                  onKeyDown={handleStepDescriptionKeyDown}
                  placeholder="Add a description for this step..."
                  className="bg-background min-h-[60px] w-full"
                  rows={2}
                />
              ) : (
                <div
                  className="cursor-pointer hover:bg-accent/10 rounded-ele p-2 -m-2 transition-colors flex items-start gap-2 w-full min-h-[24px]"
                  onClick={() =>
                    onBlockUpdate && setEditingStepDescription(true)
                  }
                >
                  {currentStep.description ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {currentStep.description}
                    </p>
                  ) : onBlockUpdate ? (
                    <p className="text-muted-foreground italic">
                      Click to add a step description...
                    </p>
                  ) : null}
                  {onBlockUpdate && (
                    <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 flex-shrink-0" />
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStepFields.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4">
                <div className="w-16 h-16 bg-accent rounded-card mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-muted rounded-ele"></div>
                </div>
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                {isMultiStep ? "No fields in this step" : "No fields added yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isMultiStep
                  ? "Add fields from the palette to this step"
                  : "Add fields from the left panel to start building your form"}
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
                    {currentStepFields.map((field, index) => (
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
                              className={`p-4 transition-all duration-200 border border-border bg-card hover:bg-accent/5 rounded-card ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-2 ring-ring/20"
                                  : ""
                              } ${
                                selectedFieldId === field.id
                                  ? "border-primary bg-accent/10 ring-2 ring-primary/20"
                                  : ""
                              }`}
                              onClick={() =>
                                onFieldSelect(
                                  selectedFieldId === field.id ? null : field.id
                                )
                              }
                            >
                              {/* Field Controls */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onFieldDelete(field.id);
                                  }}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
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

                              {/* Field Content */}
                              <div>
                                <FormFieldRenderer
                                  field={field}
                                  value={
                                    typeof formData[field.id] === "object"
                                      ? formData[field.id].text ??
                                        JSON.stringify(formData[field.id])
                                      : formData[field.id]
                                  }
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

          {/* Submit Button - Only show on last step for multi-step or always for single step */}
          {currentStepFields.length > 0 &&
            (!isMultiStep ||
              currentStepIndex === (schema.blocks?.length || 1) - 1) && (
              <div>
                <Button type="submit" className="w-full sm:w-auto">
                  {schema.settings.submitText || "Submit"}
                </Button>
              </div>
            )}

          {/* Multi-step navigation buttons */}
          {isMultiStep &&
            currentStepFields.length > 0 &&
            currentStepIndex < (schema.blocks?.length || 1) - 1 && (
              <div className="flex justify-end pt-4">
                <Button onClick={nextStep} className="gap-2">
                  Continue to Next Step
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
