import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldSettingsProps } from "./types";

export function SchedulerFieldSettings({
  field,
  onUpdateSettings,
}: FieldSettingsProps) {
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);

  return (
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          Scheduler Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="scheduler-provider">
            Scheduler Provider
          </Label>
          <Select
            onValueChange={(val) =>
              onUpdateSettings({ schedulerProvider: val as any })
            }
            value={field.settings?.schedulerProvider || ""}
          >
            <SelectTrigger className="w-full" id="scheduler-provider">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calcom">Cal.com</SelectItem>
              <SelectItem value="calendly">Calendly</SelectItem>
              <SelectItem value="tidycal">TidyCal</SelectItem>
            </SelectContent>
          </Select>
          <p
            className="text-muted-foreground text-xs"
            id="scheduler-provider-help"
          >
            Choose your preferred scheduling platform
          </p>
        </div>
        {field.settings?.schedulerProvider && (
          <div className="flex flex-col gap-2">
            <Label className="font-medium text-sm" htmlFor="scheduler-link">
              {(() => {
                switch (field.settings?.schedulerProvider) {
                  case "calcom":
                    return "Cal.com Link";
                  case "calendly":
                    return "Calendly Link";
                  case "tidycal":
                    return "TidyCal Link";
                  default:
                    return "Scheduler Link";
                }
              })()}
            </Label>
            <Input
              aria-describedby="scheduler-link-help"
              autoComplete="off"
              id="scheduler-link"
              name="scheduler-link"
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
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                }
              }}
              placeholder="https://..."
              type="url"
              value={
                field.settings && field.settings.schedulerProvider
                  ? field.settings.schedulerLinks?.[
                      field.settings.schedulerProvider
                    ] || ""
                  : ""
              }
            />
            <p
              className="text-muted-foreground text-xs"
              id="scheduler-link-help"
            >
              Embed URL for your {field.settings?.schedulerProvider} scheduler
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label
            className="font-medium text-sm"
            htmlFor="scheduler-button-text"
          >
            Calendar Opener Button Text
          </Label>
          <Input
            aria-describedby="scheduler-button-text-help"
            autoComplete="off"
            id="scheduler-button-text"
            name="scheduler-button-text"
            onChange={(e) =>
              onUpdateSettings({ schedulerButtonText: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="e.g. Book a Call"
            type="text"
            value={field.settings?.schedulerButtonText || ""}
          />
          <p
            className="text-muted-foreground text-xs"
            id="scheduler-button-text-help"
          >
            Text displayed on the scheduler button
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="scheduler-preview">
            Preview
          </Label>
          <Button
            aria-describedby="scheduler-preview-help"
            className="w-fit bg-foreground/80 text-background hover:bg-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            disabled={
              !(
                field.settings?.schedulerProvider &&
                field.settings?.schedulerLinks?.[
                  field.settings.schedulerProvider
                ]
              )
            }
            id="scheduler-preview"
            onClick={() => setSchedulerModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSchedulerModalOpen(true);
              }
            }}
            type="button"
          >
            {field.settings?.schedulerButtonText || "Open Scheduler"}
          </Button>
          <p
            className="text-muted-foreground text-xs"
            id="scheduler-preview-help"
          >
            Click to preview how the scheduler will appear
          </p>
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
                      className="h-full w-full rounded-xl border-none"
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
                  aria-label="Close scheduler preview"
                  className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  onClick={() => setSchedulerModalOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSchedulerModalOpen(false);
                    }
                  }}
                  variant="outline"
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </CardContent>
    </Card>
  );
}
