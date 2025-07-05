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
    <div className="space-y-2">
      <Label className="text-sm font-medium">Filter Mode</Label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="strict-mode"
            name="filterMode"
            checked={profanityFilter.strictMode !== false}
            onChange={() =>
              updateProfanityFilter({
                strictMode: true,
                replaceWithAsterisks: false,
              })
            }
            className="w-4 h-4"
          />
          <Label htmlFor="strict-mode" className="text-sm">
            Strict Mode - Reject submissions with profanity
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="replace-mode"
            name="filterMode"
            checked={profanityFilter.replaceWithAsterisks === true}
            onChange={() =>
              updateProfanityFilter({
                strictMode: false,
                replaceWithAsterisks: true,
              })
            }
            className="w-4 h-4"
          />
          <Label htmlFor="replace-mode" className="text-sm">
            Replace Mode - Replace profanity with asterisks
          </Label>
        </div>
      </div>
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
    <div className="space-y-2">
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
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="space-y-2">
        {words.map((word, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={word}
              onChange={(e) => {
                const newWords = [...words];
                newWords[index] = e.target.value;
                updateWords(newWords);
              }}
              className="text-sm"
              placeholder={`Enter word to ${
                title.toLowerCase().includes("whitelist")
                  ? "whitelist"
                  : "filter"
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                const newWords = [...words];
                newWords.splice(index, 1);
                updateWords(newWords);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateWords([...words, ""])}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {title.split(" ")[0]} Word
        </Button>
      </div>
    </div>
  );
}
