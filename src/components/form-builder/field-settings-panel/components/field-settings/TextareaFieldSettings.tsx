import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FieldSettingsProps } from './types';

export function TextareaFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Field Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="textarea-rows">
            Number of Rows
          </Label>
          <Input
            className="border-border bg-input"
            id="textarea-rows"
            max="20"
            min="2"
            onChange={(e) =>
              onUpdateSettings({
                rows: Number.parseInt(e.target.value) || 4,
              })
            }
            type="number"
            value={field.settings?.rows || 4}
          />
        </div>
      </div>
    </Card>
  );
}
