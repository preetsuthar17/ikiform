import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FormField } from '@/lib/database';
import type { LogicCondition, LogicConditionGroup } from './types';

const availableOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not Contains' },
  { value: 'is_empty', label: 'Is Empty' },
  { value: 'is_not_empty', label: 'Is Not Empty' },
  { value: 'includes', label: 'Includes' },
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
  const handleLogicChange = (logic: 'AND' | 'OR') => {
    onChange({ ...group, logic });
  };

  const handleAddCondition = () => {
    const newCond: LogicCondition = {
      id: `cond-${Date.now()}`,
      field: fields[0]?.id || '',
      operator: availableOperators[0].value as any,
      value: '',
    };
    onChange({ ...group, conditions: [...group.conditions, newCond] });
  };

  const handleAddGroup = () => {
    const newGroup: LogicConditionGroup = {
      id: `group-${Date.now()}`,
      logic: 'AND',
      conditions: [],
    };
    onChange({ ...group, conditions: [...group.conditions, newGroup] });
  };

  const handleUpdate = (
    idx: number,
    updated: LogicCondition | LogicConditionGroup
  ) => {
    const updatedConds = group.conditions.slice();
    updatedConds[idx] = updated;
    onChange({ ...group, conditions: updatedConds });
  };

  const handleDelete = (idx: number) => {
    const updatedConds = group.conditions.slice();
    updatedConds.splice(idx, 1);
    onChange({ ...group, conditions: updatedConds });
  };

  return (
    <Card className="mb-2 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-medium">Group</span>
        <Select
          onValueChange={(v) => handleLogicChange(v as 'AND' | 'OR')}
          value={group.logic}
        >
          <SelectTrigger className="w-24" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
        {onDelete && (
          <Button onClick={onDelete} size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {group.conditions.map((cond, idx) =>
          'logic' in cond ? (
            <ConditionGroupEditor
              fields={fields}
              group={cond}
              key={cond.id}
              onChange={(updated) => handleUpdate(idx, updated)}
              onDelete={() => handleDelete(idx)}
            />
          ) : (
            <div className="flex items-center gap-2" key={cond.id}>
              <Select
                onValueChange={(v) => handleUpdate(idx, { ...cond, field: v })}
                value={cond.field}
              >
                <SelectTrigger className="w-32" size="sm">
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
                onValueChange={(v) =>
                  handleUpdate(idx, { ...cond, operator: v as any })
                }
                value={cond.operator}
              >
                <SelectTrigger className="w-32" size="sm">
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
                onChange={(e) =>
                  handleUpdate(idx, { ...cond, value: e.target.value })
                }
                placeholder="Value"
                value={cond.value}
              />
              <Button
                onClick={() => handleDelete(idx)}
                size="icon"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <Button onClick={handleAddCondition} size="sm" variant="outline">
          <Plus className="mr-1 h-3 w-3" /> Add Condition
        </Button>
        <Button onClick={handleAddGroup} size="sm" variant="outline">
          <Plus className="mr-1 h-3 w-3" /> Add Group
        </Button>
      </div>
    </Card>
  );
}

export { ConditionGroupEditor };
