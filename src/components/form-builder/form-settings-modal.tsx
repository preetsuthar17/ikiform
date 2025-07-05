"use client";

import React, { useState } from "react";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Save,
  Shield,
  Clock,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";
import type { FormSchema } from "@/lib/database.types";
import {
  DEFAULT_RATE_LIMIT_SETTINGS,
  DEFAULT_PROFANITY_FILTER_SETTINGS,
} from "@/lib/form-defaults";

interface FormSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: FormSchema;
  onSchemaUpdate: (updates: Partial<FormSchema>) => void;
}

export function FormSettingsModal({
  isOpen,
  onClose,
  schema,
  onSchemaUpdate,
}: FormSettingsModalProps) {
  // Initialize with default rate limit and profanity filter settings if not present
  const [localSettings, setLocalSettings] = useState({
    ...schema.settings,
    rateLimit: {
      ...DEFAULT_RATE_LIMIT_SETTINGS,
      ...schema.settings.rateLimit,
    },
    profanityFilter: {
      ...DEFAULT_PROFANITY_FILTER_SETTINGS,
      ...schema.settings.profanityFilter,
    },
  });

  const updateSettings = (updates: Partial<typeof schema.settings>) => {
    const newSettings = {
      ...localSettings,
      ...updates,
      rateLimit: {
        ...localSettings.rateLimit,
        ...updates.rateLimit,
      },
      profanityFilter: {
        ...localSettings.profanityFilter,
        ...updates.profanityFilter,
      },
    };
    setLocalSettings(newSettings);
  };

  const updateRateLimit = (
    rateLimitUpdates: Partial<NonNullable<typeof schema.settings.rateLimit>>
  ) => {
    const newSettings = {
      ...localSettings,
      rateLimit: {
        ...localSettings.rateLimit,
        ...rateLimitUpdates,
      },
    };
    setLocalSettings(newSettings);
  };

  const updateProfanityFilter = (
    profanityFilterUpdates: Partial<
      NonNullable<typeof schema.settings.profanityFilter>
    >
  ) => {
    const newSettings = {
      ...localSettings,
      profanityFilter: {
        ...localSettings.profanityFilter,
        ...profanityFilterUpdates,
      },
    };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSchemaUpdate({ settings: localSettings });
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings({
      ...schema.settings,
      rateLimit: {
        ...DEFAULT_RATE_LIMIT_SETTINGS,
        ...schema.settings.rateLimit,
      },
      profanityFilter: {
        ...DEFAULT_PROFANITY_FILTER_SETTINGS,
        ...schema.settings.profanityFilter,
      },
    });
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Form Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input
                    id="form-title"
                    value={localSettings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    placeholder="Enter form title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea
                    id="form-description"
                    value={localSettings.description || ""}
                    onChange={(e) =>
                      updateSettings({ description: e.target.value })
                    }
                    placeholder="Enter form description"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="submit-text">Submit Button Text</Label>
                  <Input
                    id="submit-text"
                    value={localSettings.submitText || "Submit"}
                    onChange={(e) =>
                      updateSettings({ submitText: e.target.value })
                    }
                    placeholder="Submit"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <Textarea
                    id="success-message"
                    value={localSettings.successMessage || ""}
                    onChange={(e) =>
                      updateSettings({ successMessage: e.target.value })
                    }
                    placeholder="Thank you for your submission!"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                  <Input
                    id="redirect-url"
                    value={localSettings.redirectUrl || ""}
                    onChange={(e) =>
                      updateSettings({ redirectUrl: e.target.value })
                    }
                    placeholder="https://example.com/thank-you"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Rate Limiting</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    size={"sm"}
                    id="rate-limit-enabled"
                    checked={localSettings.rateLimit?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateRateLimit({
                        enabled: checked,
                        // Set defaults when enabling
                        maxSubmissions: checked
                          ? localSettings.rateLimit?.maxSubmissions || 5
                          : undefined,
                        timeWindow: checked
                          ? localSettings.rateLimit?.timeWindow || 10
                          : undefined,
                        message: checked
                          ? localSettings.rateLimit?.message ||
                            "Too many submissions. Please try again later."
                          : undefined,
                        blockDuration: checked
                          ? localSettings.rateLimit?.blockDuration || 60
                          : undefined,
                      })
                    }
                  />
                  <Label
                    htmlFor="rate-limit-enabled"
                    className="text-sm font-medium"
                  >
                    Enable Rate Limiting
                  </Label>
                </div>

                {localSettings.rateLimit?.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="max-submissions">Max Submissions</Label>
                        <Input
                          id="max-submissions"
                          type="number"
                          min="1"
                          max="100"
                          value={localSettings.rateLimit?.maxSubmissions || 5}
                          onChange={(e) =>
                            updateRateLimit({
                              maxSubmissions: parseInt(e.target.value) || 5,
                            })
                          }
                          placeholder="5"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum submissions allowed
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="time-window">
                          Time Window (minutes)
                        </Label>
                        <Input
                          id="time-window"
                          type="number"
                          min="1"
                          max="1440"
                          value={localSettings.rateLimit?.timeWindow || 10}
                          onChange={(e) =>
                            updateRateLimit({
                              timeWindow: parseInt(e.target.value) || 10,
                            })
                          }
                          placeholder="10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Time window for rate limiting
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="block-duration">
                        Block Duration (minutes)
                      </Label>
                      <Input
                        id="block-duration"
                        type="number"
                        min="1"
                        max="10080"
                        value={localSettings.rateLimit?.blockDuration || 60}
                        onChange={(e) =>
                          updateRateLimit({
                            blockDuration: parseInt(e.target.value) || 60,
                          })
                        }
                        placeholder="60"
                      />
                      <p className="text-xs text-muted-foreground">
                        How long to block after limit is reached
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rate-limit-message">
                        Rate Limit Message
                      </Label>
                      <Textarea
                        id="rate-limit-message"
                        value={
                          localSettings.rateLimit?.message ||
                          "Too many submissions. Please try again later."
                        }
                        onChange={(e) =>
                          updateRateLimit({
                            message: e.target.value,
                          })
                        }
                        placeholder="Too many submissions. Please try again later."
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">
                        Message shown when rate limit is exceeded
                      </p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Current Settings
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow{" "}
                        <span className="font-medium">
                          {localSettings.rateLimit?.maxSubmissions || 5}
                        </span>{" "}
                        submissions every{" "}
                        <span className="font-medium">
                          {localSettings.rateLimit?.timeWindow || 10}
                        </span>{" "}
                        minutes. Block for{" "}
                        <span className="font-medium">
                          {localSettings.rateLimit?.blockDuration || 60}
                        </span>{" "}
                        minutes when exceeded.
                      </p>
                    </div>
                  </div>
                )}

                {!localSettings.rateLimit?.enabled && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Rate limiting helps protect your form from spam and abuse
                      by limiting the number of submissions from the same IP
                      address within a specified time period.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Profanity Filter</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    size={"sm"}
                    id="profanity-filter-enabled"
                    checked={localSettings.profanityFilter?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateProfanityFilter({
                        enabled: checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="profanity-filter-enabled"
                    className="text-sm font-medium"
                  >
                    Enable Profanity Filter
                  </Label>
                </div>

                {localSettings.profanityFilter?.enabled && (
                  <div className="space-y-4 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Filter Mode</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="strict-mode"
                            name="filterMode"
                            checked={
                              localSettings.profanityFilter?.strictMode !==
                              false
                            }
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
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="replace-mode"
                            name="filterMode"
                            checked={
                              localSettings.profanityFilter
                                ?.replaceWithAsterisks === true
                            }
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="custom-message"
                        className="text-sm font-medium"
                      >
                        Custom Message
                      </Label>
                      <Textarea
                        id="custom-message"
                        placeholder="Enter a custom message to show when profanity is detected"
                        value={
                          localSettings.profanityFilter?.customMessage || ""
                        }
                        onChange={(e) =>
                          updateProfanityFilter({
                            customMessage: e.target.value,
                          })
                        }
                        className="text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Custom Words to Filter
                      </Label>
                      <div className="space-y-2">
                        {(localSettings.profanityFilter?.customWords || []).map(
                          (word, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={word}
                                onChange={(e) => {
                                  const newWords = [
                                    ...(localSettings.profanityFilter
                                      ?.customWords || []),
                                  ];
                                  newWords[index] = e.target.value;
                                  updateProfanityFilter({
                                    customWords: newWords,
                                  });
                                }}
                                className="text-sm"
                                placeholder="Enter word to filter"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const newWords = [
                                    ...(localSettings.profanityFilter
                                      ?.customWords || []),
                                  ];
                                  newWords.splice(index, 1);
                                  updateProfanityFilter({
                                    customWords: newWords,
                                  });
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newWords = [
                              ...(localSettings.profanityFilter?.customWords ||
                                []),
                              "",
                            ];
                            updateProfanityFilter({ customWords: newWords });
                          }}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Custom Word
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Whitelisted Words
                      </Label>
                      <div className="space-y-2">
                        {(
                          localSettings.profanityFilter?.whitelistedWords || []
                        ).map((word, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={word}
                              onChange={(e) => {
                                const newWords = [
                                  ...(localSettings.profanityFilter
                                    ?.whitelistedWords || []),
                                ];
                                newWords[index] = e.target.value;
                                updateProfanityFilter({
                                  whitelistedWords: newWords,
                                });
                              }}
                              className="text-sm"
                              placeholder="Enter word to whitelist"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newWords = [
                                  ...(localSettings.profanityFilter
                                    ?.whitelistedWords || []),
                                ];
                                newWords.splice(index, 1);
                                updateProfanityFilter({
                                  whitelistedWords: newWords,
                                });
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
                          onClick={() => {
                            const newWords = [
                              ...(localSettings.profanityFilter
                                ?.whitelistedWords || []),
                              "",
                            ];
                            updateProfanityFilter({
                              whitelistedWords: newWords,
                            });
                          }}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Whitelisted Word
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!localSettings.profanityFilter?.enabled && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Profanity filter helps maintain a clean and professional
                      environment by automatically detecting and filtering
                      inappropriate content in form submissions.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </ScrollArea>
      </ModalContent>
    </Modal>
  );
}
