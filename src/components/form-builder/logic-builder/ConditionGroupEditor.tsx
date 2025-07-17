import React from "react";
import type { LogicConditionGroup, LogicCondition } from "./types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { FormField } from "@/lib/database";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const availableOperators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Not Contains" },
  { value: "is_empty", label: "Is Empty" },
  { value: "is_not_empty", label: "Is Not Empty" },
  { value: "includes", label: "Includes" },
];

function ConditionGroupEditor({
  group,
  onChange,
  onDelete,
  fields,
}: {
  group: LogicConditionGroup;
  onChange: (group: LogicConditionGroup) => void;
  onDelete?: () => void;
  fields: FormField[];
}) {
  // Handler for changing group logic (AND/OR)
  const handleLogicChange = (logic: "AND" | "OR") => {
    onChange({ ...group, logic });
  };

  // Handler for adding a new condition
  const handleAddCondition = () => {
    const newCond: LogicCondition = {
      id: `cond-${Date.now()}`,
      field: fields[0]?.id || "",
      operator: availableOperators[0].value as any,
      value: "",
    };
    onChange({ ...group, conditions: [...group.conditions, newCond] });
  };

  // Handler for adding a new group
  const handleAddGroup = () => {
    const newGroup: LogicConditionGroup = {
      id: `group-${Date.now()}`,
      logic: "AND",
      conditions: [],
    };
    onChange({ ...group, conditions: [...group.conditions, newGroup] });
  };

  // Handler for updating a condition or group
  const handleUpdate = (
    idx: number,
    updated: LogicCondition | LogicConditionGroup,
  ) => {
    const updatedConds = group.conditions.slice();
    updatedConds[idx] = updated;
    onChange({ ...group, conditions: updatedConds });
  };

  // Handler for deleting a condition or group
  const handleDelete = (idx: number) => {
    const updatedConds = group.conditions.slice();
    updatedConds.splice(idx, 1);
    onChange({ ...group, conditions: updatedConds });
  };

  return (
    <Card className="p-3 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">Group</span>
        <Select
          value={group.logic}
          onValueChange={(v) => handleLogicChange(v as "AND" | "OR")}
        >
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
        {onDelete && (
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {group.conditions.map((cond, idx) =>
          "logic" in cond ? (
            <ConditionGroupEditor
              key={cond.id}
              group={cond}
              onChange={(updated) => handleUpdate(idx, updated)}
              onDelete={() => handleDelete(idx)}
              fields={fields}
            />
          ) : (
            <div key={cond.id} className="flex items-center gap-2">
              <Select
                value={cond.field}
                onValueChange={(v) => handleUpdate(idx, { ...cond, field: v })}
              >
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={cond.operator}
                onValueChange={(v) =>
                  handleUpdate(idx, { ...cond, operator: v as any })
                }
              >
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="input input-xs"
                value={cond.value}
                onChange={(e) =>
                  handleUpdate(idx, { ...cond, value: e.target.value })
                }
                placeholder="Value"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ),
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={handleAddCondition}>
          <Plus className="w-3 h-3 mr-1" /> Add Condition
        </Button>
        <Button size="sm" variant="outline" onClick={handleAddGroup}>
          <Plus className="w-3 h-3 mr-1" /> Add Group
        </Button>
      </div>
    </Card>
  );
}

export { ConditionGroupEditor };
