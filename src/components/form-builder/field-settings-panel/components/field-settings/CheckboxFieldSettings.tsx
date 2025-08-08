import { X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { FieldSettingsProps } from './types';

export function CheckboxFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const [newOption, setNewOption] = useState('');

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Checkbox Options</h3>
      <div className="flex flex-col gap-2">
        <Label className="text-card-foreground" htmlFor="checkbox-options">
          Options
        </Label>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            id="checkbox-option-input"
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newOption.trim()) {
                onFieldUpdate({
                  ...field,
                  options: [...(field.options || []), newOption.trim()],
                });
                setNewOption('');
              }
            }}
            placeholder="Add option"
            type="text"
            value={newOption || ''}
          />
          <Button
            disabled={!(newOption && newOption.trim())}
            onClick={() => {
              if (newOption && newOption.trim()) {
                onFieldUpdate({
                  ...field,
                  options: [...(field.options || []), newOption.trim()],
                });
                setNewOption('');
              }
            }}
            size="sm"
            type="button"
          >
            Add
          </Button>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {(field.options || []).map((option, idx) => (
            <div className="flex items-center gap-2" key={idx}>
              <span className="flex-1 truncate">
                {typeof option === 'string'
                  ? option
                  : (option.label ?? option.value)}
              </span>
              <Button
                onClick={() => {
                  const updated = [...(field.options || [])];
                  updated.splice(idx, 1);
                  onFieldUpdate({ ...field, options: updated });
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Switch
          checked={!!field.settings?.allowMultiple}
          id="checkbox-allow-multiple"
          onCheckedChange={(checked) =>
            onUpdateSettings({ allowMultiple: checked })
          }
          size="sm"
        />
        <Label
          className="text-card-foreground"
          htmlFor="checkbox-allow-multiple"
        >
          Allow multiple selection
        </Label>
      </div>
      <p className="ml-8 text-muted-foreground text-xs">
        If enabled, users can select more than one option. If disabled, only one
        option can be selected.
      </p>
    </Card>
  );
}
