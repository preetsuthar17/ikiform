// External libraries
import React from "react";
import { Clock, Shield } from "lucide-react";

// UI components
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Types
import type { RateLimitSectionProps } from "../types";

export function RateLimitSection({
  localSettings,
  updateRateLimit,
}: RateLimitSectionProps) {
  const rateLimit = localSettings.rateLimit || {};

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Rate Limiting</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            size="sm"
            id="rate-limit-enabled"
            checked={rateLimit.enabled || false}
            onCheckedChange={(checked) =>
              updateRateLimit({
                enabled: checked,
                maxSubmissions: checked
                  ? rateLimit.maxSubmissions || 5
                  : undefined,
                timeWindow: checked ? rateLimit.timeWindow || 10 : undefined,
                message: checked
                  ? rateLimit.message ||
                    "Too many submissions. Please try again later."
                  : undefined,
                blockDuration: checked
                  ? rateLimit.blockDuration || 60
                  : undefined,
              })
            }
          />
          <Label htmlFor="rate-limit-enabled" className="text-sm font-medium">
            Enable Rate Limiting
          </Label>
        </div>

        {rateLimit.enabled ? (
          <div className="flex flex-col gap-4 border-l-2 border-muted pl-6">
            <div className="grid grid-cols-2 gap-4">
              <RateLimitInput
                id="max-submissions"
                label="Max Submissions"
                value={rateLimit.maxSubmissions || 5}
                min={1}
                max={100}
                placeholder="5"
                description="Maximum submissions allowed"
                onChange={(value) => updateRateLimit({ maxSubmissions: value })}
              />
              <RateLimitInput
                id="time-window"
                label="Time Window (minutes)"
                value={rateLimit.timeWindow || 10}
                min={1}
                max={1440}
                placeholder="10"
                description="Time window for rate limiting"
                onChange={(value) => updateRateLimit({ timeWindow: value })}
              />
            </div>
            <RateLimitInput
              id="block-duration"
              label="Block Duration (minutes)"
              value={rateLimit.blockDuration || 60}
              min={1}
              max={10080}
              placeholder="60"
              description="How long to block after limit is reached"
              onChange={(value) => updateRateLimit({ blockDuration: value })}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="rate-limit-message">Rate Limit Message</Label>
              <Textarea
                id="rate-limit-message"
                value={
                  rateLimit.message ||
                  "Too many submissions. Please try again later."
                }
                onChange={(e) => updateRateLimit({ message: e.target.value })}
                placeholder="Too many submissions. Please try again later."
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Message shown when rate limit is exceeded
              </p>
            </div>
            <RateLimitSummary rateLimit={rateLimit} />
          </div>
        ) : (
          <div className="bg-muted/30 rounded-card p-4">
            <p className="text-sm text-muted-foreground">
              Rate limiting helps protect your form from spam and abuse by
              limiting the number of submissions from the same IP address within
              a specified time period.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function RateLimitInput({
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
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || min)}
        placeholder={placeholder}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function RateLimitSummary({ rateLimit }: { rateLimit: any }) {
  return (
    <div className="bg-muted/50 rounded-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Current Settings</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Allow{" "}
        <span className="font-medium">{rateLimit.maxSubmissions || 5}</span>{" "}
        submissions every{" "}
        <span className="font-medium">{rateLimit.timeWindow || 10}</span>{" "}
        minutes. Block for{" "}
        <span className="font-medium">{rateLimit.blockDuration || 60}</span>{" "}
        minutes when exceeded.
      </p>
    </div>
  );
}
