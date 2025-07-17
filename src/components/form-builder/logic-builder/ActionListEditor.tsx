import React from "react";
import type { LogicAction } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import type { FormField } from "@/lib/database";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const availableActionTypes = [
  { value: "show", label: "Show Field" },
  { value: "hide", label: "Hide Field" },
  { value: "enable", label: "Enable Field" },
  { value: "disable", label: "Disable Field" },
];

function ActionListEditor({
  actions,
  onChange,
  fields,
  singleAction = false,
}: {
  actions: LogicAction[];
  onChange: (actions: LogicAction[]) => void;
  fields: FormField[];
  singleAction?: boolean;
}) {
  const handleAddAction = () => {
    onChange([
      ...actions,
      {
        id: `action-${Date.now()}`,
        type: "show",
        target: fields[0]?.id || "",
      },
    ]);
  };

  const handleUpdate = (idx: number, updated: Partial<LogicAction>) => {
    const updatedActions = actions.slice();
    updatedActions[idx] = { ...updatedActions[idx], ...updated };
    onChange(updatedActions);
  };

  const handleDelete = (idx: number) => {
    const updatedActions = actions.slice();
    updatedActions.splice(idx, 1);
    onChange(updatedActions);
  };

  return (
    <div className="space-y-2">
      {actions.map((action, idx) => (
        <Card key={action.id} className="flex items-center gap-2 p-3">
          <Select
            value={action.type}
            onValueChange={(v) => handleUpdate(idx, { type: v as any })}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              {availableActionTypes.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={action.target}
            onValueChange={(v) => handleUpdate(idx, { target: v })}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Target Field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Value input for set_value or show_message */}
          {/* Remove value input for set_value, show_message, etc. */}
          {!singleAction && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </Card>
      ))}
      {!singleAction && (
        <Button size="sm" variant="outline" onClick={handleAddAction}>
          <Plus className="w-3 h-3 mr-1" /> Add Action
        </Button>
      )}
    </div>
  );
}

export { ActionListEditor };
