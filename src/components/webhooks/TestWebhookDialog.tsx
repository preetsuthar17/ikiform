import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WebhookConfig } from "./hooks/useWebhookManagement";

interface TestWebhookDialogProps {
  webhook: WebhookConfig | null;
  open: boolean;
  onClose: () => void;
}

export function TestWebhookDialog({
  webhook,
  open,
  onClose,
}: TestWebhookDialogProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!webhook) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/webhook/${webhook.id}/test`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setTestResult({
          success: true,
          message: data.message || "Test sent successfully!",
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Test failed",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Test failed - Network error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClose = () => {
    setTestResult(null);
    setIsTesting(false);
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="rounded-4xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Test Webhook</DialogTitle>
          <DialogDescription>
            Send a test request to verify your webhook configuration
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Webhook Info */}
          <div className="flex flex-col gap-2 rounded-2xl border bg-accent p-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">URL:</span>
              <span className="break-all font-mono text-muted-foreground text-sm">
                {webhook.url}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Method:</span>
              <Badge className="font-mono" size="sm">
                {webhook.method}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Events:</span>
              <div className="flex gap-1">
                {webhook.events.map((event) => (
                  <Badge key={event} size="sm" variant="secondary">
                    {event}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`rounded-2xl border p-4 ${
                testResult.success
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`font-medium text-sm ${
                    testResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {testResult.success ? "Success!" : "Failed"}
                </span>
              </div>
              <p
                className={`mt-1 text-sm ${
                  testResult.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {testResult.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              disabled={isTesting}
              onClick={handleClose}
              variant="outline"
            >
              Close
            </Button>
            <Button
              disabled={isTesting}
              loading={isTesting}
              onClick={handleTest}
            >
              {isTesting ? <>Testing...</> : "Send Test"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
