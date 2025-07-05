// External libraries
import React from "react";

// Internal components
import { EditableField } from "./EditableField";

// Types
import type { FormHeaderProps } from "../types";

export function FormHeader({ schema, onFormSettingsUpdate }: FormHeaderProps) {
  const handleTitleUpdate = (title: string) => {
    onFormSettingsUpdate?.({ title: title || "Untitled Form" });
  };

  const handleDescriptionUpdate = (description: string) => {
    onFormSettingsUpdate?.({ description });
  };

  return (
    <div className="flex flex-col gap-2">
      <EditableField
        value={schema.settings.title}
        placeholder="Click to add title..."
        onSave={handleTitleUpdate}
        disabled={!onFormSettingsUpdate}
        className="flex items-center gap-2 min-h-[44px]"
        inputClassName="text-3xl font-bold bg-background w-full"
      >
        <h1 className="text-3xl font-bold text-foreground truncate">
          {schema.settings.title || "Untitled Form"}
        </h1>
      </EditableField>

      <EditableField
        value={schema.settings.description || ""}
        placeholder="Click to add a description..."
        onSave={handleDescriptionUpdate}
        disabled={!onFormSettingsUpdate}
        component="textarea"
        rows={Math.max(
          (schema.settings.description || "").split("\n").length || 1,
          1,
        )}
        className="flex items-start gap-2 min-h-[28px]"
        inputClassName="bg-background w-full"
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
      </EditableField>
    </div>
  );
}
