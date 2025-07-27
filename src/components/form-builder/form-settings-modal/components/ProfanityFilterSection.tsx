// External libraries

import { AlertTriangle, Plus, X } from 'lucide-react';
import React from 'react';

// UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioItem } from '@/components/ui/radio';
import { Switch } from '@/components/ui/switch';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';

// Types
import type { ProfanityFilterSectionProps } from '../types';

export function ProfanityFilterSection({
  localSettings,
  updateProfanityFilter,
}: ProfanityFilterSectionProps) {
  const profanityFilter = localSettings.profanityFilter || {};

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Profanity Filter</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={profanityFilter.enabled}
            id="profanity-filter-enabled"
            onCheckedChange={(checked) =>
              updateProfanityFilter({ enabled: checked })
            }
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="profanity-filter-enabled"
          >
            Enable Profanity Filter
          </Label>
        </div>

        {profanityFilter.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <FilterModeSection
              profanityFilter={profanityFilter}
              updateProfanityFilter={updateProfanityFilter}
            />
            <CustomMessageSection
              profanityFilter={profanityFilter}
              updateProfanityFilter={updateProfanityFilter}
            />
            <WordManagementSection
              title="Custom Words to Filter"
              updateWords={(words) =>
                updateProfanityFilter({ customWords: words })
              }
              words={profanityFilter.customWords || []}
            />
            <WordManagementSection
              title="Whitelisted Words"
              updateWords={(words) =>
                updateProfanityFilter({ whitelistedWords: words })
              }
              words={profanityFilter.whitelistedWords || []}
            />
          </div>
        ) : (
          <div className="rounded-card bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Profanity filter helps maintain a clean and professional
              environment by automatically detecting and filtering inappropriate
              content in form submissions.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function FilterModeSection({
  profanityFilter,
  updateProfanityFilter,
}: {
  profanityFilter: any;
  updateProfanityFilter: (settings: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="mb-1 font-medium text-sm">Filter Mode</Label>
      <RadioGroup
        onValueChange={(value) => {
          if (value === 'replace') {
            updateProfanityFilter({
              strictMode: false,
              replaceWithAsterisks: true,
            });
          } else {
            updateProfanityFilter({
              strictMode: true,
              replaceWithAsterisks: false,
            });
          }
        }}
        orientation="vertical"
        value={profanityFilter.replaceWithAsterisks ? 'replace' : 'strict'}
      >
        <RadioItem
          id="strict-mode"
          label="Strict Mode - Reject submissions with profanity"
          value="strict"
        />
        <RadioItem
          id="replace-mode"
          label="Replace Mode - Replace profanity with asterisks"
          value="replace"
        />
      </RadioGroup>
    </div>
  );
}

function CustomMessageSection({
  profanityFilter,
  updateProfanityFilter,
}: {
  profanityFilter: any;
  updateProfanityFilter: (settings: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-sm" htmlFor="custom-message">
        Custom Message
      </Label>
      <Textarea
        className="text-sm"
        id="custom-message"
        onChange={(e) =>
          updateProfanityFilter({ customMessage: e.target.value })
        }
        placeholder="Enter a custom message to show when profanity is detected"
        rows={2}
        value={profanityFilter.customMessage || ''}
      />
    </div>
  );
}

function WordManagementSection({
  title,
  words,
  updateWords,
}: {
  title: string;
  words: string[];
  updateWords: (words: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-sm">{title}</Label>
      <TagInput
        className="w-full"
        clearAllButton
        onTagsChange={updateWords}
        placeholder={`Enter word to ${title.toLowerCase().includes('whitelist') ? 'whitelist' : 'filter'}`}
        tagSize="sm"
        tags={words}
        tagVariant={
          title.toLowerCase().includes('whitelist') ? 'outline' : 'secondary'
        }
      />
    </div>
  );
}
