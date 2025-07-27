import { Pencil, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { FormField } from '@/lib/database';
import type { LogicActionCondition } from './types';

function RuleList({
  rules = [],
  onAddRule,
  onEditRule,
  onDeleteRule,
  fields,
}: {
  rules?: LogicActionCondition[];
  onAddRule?: () => void;
  onEditRule?: (id: string) => void;
  onDeleteRule?: (id: string) => void;
  fields: FormField[];
}) {
  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-base">Logic Rules</h3>
        <Button onClick={onAddRule} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" /> Add Rule
        </Button>
      </div>
      {rules.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No logic rules yet.
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <Card
              className="flex items-center justify-between p-3"
              key={rule.id}
            >
              <div>
                <span className="font-medium">{rule.id}</span>
                {/* Optionally, add a summary of the action/condition here */}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEditRule?.(rule.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onDeleteRule?.(rule.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export { RuleList };
