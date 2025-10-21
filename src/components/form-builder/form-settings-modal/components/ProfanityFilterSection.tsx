import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";

import type { ProfanityFilterSectionProps } from "../types";

export function ProfanityFilterSection({
  localSettings,
  updateProfanityFilter,
  formId,
  schema,
}: ProfanityFilterSectionProps) {
  const [profanityFilterSettings, setProfanityFilterSettings] = useState({
    enabled: localSettings.profanityFilter?.enabled,
    strictMode: true,
    replaceWithAsterisks: localSettings.profanityFilter?.replaceWithAsterisks,
    customMessage: localSettings.profanityFilter?.customMessage || "",
    customWords: localSettings.profanityFilter?.customWords || [],
    whitelistedWords: localSettings.profanityFilter?.whitelistedWords || [],
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const profanityFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () =>
      window.removeEventListener(
        "beforeunload",
        onBeforeUnload as unknown as EventListener
      );
  }, [hasChanges]);

  const handleProfanityFilterChange = (field: string, value: any) => {
    setProfanityFilterSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setHasChanges(true);
  };

  const resetSettings = () => {
    setProfanityFilterSettings({
      enabled: localSettings.profanityFilter?.enabled,
      strictMode: true,
      replaceWithAsterisks: localSettings.profanityFilter?.replaceWithAsterisks,
      customMessage: localSettings.profanityFilter?.customMessage || "",
      customWords: localSettings.profanityFilter?.customWords || [],
      whitelistedWords: localSettings.profanityFilter?.whitelistedWords || [],
    });
    setHasChanges(false);
  };

  const saveProfanityFilter = async () => {
    if (!formId) {
      toast.error("Form ID is required to save settings");
      return;
    }

    setSaving(true);
    try {
      const trimmed = {
        ...profanityFilterSettings,
        customMessage: (profanityFilterSettings.customMessage || "").trim(),
        customWords: (profanityFilterSettings.customWords || [])
          .map((word) => word.trim())
          .filter((word) => word.length > 0),
        whitelistedWords: (profanityFilterSettings.whitelistedWords || [])
          .map((word) => word.trim())
          .filter((word) => word.length > 0),
      };
      const newSchema = {
        ...schema,
        settings: {
          ...schema.settings,
          profanityFilter: trimmed,
        },
      };
      await formsDb.updateForm(formId, { schema: newSchema as any });
      updateProfanityFilter(trimmed);
      setSaved(true);
      setHasChanges(false);
      toast.success("Profanity filter settings saved successfully");

      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving profanity filter:", error);
      toast.error("Failed to save profanity filter settings");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (profanityFilterRef.current) {
      const firstInput = profanityFilterRef.current.querySelector(
        "input, textarea"
      ) as HTMLElement;
      firstInput?.focus();
    }
  }, []);

  useEffect(() => {
    if (saved) {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Profanity filter settings saved successfully";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [saved]);

  return (
    <div
      aria-label="Profanity filter settings"
      className="flex flex-col gap-4"
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const isTextarea = target.tagName === "TEXTAREA";
        if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          saveProfanityFilter();
        }
      }}
      role="main"
      style={{
        overscrollBehavior: "contain",
      }}
    >
      <Card
        aria-labelledby="profanity-filter-title"
        className="shadow-none"
        ref={profanityFilterRef}
        role="region"
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle
                className="flex items-center gap-2 text-lg tracking-tight"
                id="profanity-filter-title"
              >
                Profanity Filter{" "}
                {hasChanges && (
                  <Badge className="gap-2" variant="secondary">
                    <div className="size-2 rounded-full bg-orange-500" />
                    Unsaved changes
                  </Badge>
                )}
              </CardTitle>
              <CardDescription id="profanity-filter-description">
                Automatically detect and filter inappropriate content
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label
                className="font-medium text-sm"
                htmlFor="profanity-filter-enabled"
              >
                Enable Profanity Filter
              </Label>
              <p
                className="text-muted-foreground text-xs"
                id="profanity-filter-enabled-description"
              >
                Automatically detect and filter inappropriate content
              </p>
            </div>
            <Switch
              aria-describedby="profanity-filter-enabled-description"
              checked={profanityFilterSettings.enabled}
              id="profanity-filter-enabled"
              onCheckedChange={(checked) =>
                handleProfanityFilterChange("enabled", checked)
              }
            />
          </div>

          {profanityFilterSettings.enabled && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <FilterModeSection
                  profanityFilter={profanityFilterSettings}
                  updateProfanityFilter={handleProfanityFilterChange}
                />
                <CustomMessageSection
                  profanityFilter={profanityFilterSettings}
                  updateProfanityFilter={handleProfanityFilterChange}
                />
                <WordManagementSection
                  title="Custom Words to Filter"
                  updateWords={(words) =>
                    handleProfanityFilterChange("customWords", words)
                  }
                  words={profanityFilterSettings.customWords}
                />
                <WordManagementSection
                  title="Whitelisted Words"
                  updateWords={(words) =>
                    handleProfanityFilterChange("whitelistedWords", words)
                  }
                  words={profanityFilterSettings.whitelistedWords}
                />
              </div>

              <div
                aria-live="polite"
                className="rounded-lg border border-muted bg-muted/50 p-4"
                role="status"
              >
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium text-foreground text-sm">
                    Current Configuration
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Profanity filter is{" "}
                    <span className="font-semibold text-foreground">
                      enabled
                    </span>{" "}
                    in{" "}
                    <span className="font-semibold text-foreground">
                      {profanityFilterSettings.strictMode
                        ? "strict mode"
                        : "replace mode"}
                    </span>
                    .
                    {profanityFilterSettings.customWords.length > 0 && (
                      <span>
                        {" "}
                        {profanityFilterSettings.customWords.length} custom
                        words configured.
                      </span>
                    )}
                    {profanityFilterSettings.whitelistedWords.length > 0 && (
                      <span>
                        {" "}
                        {profanityFilterSettings.whitelistedWords.length}{" "}
                        whitelisted words.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!profanityFilterSettings.enabled && (
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="text-muted-foreground text-sm">
                Profanity filter helps maintain a clean and professional
                environment by automatically detecting and filtering
                inappropriate content in form submissions.
              </p>
            </div>
          )}

          <div
            aria-label="Profanity filter actions"
            className="flex items-center justify-between"
            role="group"
          >
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  onClick={resetSettings}
                  size="sm"
                  variant="ghost"
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-describedby="profanity-filter-description"
                aria-label="Save profanity filter settings"
                disabled={saving || !hasChanges}
                loading={saving}
                onClick={saveProfanityFilter}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    saveProfanityFilter();
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterModeSection({
  profanityFilter,
  updateProfanityFilter,
}: {
  profanityFilter: any;
  updateProfanityFilter: (field: string, value: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-sm">Filter Mode</Label>
      <RadioGroup
        onValueChange={(value: "replace" | "strict") => {
          if (value === "replace") {
            updateProfanityFilter("strictMode", false);
            updateProfanityFilter("replaceWithAsterisks", true);
          } else {
            updateProfanityFilter("strictMode", true);
            updateProfanityFilter("replaceWithAsterisks", false);
          }
        }}
        orientation="vertical"
        value={profanityFilter.replaceWithAsterisks ? "replace" : "strict"}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id="strict-mode" value="strict" />
          <Label htmlFor="strict-mode">
            Strict Mode - Reject submissions with profanity
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="replace-mode" value="replace" />
          <Label htmlFor="replace-mode">
            Replace Mode - Replace profanity with asterisks
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

function CustomMessageSection({
  profanityFilter,
  updateProfanityFilter,
}: {
  profanityFilter: any;
  updateProfanityFilter: (field: string, value: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-sm" htmlFor="custom-message">
        Custom Message
      </Label>
      <Textarea
        className="text-base shadow-none md:text-sm"
        id="custom-message"
        name="custom-message"
        onChange={(e) => updateProfanityFilter("customMessage", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            (e.target as HTMLElement).blur();
          }
        }}
        placeholder="Enter a custom message to show when profanity is detected"
        rows={2}
        value={profanityFilter.customMessage || ""}
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
  const [newWord, setNewWord] = useState("");

  const addWord = () => {
    const value = newWord.trim();
    if (!value) return;

    const wordsToAdd = value
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);
    const newWords = wordsToAdd.filter((word) => !words.includes(word));

    if (newWords.length > 0) {
      updateWords([...words, ...newWords]);
    }
    setNewWord("");
  };

  const removeWord = (word: string) => {
    updateWords(words.filter((w) => w !== word));
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
      return;
    }
    if (e.key === ",") {
      // Instantly add current token on comma
      e.preventDefault();
      addWord();
    }
  };

  const isWhitelist = title.toLowerCase().includes("whitelist");

  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-sm">{title}</Label>
      <div className="flex items-center gap-2">
        <Input
          className="text-base shadow-none md:text-sm"
          name={`new-word-${isWhitelist ? "whitelist" : "filter"}`}
          onChange={(e) => setNewWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              (e.target as HTMLElement).blur();
            } else {
              onKeyDown(e);
            }
          }}
          placeholder={`Enter word(s) to ${isWhitelist ? "whitelist" : "filter"} (comma-separated for multiple)`}
          value={newWord}
        />
        <Button
          aria-label={`Add ${isWhitelist ? "whitelisted" : "filtered"} word`}
          onClick={addWord}
          size="sm"
          type="button"
        >
          Add
        </Button>
      </div>
      {words.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <Badge
              className="flex items-center gap-1"
              key={word}
              variant={isWhitelist ? "outline" : "secondary"}
            >
              <span>{word}</span>
              <Button
                aria-label={`Remove ${word}`}
                className="size-4 p-0"
                onClick={() => removeWord(word)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeWord(word);
                  }
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="size-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
