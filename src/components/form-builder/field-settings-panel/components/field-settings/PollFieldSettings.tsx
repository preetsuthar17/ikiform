import { X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import type { FieldSettingsProps } from './types';

export function PollFieldSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSettingsProps) {
  const [newOption, setNewOption] = useState('');

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Poll Settings</h3>
      <div className="flex flex-col gap-2">
        <Label className="text-card-foreground" htmlFor="poll-options">
          Poll Options
        </Label>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            id="poll-option-input"
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newOption.trim()) {
                onUpdateSettings({
                  pollOptions: [
                    ...(field.settings?.pollOptions || []),
                    newOption.trim(),
                  ],
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
                onUpdateSettings({
                  pollOptions: [
                    ...(field.settings?.pollOptions || []),
                    newOption.trim(),
                  ],
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
          {(field.settings?.pollOptions || []).map((option, idx) => (
            <div className="flex items-center gap-2" key={idx}>
              <Input
                className="flex-1"
                onChange={(e) => {
                  const updated = [...(field.settings?.pollOptions || [])];
                  updated[idx] = e.target.value;
                  onUpdateSettings({ pollOptions: updated });
                }}
                type="text"
                value={option}
              />
              <Button
                onClick={() => {
                  const updated = [...(field.settings?.pollOptions || [])];
                  updated.splice(idx, 1);
                  onUpdateSettings({ pollOptions: updated });
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
        <Separator>OR</Separator>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="poll-options">
            Fetch Options from API
          </Label>
          <Input
            className="mb-2 border-border bg-input"
            id="poll-options-api"
            onChange={(e) =>
              onFieldUpdate({ ...field, optionsApi: e.target.value })
            }
            placeholder="https://your-api.com/options"
            type="url"
            value={field.optionsApi || ''}
          />
          <div className="mb-2 flex gap-2">
            <Input
              className="border-border bg-input"
              id="poll-valueKey"
              onChange={(e) =>
                onFieldUpdate({ ...field, valueKey: e.target.value })
              }
              placeholder="Value key (e.g. id)"
              type="text"
              value={field.valueKey || ''}
            />
            <Input
              className="border-border bg-input"
              id="poll-labelKey"
              onChange={(e) =>
                onFieldUpdate({ ...field, labelKey: e.target.value })
              }
              placeholder="Label key (e.g. name)"
              type="text"
              value={field.labelKey || ''}
            />
          </div>
          {field.optionsApi && (
            <div className="mt-2 rounded border border-blue-200 bg-blue-50 p-2 text-blue-900 text-xs">
              <strong>API Data Guidance:</strong> This field will fetch options
              from the API endpoint:
              <br />
              <span className="font-mono text-xs">{field.optionsApi}</span>
              <br />
              <span>
                The API should return either:
                <ul className="mt-1 ml-6 list-disc">
                  <li>
                    <code>["Option 1", "Option 2", ...]</code>{' '}
                    <em>(array of strings)</em>
                  </li>
                  <li>
                    <code>
                      [&#123; value: "opt1", label: "Option 1" &#125;, ...]
                    </code>{' '}
                    <em>(array of objects)</em>
                  </li>
                  <li>
                    <code>&#123; options: [...] &#125;</code>{' '}
                    <em>(object with options array)</em>
                  </li>
                  <li>
                    <code>
                      [&#123; id: "opt1", name: "Option 1" &#125;, ...]
                    </code>{' '}
                    <em>(custom keys)</em>
                  </li>
                </ul>
                <span className="mt-1 block">
                  You can specify custom keys above to map your API data.
                  <br />
                  Each option must have a <code>value</code> property (or your
                  custom key). <code>label</code> is optional.
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={!!field.settings?.showResults}
          id="poll-show-results"
          onCheckedChange={(checked) =>
            onUpdateSettings({ showResults: checked })
          }
          size={'sm'}
        />
        <Label className="text-card-foreground" htmlFor="poll-show-results">
          Show results after voting
        </Label>
      </div>
    </Card>
  );
}
