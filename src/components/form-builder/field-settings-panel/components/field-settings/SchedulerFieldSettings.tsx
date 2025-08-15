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
import type { FieldSettingsProps } from './types';

export function SchedulerFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-4 rounded-card bg-background p-4">
      <h3 className="font-medium text-card-foreground">Scheduler Settings</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-card-foreground" htmlFor="scheduler-provider">
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
        {field.settings?.schedulerProvider && (
          <div className="flex flex-col gap-2">
            <Label className="text-card-foreground" htmlFor="scheduler-link">
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
          <Modal onOpenChange={setSchedulerModalOpen} open={schedulerModalOpen}>
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
  );
}
