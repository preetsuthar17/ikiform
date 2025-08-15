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
import type { LogicAction } from './types';

const availableActionTypes = [
  { value: 'show', label: 'Show Field' },
  { value: 'hide', label: 'Hide Field' },
  { value: 'enable', label: 'Enable Field' },
  { value: 'disable', label: 'Disable Field' },
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
        type: 'show',
        target: fields[0]?.id || '',
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
    <div className="flex flex-col gap-2">
      {actions.map((action, idx) => (
        <Card className="flex items-center gap-2 p-3" key={action.id}>
          <Select
            onValueChange={(v) => handleUpdate(idx, { type: v as any })}
            value={action.type}
          >
            <SelectTrigger className="w-36" size="sm">
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
            onValueChange={(v) => handleUpdate(idx, { target: v })}
            value={action.target}
          >
            <SelectTrigger className="w-36" size="sm">
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
          {}
          {}
          {!singleAction && (
            <Button
              onClick={() => handleDelete(idx)}
              size="icon"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </Card>
      ))}
      {!singleAction && (
        <Button onClick={handleAddAction} size="sm" variant="outline">
          <Plus className="mr-1 h-3 w-3" /> Add Action
        </Button>
      )}
    </div>
  );
}

export { ActionListEditor };
