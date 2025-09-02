import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatTimeRemaining } from "@/lib/forms/duplicate-prevention";

interface DuplicateSubmissionErrorProps {
  message: string;
  timeRemaining?: number;
  attemptsRemaining?: number;
  onRetry?: () => void;
}

export function DuplicateSubmissionError({
  message,
  timeRemaining,
  attemptsRemaining,
  onRetry,
}: DuplicateSubmissionErrorProps) {
  return (
    <Alert
      className="flex items-start gap-4 bg-red-100/40"
      variant="destructive"
    >
      <div className="flex w-full flex-col gap-2">
        <span className="flex items-center gap-2 font-semibold text-base">
          {" "}
          <AlertCircle aria-hidden className="h-5 w-5 text-destructive" />{" "}
          You’ve already submitted this form
        </span>
        <span className="text-destructive text-sm">{message}</span>
        {!!timeRemaining && timeRemaining > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Clock aria-hidden className="h-4 w-4" />
            <span>Wait {formatTimeRemaining(timeRemaining)} to try again</span>
          </div>
        )}
        {attemptsRemaining !== undefined && attemptsRemaining > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <RefreshCw aria-hidden className="h-4 w-4" />
            <span>
              {attemptsRemaining} more attempt{attemptsRemaining > 1 ? "s" : ""}{" "}
              allowed
            </span>
          </div>
        )}
        {onRetry && (
          <Button
            className="w-fit"
            onClick={onRetry}
            size="sm"
            variant="secondary"
          >
            Try Again
          </Button>
        )}
      </div>
    </Alert>
  );
}
