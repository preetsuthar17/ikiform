import { AlertTriangle, Clock, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className={`border-muted bg-muted/30 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-2">
          <Shield className="size-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="font-medium text-foreground text-sm">
              Rate Limiting Active
            </h4>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="size-3" />
              <span>
                {rateLimit.maxSubmissions} per {rateLimit.timeWindow}m
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
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
    <Card className="border-destructive/20 bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-destructive/10 p-2">
          <AlertTriangle className="size-4 text-destructive" />
        </div>
        <div className="flex-1">
          <h4 className="mb-1 font-medium text-destructive text-sm">
            Rate Limit Exceeded
          </h4>
          <p className="mb-2 text-muted-foreground text-sm">{message}</p>
          <div className="text-muted-foreground text-xs">
            <div>Limit: {limit} submissions</div>
            <div>Remaining: {remaining}</div>
            <div>Resets at: {resetTime}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
