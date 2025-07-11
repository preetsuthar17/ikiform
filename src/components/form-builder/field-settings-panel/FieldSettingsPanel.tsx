// External imports
import React from "react";

// Component imports
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  EmptyState,
  BasicSettings,
  OptionsSettings,
  ValidationSettings,
  ErrorMessages,
  VisualSettings,
  FieldSpecificSettings,
  SettingsPanelHeader,
} from "./components";

// Utility imports
import { useFieldUpdates } from "./utils";

// Type imports
import type { FormField } from "@/lib/database";

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
    <div className="h-full bg-card border-border">
      <ScrollArea className="h-full">
        <SettingsPanelHeader onClose={onClose} />

        <div className="flex flex-col gap-4 p-4">
          <BasicSettings field={field} onFieldUpdate={onFieldUpdate} />

          <FieldSpecificSettings
            field={field}
            onUpdateSettings={updateSettings}
            onFieldUpdate={onFieldUpdate}
          />

          <OptionsSettings field={field} onFieldUpdate={onFieldUpdate} />

          <ValidationSettings
            field={field}
            onUpdateValidation={updateValidation}
          />

          <ErrorMessages field={field} onUpdateValidation={updateValidation} />

          <VisualSettings field={field} onUpdateSettings={updateSettings} />
        </div>
      </ScrollArea>
    </div>
  );
}
