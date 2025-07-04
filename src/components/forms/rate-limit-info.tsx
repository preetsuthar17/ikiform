import React from "react";
import { Card } from "@/components/ui/card";
import { Shield, Clock, AlertTriangle } from "lucide-react";

interface RateLimitInfoProps {
  rateLimit: {
    enabled: boolean;
    maxSubmissions: number;
    timeWindow: number;
    message: string;
  };
  className?: string;
}

export function RateLimitInfo({
  rateLimit,
  className = "",
}: RateLimitInfoProps) {
  if (!rateLimit.enabled) {
    return null;
  }

  return (
    <Card className={`p-4 bg-muted/30 border-muted ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">
              Rate Limiting Active
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                {rateLimit.maxSubmissions} per {rateLimit.timeWindow}m
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This form is protected against spam. You can submit up to{" "}
            <span className="font-medium">{rateLimit.maxSubmissions}</span>{" "}
            times every{" "}
            <span className="font-medium">{rateLimit.timeWindow}</span> minutes.
          </p>
        </div>
      </div>
    </Card>
  );
}

interface RateLimitExceededProps {
  message: string;
  limit: number;
  remaining: number;
  reset: number;
}

export function RateLimitExceeded({
  message,
  limit,
  remaining,
  reset,
}: RateLimitExceededProps) {
  const resetTime = new Date(reset).toLocaleTimeString();

  return (
    <Card className="p-4 bg-destructive/10 border-destructive/20">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-destructive/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-destructive mb-1">
            Rate Limit Exceeded
          </h4>
          <p className="text-sm text-muted-foreground mb-2">{message}</p>
          <div className="text-xs text-muted-foreground">
            <div>Limit: {limit} submissions</div>
            <div>Remaining: {remaining}</div>
            <div>Resets at: {resetTime}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
