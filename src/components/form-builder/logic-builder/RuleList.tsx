import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FormField } from "@/lib/database";
import type { LogicActionCondition } from "./types";

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
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Logic Rules</h3>
        <Button size="sm" variant="outline" onClick={onAddRule}>
          <Plus className="w-4 h-4 mr-1" /> Add Rule
        </Button>
      </div>
      {rules.length === 0 ? (
        <div className="text-muted-foreground text-sm text-center py-8">
          No logic rules yet.
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <Card
              key={rule.id}
              className="flex items-center justify-between p-3"
            >
              <div>
                <span className="font-medium">{rule.id}</span>
                {/* Optionally, add a summary of the action/condition here */}
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEditRule?.(rule.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDeleteRule?.(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
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
