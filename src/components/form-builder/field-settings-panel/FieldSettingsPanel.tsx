import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import type { FormField } from "@/lib/database";
import {
  BasicSettings,
  EmptyState,
  ErrorMessages,
  FieldSpecificSettings,
  OptionsSettings,
  PrepopulationSettings,
  SettingsPanelHeader,
  ValidationSettings,
  VisualSettings,
} from "./components";

import { useFieldUpdates } from "./utils";

interface FieldSettingsPanelProps {
  field: FormField | null;
  onFieldUpdate: (field: FormField) => void;
  onClose: () => void;
}

export function FieldSettingsPanel({
  field,
  onFieldUpdate,
  onClose,
}: FieldSettingsPanelProps) {
  const { updateField, updateValidation, updateSettings } = useFieldUpdates(
    field,
    onFieldUpdate
  );

  if (!field) {
    return <EmptyState onClose={onClose} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-border bg-background">
      <ScrollArea className="flex-1">
        <SettingsPanelHeader onClose={onClose} />
        <div className="flex flex-col gap-4 p-4">
          {field.type !== "banner" && field.type !== "statement" && (
            <BasicSettings field={field} onFieldUpdate={onFieldUpdate} />
          )}
          <FieldSpecificSettings
            field={field}
            onFieldUpdate={onFieldUpdate}
            onUpdateSettings={updateSettings}
          />
          {["select", "radio", "checkbox", "poll"].includes(field.type) && (
            <OptionsSettings field={field} onFieldUpdate={onFieldUpdate} />
          )}
          <PrepopulationSettings field={field} onFieldUpdate={onFieldUpdate} />
          <ValidationSettings
            field={field}
            onUpdateValidation={updateValidation}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
