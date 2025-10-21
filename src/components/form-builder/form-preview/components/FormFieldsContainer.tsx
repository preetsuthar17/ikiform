import { Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const itemRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const addButtonRef = React.useRef<HTMLButtonElement | null>(null);

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
          ref={addButtonRef}
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
          overscrollBehavior: "contain",
        }}
      >
        <ScrollArea
          style={{
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
      <section
        aria-labelledby="form-fields-empty-heading"
        className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        role="region"
      >
        <h2 className="sr-only" id="form-fields-empty-heading">
          Form fields
        </h2>
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
      </section>
    );
  }

  return (
    <section
      aria-labelledby="form-fields-heading"
      className="flex flex-col gap-4"
      role="region"
      style={{
        overscrollBehavior: "contain",
      }}
    >
      <h2 className="sr-only" id="form-fields-heading">
        Form fields
      </h2>
      <div aria-live="polite" className="sr-only">
        {renderFields.length} {renderFields.length === 1 ? "field" : "fields"}
      </div>
      <ul className="flex flex-col gap-4" role="list">
        {renderFields.map((field, index) => {
          const isHidden = fieldVisibility?.[field.id]?.visible === false;
          const isDisabled = fieldVisibility?.[field.id]?.disabled;
          return (
            <li className="group relative" key={field.id} role="listitem">
              <div
                aria-selected={selectedFieldId === field.id}
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
                  if (e.key === "Delete" || e.key === "Backspace") {
                    e.preventDefault();
                    const next =
                      renderFields[index + 1]?.id ??
                      renderFields[index - 1]?.id;
                    onFieldDelete(field.id);
                    requestAnimationFrame(() => {
                      if (next && itemRefs.current[next]) {
                        itemRefs.current[next]?.focus();
                      } else {
                        addButtonRef.current?.focus();
                      }
                    });
                  }
                }}
              >
                <Card
                  aria-describedby={
                    showLogicCues && (isHidden || isDisabled)
                      ? `${field.id}-state`
                      : undefined
                  }
                  aria-label={`${field.type} field`}
                  className={`p-4 shadow-none transition-all duration-200 ${
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onFieldSelect(
                        selectedFieldId === field.id ? null : field.id
                      );
                    }
                  }}
                  ref={(el) => {
                    itemRefs.current[field.id] = el as HTMLDivElement | null;
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label={`Delete ${field.type} field`}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next =
                              renderFields[index + 1]?.id ??
                              renderFields[index - 1]?.id;
                            onFieldDelete(field.id);
                            requestAnimationFrame(() => {
                              if (next && itemRefs.current[next]) {
                                itemRefs.current[next]?.focus();
                              } else {
                                addButtonRef.current?.focus();
                              }
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              const next =
                                renderFields[index + 1]?.id ??
                                renderFields[index - 1]?.id;
                              onFieldDelete(field.id);
                              requestAnimationFrame(() => {
                                if (next && itemRefs.current[next]) {
                                  itemRefs.current[next]?.focus();
                                } else {
                                  addButtonRef.current?.focus();
                                }
                              });
                            }
                          }}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent align="center" side="top">
                        Delete field
                      </TooltipContent>
                    </Tooltip>
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
            </li>
          );
        })}
        {onAddField && <AddFieldButton />}
      </ul>
    </section>
  );
}
