import { Clock, Shield, UserCheck } from "lucide-react";
import React from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioItem } from "@/components/ui/radio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { DuplicatePreventionSectionProps } from "../types";

export function DuplicatePreventionSection({
  localSettings,
  updateDuplicatePrevention,
}: DuplicatePreventionSectionProps) {
  const duplicatePrevention = localSettings.duplicatePrevention || {};

  const updateSettings = (updates: Partial<typeof duplicatePrevention>) => {
    updateDuplicatePrevention({
      ...duplicatePrevention,
      ...updates,
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Duplicate Prevention</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={duplicatePrevention.enabled}
            id="duplicate-prevention-enabled"
            onCheckedChange={(checked) =>
              updateSettings({
                enabled: checked,
                strategy: checked
                  ? duplicatePrevention.strategy || "combined"
                  : undefined,
                mode: checked
                  ? duplicatePrevention.mode || "one-time"
                  : undefined,
                message: checked
                  ? duplicatePrevention.message ||
                    "You have already submitted this form. Each user can only submit once."
                  : undefined,
                timeWindow: checked
                  ? duplicatePrevention.timeWindow || 1440
                  : undefined,
                maxAttempts: checked
                  ? duplicatePrevention.maxAttempts || 1
                  : undefined,
              })
            }
            size="sm"
          />
          <Label
            className="font-medium text-sm"
            htmlFor="duplicate-prevention-enabled"
          >
            Enable Duplicate Prevention
          </Label>
        </div>

        {duplicatePrevention.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <PreventionModeSection
              duplicatePrevention={duplicatePrevention}
              updateSettings={updateSettings}
            />
            <PreventionStrategySection
              duplicatePrevention={duplicatePrevention}
              updateSettings={updateSettings}
            />
            {duplicatePrevention.mode === "time-based" && (
              <TimeBasedSettingsSection
                duplicatePrevention={duplicatePrevention}
                updateSettings={updateSettings}
              />
            )}
            <ErrorMessageSection
              duplicatePrevention={duplicatePrevention}
              updateSettings={updateSettings}
            />
            <OverrideSection
              duplicatePrevention={duplicatePrevention}
              updateSettings={updateSettings}
            />
            <DuplicatePreventionSummary
              duplicatePrevention={duplicatePrevention}
            />
          </div>
        ) : (
          <div className="rounded-card bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
              Duplicate prevention helps maintain data quality by preventing
              users from submitting the same form multiple times. Choose between
              time-based prevention or one-time submission mode.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function PreventionModeSection({
  duplicatePrevention,
  updateSettings,
}: {
  duplicatePrevention: any;
  updateSettings: (settings: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="mb-1 font-medium text-sm">Prevention Mode</Label>
      <RadioGroup
        onValueChange={(value) => {
          updateSettings({
            mode: value as "time-based" | "one-time",
            message:
              value === "one-time"
                ? "You have already submitted this form. Each user can only submit once."
                : "You have already submitted this form. Please wait before submitting again.",
          });
        }}
        value={duplicatePrevention.mode || "one-time"}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <RadioItem id="one-time" value="one-time" />
            <Label className="text-sm" htmlFor="one-time">
              One-time submission
            </Label>
          </div>
          <p className="ml-6 text-muted-foreground text-xs">
            Allow only one submission per user, ever
          </p>

          <div className="flex items-center gap-2">
            <RadioItem id="time-based" value="time-based" />
            <Label className="text-sm" htmlFor="time-based">
              Time-based prevention
            </Label>
          </div>
          <p className="ml-6 text-muted-foreground text-xs">
            Prevent duplicate submissions within a specified time window
          </p>
        </div>
      </RadioGroup>
    </div>
  );
}

function PreventionStrategySection({
  duplicatePrevention,
  updateSettings,
}: {
  duplicatePrevention: any;
  updateSettings: (settings: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="mb-1 font-medium text-sm">Prevention Strategy</Label>
      <Select
        onValueChange={(value: "ip" | "email" | "session" | "combined") =>
          updateSettings({ strategy: value })
        }
        value={duplicatePrevention.strategy || "combined"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="combined">
            Combined (IP + Email + Session) - Most Secure
          </SelectItem>
          <SelectItem value="email">
            Email Address - Best for Registration
          </SelectItem>
          <SelectItem value="ip">IP Address - Simple & Reliable</SelectItem>
          <SelectItem value="session">Session ID - Browser-based</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        {duplicatePrevention.strategy === "combined" &&
          "Track by combination of IP, email, and session for maximum accuracy"}
        {duplicatePrevention.strategy === "email" &&
          "Track by email address (requires email field in form)"}
        {duplicatePrevention.strategy === "ip" && "Track by IP address only"}
        {duplicatePrevention.strategy === "session" &&
          "Track by browser session"}
      </p>
    </div>
  );
}

function TimeBasedSettingsSection({
  duplicatePrevention,
  updateSettings,
}: {
  duplicatePrevention: any;
  updateSettings: (settings: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DuplicatePreventionInput
        description="How long to prevent duplicate submissions"
        id="time-window"
        label="Time Window (minutes)"
        max={10_080}
        min={1}
        onChange={(value) => updateSettings({ timeWindow: value })}
        placeholder="1440"
        value={duplicatePrevention.timeWindow || 1440}
      />
      <DuplicatePreventionInput
        description="Maximum attempts allowed within time window"
        id="max-attempts"
        label="Max Attempts"
        max={10}
        min={1}
        onChange={(value) => updateSettings({ maxAttempts: value })}
        placeholder="1"
        value={duplicatePrevention.maxAttempts || 1}
      />
    </div>
  );
}

function ErrorMessageSection({
  duplicatePrevention,
  updateSettings,
}: {
  duplicatePrevention: any;
  updateSettings: (settings: any) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="duplicate-message">Error Message</Label>
      <Textarea
        id="duplicate-message"
        onChange={(e) => updateSettings({ message: e.target.value })}
        placeholder={
          duplicatePrevention.mode === "one-time"
            ? "You have already submitted this form. Each user can only submit once."
            : "You have already submitted this form. Please wait before submitting again."
        }
        rows={2}
        value={
          duplicatePrevention.message ||
          (duplicatePrevention.mode === "one-time"
            ? "You have already submitted this form. Each user can only submit once."
            : "You have already submitted this form. Please wait before submitting again.")
        }
      />
      <p className="text-muted-foreground text-xs">
        Message shown to users when they try to submit a duplicate
      </p>
    </div>
  );
}

function OverrideSection({
  duplicatePrevention,
  updateSettings,
}: {
  duplicatePrevention: any;
  updateSettings: (settings: any) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={duplicatePrevention.allowOverride}
        id="duplicate-allow-override"
        onCheckedChange={(checked) =>
          updateSettings({ allowOverride: checked })
        }
        size="sm"
      />
      <Label className="font-medium text-sm" htmlFor="duplicate-allow-override">
        Allow Override
      </Label>
      <p className="text-muted-foreground text-xs">
        Allow users to bypass prevention (not recommended)
      </p>
    </div>
  );
}

function DuplicatePreventionInput({
  id,
  label,
  value,
  min,
  max,
  placeholder,
  description,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  placeholder: string;
  description: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        max={max}
        min={min}
        onChange={(e) => onChange(Number.parseInt(e.target.value) || min)}
        placeholder={placeholder}
        type="number"
        value={value}
      />
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  );
}

function DuplicatePreventionSummary({
  duplicatePrevention,
}: {
  duplicatePrevention: any;
}) {
  const modeText =
    duplicatePrevention.mode === "one-time"
      ? "one-time submission only"
      : `${duplicatePrevention.maxAttempts || 1} submission(s) every ${duplicatePrevention.timeWindow || 1440} minutes`;

  const strategyText =
    duplicatePrevention.strategy === "combined"
      ? "IP + Email + Session"
      : duplicatePrevention.strategy === "email"
        ? "Email Address"
        : duplicatePrevention.strategy === "ip"
          ? "IP Address"
          : "Session ID";

  return (
    <div className="rounded-card bg-muted/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Current Settings</span>
      </div>
      <p className="text-muted-foreground text-sm">
        <span className="font-medium">{modeText}</span> using{" "}
        <span className="font-medium">{strategyText}</span> tracking.
        {duplicatePrevention.allowOverride && (
          <span className="text-orange-600"> Override is enabled.</span>
        )}
      </p>
    </div>
  );
}
