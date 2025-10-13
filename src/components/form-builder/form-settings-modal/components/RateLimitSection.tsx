import { Clock, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { RateLimitSectionProps } from "../types";

export function RateLimitSection({
  localSettings,
  updateRateLimit,
}: RateLimitSectionProps) {
  const rateLimit = localSettings.rateLimit || {};

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Rate Limiting</h3>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={rateLimit.enabled}
            id="rate-limit-enabled"
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
            size="sm"
          />
          <Label className="font-medium text-sm" htmlFor="rate-limit-enabled">
            Enable Rate Limiting
          </Label>
        </div>

        {rateLimit.enabled ? (
          <div className="flex flex-col gap-4 border-muted border-l-2 pl-6">
            <div className="grid grid-cols-2 gap-4">
              <RateLimitInput
                description="Maximum submissions allowed"
                id="max-submissions"
                label="Max Submissions"
                max={100}
                min={1}
                onChange={(value) => updateRateLimit({ maxSubmissions: value })}
                placeholder="5"
                value={rateLimit.maxSubmissions || 5}
              />
              <RateLimitInput
                description="Time window for rate limiting"
                id="time-window"
                label="Time Window (minutes)"
                max={1440}
                min={1}
                onChange={(value) => updateRateLimit({ timeWindow: value })}
                placeholder="10"
                value={rateLimit.timeWindow || 10}
              />
            </div>
            <RateLimitInput
              description="How long to block after limit is reached"
              id="block-duration"
              label="Block Duration (minutes)"
              max={10_080}
              min={1}
              onChange={(value) => updateRateLimit({ blockDuration: value })}
              placeholder="60"
              value={rateLimit.blockDuration || 60}
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="rate-limit-message">Rate Limit Message</Label>
              <Textarea
                id="rate-limit-message"
                onChange={(e) => updateRateLimit({ message: e.target.value })}
                placeholder="Too many submissions. Please try again later."
                rows={2}
                value={
                  rateLimit.message ||
                  "Too many submissions. Please try again later."
                }
              />
              <p className="text-muted-foreground text-xs">
                Message shown when rate limit is exceeded
              </p>
            </div>
            <RateLimitSummary rateLimit={rateLimit} />
          </div>
        ) : (
          <div className="rounded-2xl bg-muted/30 p-4">
            <p className="text-muted-foreground text-sm">
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

function RateLimitSummary({ rateLimit }: { rateLimit: any }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Current Settings</span>
      </div>
      <p className="text-muted-foreground text-sm">
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
