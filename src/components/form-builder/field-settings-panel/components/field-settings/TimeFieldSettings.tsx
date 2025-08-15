import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { FieldSettingsProps } from './types';

export function TimeFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Time Field Settings</h3>
      <div className="flex items-center gap-2">
        <Switch
          checked={!!field.settings?.showCurrentTimeButton}
          id="showCurrentTimeButton"
          onCheckedChange={(checked) =>
            onUpdateSettings({ showCurrentTimeButton: checked })
          }
          size="sm"
        />
        <Label className="text-card-foreground" htmlFor="showCurrentTimeButton">
          Show 'Set Current Time' Button
        </Label>
      </div>
    </Card>
  );
}
