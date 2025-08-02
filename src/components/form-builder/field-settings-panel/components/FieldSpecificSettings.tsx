import { Cross, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import type { FormField } from '@/lib/database';

import { EmailValidationSettings } from './EmailValidationSettings';

interface FieldSpecificSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField['settings']>) => void;
  onFieldUpdate: (field: FormField) => void;
}

export function FieldSpecificSettings({
  field,
  onUpdateSettings,
  onFieldUpdate,
}: FieldSpecificSettingsProps) {
  const isTextareaType = field.type === 'textarea';
  const isSliderType = field.type === 'slider';
  const isTagsType = field.type === 'tags';
  const isSelectType = field.type === 'select';
  const isEmailType = field.type === 'email';
  const isDateType = field.type === 'date';
  const isSocialType = field.type === 'social';
  const isTimeType = field.type === 'time';
  const isSchedulerType = field.type === 'scheduler';
  const isPhoneType = field.type === 'phone';
  const isAddressType = field.type === 'address';
  const isLinkType = field.type === 'link';

  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);
  const [newOption, setNewOption] = useState('');

  if (
    !(
      isTextareaType ||
      isSliderType ||
      isTagsType ||
      isSelectType ||
      isEmailType ||
      isDateType ||
      isSocialType ||
      isTimeType ||
      isSchedulerType ||
      isPhoneType ||
      isAddressType ||
      isLinkType
    ) &&
    field.type !== 'poll' &&
    field.type !== 'rating' &&
    field.type !== 'checkbox'
  ) {
    return null;
  }

  if (isPhoneType) {
    return (
      <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
        <h3 className="font-medium text-card-foreground">
          Phone Field Settings
        </h3>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="phone-pattern">
            Custom Regex Pattern
          </Label>
          <Input
            className="border-border bg-input"
            id="phone-pattern"
            onChange={(e) => onUpdateSettings({ pattern: e.target.value })}
            placeholder="e.g. ^\\+?[0-9]{10,15}$"
            value={field.settings?.pattern ?? ''}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="phone-message">
            Custom Error Message
          </Label>
          <Input
            className="border-border bg-input"
            id="phone-message"
            onChange={(e) =>
              onUpdateSettings({ patternMessage: e.target.value })
            }
            placeholder="Please enter a valid phone number"
            value={field.settings?.patternMessage ?? ''}
          />
        </div>
      </Card>
    );
  }

  if (isLinkType) {
    return (
      <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
        <h3 className="font-medium text-card-foreground">
          Link Field Settings
        </h3>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="link-pattern">
            Custom Regex Pattern
          </Label>
          <Input
            className="border-border bg-input"
            id="link-pattern"
            onChange={(e) => onUpdateSettings({ pattern: e.target.value })}
            placeholder="e.g. ^https?://.+$"
            value={field.settings?.pattern ?? ''}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="link-message">
            Custom Error Message
          </Label>
          <Input
            className="border-border bg-input"
            id="link-message"
            onChange={(e) =>
              onUpdateSettings({ patternMessage: e.target.value })
            }
            placeholder="Please enter a valid URL"
            value={field.settings?.patternMessage ?? ''}
          />
        </div>
      </Card>
    );
  }

  if (isAddressType) {
    return (
      <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
        <h3 className="font-medium text-card-foreground">
          Address Field Settings
        </h3>
        <div className="flex flex-col gap-2">
          <Label
            className="text-card-foreground"
            htmlFor="address-required-lines"
          >
            Required Address Lines
          </Label>
          <Input
            className="border-border bg-input"
            id="address-required-lines"
            max={5}
            min={1}
            onChange={(e) =>
              onUpdateSettings({
                requiredLines: Number.parseInt(e.target.value),
              })
            }
            placeholder="e.g. 2 (Address Line 1 & City required)"
            type="number"
            value={field.settings?.requiredLines ?? ''}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="address-message">
            Custom Error Message
          </Label>
          <Input
            className="border-border bg-input"
            id="address-message"
            onChange={(e) =>
              onUpdateSettings({ requiredMessage: e.target.value })
            }
            placeholder="Please complete all required address fields"
            value={field.settings?.requiredMessage ?? ''}
          />
        </div>
      </Card>
    );
  }
  if (isTimeType) {
    return (
      <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
        <h3 className="font-medium text-card-foreground">
          Time Field Settings
        </h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={!!field.settings?.showCurrentTimeButton}
            id="showCurrentTimeButton"
            label="Show 'Set Current Time' Button"
            onCheckedChange={(checked) =>
              onUpdateSettings({ showCurrentTimeButton: checked })
            }
            size="sm"
          />
        </div>
      </Card>
    );
  }

  return (
    <>
      {}
      {isEmailType && (
        <EmailValidationSettings
          field={field}
          onUpdateSettings={onUpdateSettings}
        />
      )}

      {isSchedulerType && (
        <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
          <h3 className="font-medium text-card-foreground">
            Scheduler Settings
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label
                className="text-card-foreground"
                htmlFor="scheduler-provider"
              >
                Scheduler Provider
              </Label>
              <Select
                onValueChange={(val) =>
                  onUpdateSettings({ schedulerProvider: val as any })
                }
                value={field.settings?.schedulerProvider || ''}
              >
                <SelectTrigger
                  className="border-border bg-input"
                  id="scheduler-provider"
                >
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calcom">Cal.com</SelectItem>
                  <SelectItem value="calendly">Calendly</SelectItem>
                  <SelectItem value="tidycal">TidyCal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {}
            {field.settings?.schedulerProvider && (
              <div className="flex flex-col gap-2">
                <Label
                  className="text-card-foreground"
                  htmlFor="scheduler-link"
                >
                  {(() => {
                    switch (field.settings?.schedulerProvider) {
                      case 'calcom':
                        return 'Cal.com Link';
                      case 'calendly':
                        return 'Calendly Link';
                      case 'tidycal':
                        return 'TidyCal Link';
                      default:
                        return 'Scheduler Link';
                    }
                  })()}
                </Label>
                <Input
                  className="border-border bg-input"
                  id="scheduler-link"
                  onChange={(e) => {
                    if (!(field.settings && field.settings.schedulerProvider))
                      return;
                    onUpdateSettings({
                      schedulerLinks: {
                        ...(field.settings.schedulerLinks || {}),
                        [field.settings.schedulerProvider]: e.target.value,
                      },
                    });
                  }}
                  placeholder="https://..."
                  type="url"
                  value={
                    field.settings && field.settings.schedulerProvider
                      ? field.settings.schedulerLinks?.[
                          field.settings.schedulerProvider
                        ] || ''
                      : ''
                  }
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label
                className="text-card-foreground"
                htmlFor="scheduler-button-text"
              >
                Calendar Opener Button Text
              </Label>
              <Input
                className="border-border bg-input"
                id="scheduler-button-text"
                onChange={(e) =>
                  onUpdateSettings({ schedulerButtonText: e.target.value })
                }
                placeholder="e.g. Book a Call"
                type="text"
                value={field.settings?.schedulerButtonText || ''}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground">Preview</Label>
              <Button
                className="w-fit bg-foreground/80 text-background hover:bg-foreground"
                disabled={
                  !(
                    field.settings?.schedulerProvider &&
                    field.settings?.schedulerLinks?.[
                      field.settings.schedulerProvider
                    ]
                  )
                }
                onClick={() => setSchedulerModalOpen(true)}
                type="button"
              >
                {field.settings?.schedulerButtonText || 'Open Scheduler'}
              </Button>
              {}
              <Modal
                onOpenChange={setSchedulerModalOpen}
                open={schedulerModalOpen}
              >
                <ModalContent className="flex h-[95%] w-full max-w-[95%] flex-col gap-4">
                  <ModalHeader>
                    <ModalTitle>Scheduler Preview</ModalTitle>
                  </ModalHeader>
                  <div className="h-full">
                    {field.settings?.schedulerProvider &&
                      field.settings?.schedulerLinks?.[
                        field.settings.schedulerProvider
                      ] && (
                        <iframe
                          allow="camera; microphone; fullscreen"
                          className="h-full w-full rounded-ele border-none"
                          src={
                            field.settings.schedulerLinks[
                              field.settings.schedulerProvider
                            ]
                          }
                          title="Scheduler Embed"
                        />
                      )}
                  </div>
                  <ModalFooter>
                    <Button
                      onClick={() => setSchedulerModalOpen(false)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </Card>
      )}

      {}
      {isDateType && null}

      {}
      {isTextareaType && (
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
      )}

      {}
      {isSliderType && (
        <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
          <h3 className="font-medium text-card-foreground">Slider Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="slider-min">
                Minimum Value
              </Label>
              <Input
                className="border-border bg-input"
                id="slider-min"
                onChange={(e) =>
                  onUpdateSettings({
                    min: Number.parseInt(e.target.value) || 0,
                  })
                }
                type="number"
                value={field.settings?.min || 0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="slider-max">
                Maximum Value
              </Label>
              <Input
                className="border-border bg-input"
                id="slider-max"
                onChange={(e) =>
                  onUpdateSettings({
                    max: Number.parseInt(e.target.value) || 100,
                  })
                }
                type="number"
                value={field.settings?.max || 100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="slider-step">
                Step Size
              </Label>
              <Input
                className="border-border bg-input"
                id="slider-step"
                min="1"
                onChange={(e) =>
                  onUpdateSettings({
                    step: Number.parseInt(e.target.value) || 1,
                  })
                }
                type="number"
                value={field.settings?.step || 1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="slider-default">
                Default Value
              </Label>
              <Input
                className="border-border bg-input"
                id="slider-default"
                onChange={(e) =>
                  onUpdateSettings({
                    defaultValue: Number.parseInt(e.target.value) || 50,
                  })
                }
                type="number"
                value={field.settings?.defaultValue || 50}
              />
            </div>
          </div>
        </Card>
      )}

      {}
      {isTagsType && (
        <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
          <h3 className="font-medium text-card-foreground">Tags Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground" htmlFor="tags-max">
                Maximum Tags
              </Label>
              <Input
                className="border-border bg-input"
                id="tags-max"
                min="1"
                onChange={(e) =>
                  onUpdateSettings({
                    maxTags: Number.parseInt(e.target.value) || 10,
                  })
                }
                type="number"
                value={field.settings?.maxTags || 10}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={field.settings?.allowDuplicates}
                id="tags-duplicates"
                onCheckedChange={(checked) =>
                  onUpdateSettings({ allowDuplicates: checked })
                }
              />
              <Label className="text-card-foreground" htmlFor="tags-duplicates">
                Allow Duplicate Tags
              </Label>
            </div>
          </div>
        </Card>
      )}

      {}
      {isSocialType && (
        <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
          <h3 className="font-medium text-card-foreground">Social Platforms</h3>
          <div className="mb-2 flex flex-wrap gap-3">
            {[
              { key: 'github', label: 'GitHub' },
              { key: 'twitter', label: 'Twitter' },
              { key: 'linkedin', label: 'LinkedIn' },
              { key: 'facebook', label: 'Facebook' },
              { key: 'instagram', label: 'Instagram' },
              { key: 'youtube', label: 'YouTube' },
              { key: 'website', label: 'Website' },
            ].map((platform) => (
              <label
                className="flex cursor-pointer items-center gap-2"
                key={platform.key}
              >
                <input
                  checked={field.settings?.socialPlatforms?.includes(
                    platform.key
                  )}
                  onChange={(e) => {
                    const prev = field.settings?.socialPlatforms || [];
                    onUpdateSettings({
                      socialPlatforms: e.target.checked
                        ? [...prev, platform.key]
                        : prev.filter((p) => p !== platform.key),
                    });
                  }}
                  type="checkbox"
                />
                {platform.label}
              </label>
            ))}
          </div>
          <h4 className="mt-4 font-medium text-card-foreground">
            Custom Links
          </h4>
          <div className="flex flex-col gap-2">
            {(field.settings?.customLinks || []).map((link, idx) => (
              <div className="flex items-center gap-2" key={idx}>
                <Input
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    onUpdateSettings({ customLinks: updated });
                  }}
                  placeholder="Label"
                  type="text"
                  value={link.label}
                />
                <Input
                  onChange={(e) => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated[idx] = {
                      ...updated[idx],
                      placeholder: e.target.value,
                    };
                    onUpdateSettings({ customLinks: updated });
                  }}
                  placeholder="Placeholder (optional)"
                  type="text"
                  value={link.placeholder || ''}
                />
                <Button
                  className="shrink-0"
                  onClick={() => {
                    const updated = [...(field.settings?.customLinks || [])];
                    updated.splice(idx, 1);
                    onUpdateSettings({ customLinks: updated });
                  }}
                  size="icon"
                  type="button"
                  variant="destructive"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              className="mt-2 w-fit"
              onClick={() => {
                const updated = [
                  ...(field.settings?.customLinks || []),
                  { label: '', placeholder: '' },
                ];
                onUpdateSettings({ customLinks: updated });
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              + Add Custom Link
            </Button>
          </div>
        </Card>
      )}

      {field.type === 'poll' && (
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
                  <strong>API Data Guidance:</strong> This field will fetch
                  options from the API endpoint:
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
                      Each option must have a <code>value</code> property (or
                      your custom key). <code>label</code> is optional.
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
      )}

      {field.type === 'rating' && (
        <Card className="flex flex-col gap-3 rounded-card bg-background p-4">
          <h3 className="mb-2 font-medium text-card-foreground">
            Rating Settings
          </h3>
          <div className="grid grid-cols-2 items-center gap-2">
            <Label className="text-card-foreground" htmlFor="rating-star-count">
              Number of Stars
            </Label>
            <Input
              className="w-20"
              id="rating-star-count"
              max={10}
              min={1}
              onChange={(e) =>
                onUpdateSettings({
                  starCount: Math.max(
                    1,
                    Math.min(10, Number.parseInt(e.target.value) || 5)
                  ),
                })
              }
              type="number"
              value={field.settings?.starCount || 5}
            />
            <Label className="text-card-foreground" htmlFor="rating-star-size">
              Star Size
            </Label>
            <div className="flex items-center gap-2">
              <Slider
                className="w-28"
                max={64}
                min={16}
                onValueChange={([val]) => onUpdateSettings({ starSize: val })}
                step={1}
                value={[field.settings?.starSize || 28]}
              />
              <span className="w-8 text-right text-muted-foreground text-xs">
                {field.settings?.starSize || 28}px
              </span>
            </div>
            <Label className="text-card-foreground" htmlFor="rating-icon">
              Icon Type
            </Label>
            <Select
              onValueChange={(val) => onUpdateSettings({ icon: val })}
              value={field.settings?.icon || 'star'}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star">Star</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
              </SelectContent>
            </Select>
            <Label className="text-card-foreground" htmlFor="rating-color">
              Icon Color
            </Label>
            <Input
              className="h-8 w-12 border-none bg-transparent p-0"
              id="rating-color"
              onChange={(e) => onUpdateSettings({ color: e.target.value })}
              type="color"
              value={field.settings?.color || '#fbbf24'}
            />
          </div>
        </Card>
      )}

      {field.type === 'checkbox' && (
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
            If enabled, users can select more than one option. If disabled, only
            one option can be selected.
          </p>
        </Card>
      )}
    </>
  );
}
