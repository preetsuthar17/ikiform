import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { FormField } from "@/lib/database";
import {
  BasicSettings,
  EmptyState,
  FieldSpecificSettings,
  OptionsSettings,
  PrepopulationSettings,
  SettingsPanelHeader,
  ValidationSettings,
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
    <div
      className="flex h-full min-h-0 flex-col border-border bg-background"
      style={{
        overscrollBehavior: "contain",
      }}
    >
      <SettingsPanelHeader onClose={onClose} />
      <ScrollArea
        className="h-0 min-h-0 flex-1"
        style={{
          overscrollBehavior: "contain",
        }}
      >
        <div className="flex flex-col gap-4 p-4">
          {field.type !== "banner" && field.type !== "statement" && (
            <>
              <BasicSettings field={field} onFieldUpdate={onFieldUpdate} />
              <Separator />
            </>
          )}
          <FieldSpecificSettings
            field={field}
            onFieldUpdate={onFieldUpdate}
            onUpdateSettings={updateSettings}
          />
          {["select", "radio", "checkbox"].includes(field.type) && (
            <>
              <Separator />
              <OptionsSettings field={field} onFieldUpdate={onFieldUpdate} />
            </>
          )}
          <Separator />
          <PrepopulationSettings field={field} onFieldUpdate={onFieldUpdate} />
          <Separator />
          <ValidationSettings
            field={field}
            onUpdateValidation={updateValidation}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
