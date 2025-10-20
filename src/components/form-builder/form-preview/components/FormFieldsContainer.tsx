import { EyeOff, Lock, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FIELD_TYPES } from "../../field-palette/constants";

import { FormFieldRenderer } from "../../form-field-renderer";

import type { FormFieldsContainerProps } from "../types";

export function FormFieldsContainer({
  fields,
  selectedFieldId,
  formData,
  onFieldSelect,
  onFieldDelete,
  onFieldValueChange,
  isMultiStep,
  onAddField,
  fieldVisibility,
  showLogicCues = false,
}: FormFieldsContainerProps & { showLogicCues?: boolean }) {
  const AddFieldButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Add field to form"
          className="h-42 w-full border-2 border-dashed transition-colors hover:border-primary/50 hover:bg-accent/10"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
            }
          }}
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
          variant="outline"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add Field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="h-42 w-48"
        style={{
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          overscrollBehavior: "contain",
        }}
      >
        <ScrollArea
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            overscrollBehavior: "contain",
          }}
          type="always"
        >
          {FIELD_TYPES.map((fieldType: { type: string; label: string }) => (
            <DropdownMenuItem
              aria-label={`Add ${fieldType.label} field`}
              className="cursor-pointer"
              key={fieldType.type}
              onClick={() =>
                onAddField?.(
                  fieldType.type as (typeof FIELD_TYPES)[number]["type"]
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onAddField?.(
                    fieldType.type as (typeof FIELD_TYPES)[number]["type"]
                  );
                }
              }}
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
      <div
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        role="status"
        style={{
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-accent">
          <div aria-hidden="true" className="size-8 rounded-2xl bg-muted" />
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
    <div
      className="flex flex-col gap-4"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "contain",
      }}
    >
      {renderFields.map((field) => {
        const isHidden = fieldVisibility?.[field.id]?.visible === false;
        const isDisabled = fieldVisibility?.[field.id]?.disabled;
        return (
          <div
            className="group relative"
            key={field.id}
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
              aria-label={`${field.type} field - ${selectedFieldId === field.id ? "selected" : "click to select"}`}
              className={`rounded-2xl border bg-card p-4 transition-all duration-200 ${
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
                onFieldSelect(selectedFieldId === field.id ? null : field.id)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onFieldSelect(selectedFieldId === field.id ? null : field.id);
                }
              }}
              role="button"
              style={{
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
              tabIndex={0}
            >
              {showLogicCues && (isHidden || isDisabled) && (
                <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                  {isHidden && (
                    <span className="flex items-center gap-1 rounded-xl border border-muted/40 bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                      <EyeOff className="mr-1 size-4" /> Hidden
                    </span>
                  )}
                  {!isHidden && isDisabled && (
                    <span className="flex items-center gap-1 rounded-xl border border-muted/40 bg-muted px-2 py-0.5 text-muted-foreground text-xs">
                      <Lock className="mr-1 size-4" /> Disabled
                    </span>
                  )}
                </div>
              )}
              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  aria-label={`Delete ${field.type} field`}
                  className="size-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFieldDelete(field.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      onFieldDelete(field.id);
                    }
                  }}
                  size="sm"
                  style={{
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </Button>
              </div>
              <FormFieldRenderer
                builderMode={true}
                disabled={fieldVisibility?.[field.id]?.disabled}
                field={field}
                onChange={(value) => onFieldValueChange(field.id, value)}
                value={
                  typeof formData[field.id] === "object"
                    ? (formData[field.id].text ??
                      JSON.stringify(formData[field.id]))
                    : formData[field.id]
                }
              />
            </Card>
          </div>
        );
      })}
      {onAddField && <AddFieldButton />}
    </div>
  );
}
