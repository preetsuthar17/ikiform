// External libraries
import React from "react";
import { AlertTriangle, Plus, X } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import { TagInput } from "@/components/ui/tag-input";

// Types
import type { ProfanityFilterSectionProps } from "../types";

export function ProfanityFilterSection({
  localSettings,
  updateProfanityFilter,
}: ProfanityFilterSectionProps) {
  const profanityFilter = localSettings.profanityFilter || {};

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Profanity Filter</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="profanity-filter-enabled"
            checked={profanityFilter.enabled || false}
            onCheckedChange={(checked) =>
              updateProfanityFilter({ enabled: checked })
            }
          />
          <Label
            htmlFor="profanity-filter-enabled"
            className="text-sm font-medium"
          >
            Enable Profanity Filter
          </Label>
        </div>

        {profanityFilter.enabled ? (
          <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
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
              words={profanityFilter.customWords || []}
              updateWords={(words) =>
                updateProfanityFilter({ customWords: words })
              }
            />
            <WordManagementSection
              title="Whitelisted Words"
              words={profanityFilter.whitelistedWords || []}
              updateWords={(words) =>
                updateProfanityFilter({ whitelistedWords: words })
              }
            />
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
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
      <Label className="text-sm font-medium mb-1">Filter Mode</Label>
      <RadioGroup
        value={profanityFilter.replaceWithAsterisks ? "replace" : "strict"}
        onValueChange={(value) => {
          if (value === "replace") {
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
      >
        <RadioItem
          value="strict"
          label="Strict Mode - Reject submissions with profanity"
          id="strict-mode"
        />
        <RadioItem
          value="replace"
          label="Replace Mode - Replace profanity with asterisks"
          id="replace-mode"
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
      <Label htmlFor="custom-message" className="text-sm font-medium">
        Custom Message
      </Label>
      <Textarea
        id="custom-message"
        placeholder="Enter a custom message to show when profanity is detected"
        value={profanityFilter.customMessage || ""}
        onChange={(e) =>
          updateProfanityFilter({ customMessage: e.target.value })
        }
        className="text-sm"
        rows={2}
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
      <Label className="text-sm font-medium">{title}</Label>
      <TagInput
        tags={words}
        onTagsChange={updateWords}
        placeholder={`Enter word to ${title.toLowerCase().includes("whitelist") ? "whitelist" : "filter"}`}
        tagVariant={
          title.toLowerCase().includes("whitelist") ? "outline" : "secondary"
        }
        tagSize="sm"
        className="w-full"
        clearAllButton
      />
    </div>
  );
}
