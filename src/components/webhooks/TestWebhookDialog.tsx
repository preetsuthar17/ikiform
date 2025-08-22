import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import type { WebhookConfig } from './hooks/useWebhookManagement';

interface TestWebhookDialogProps {
  webhook: WebhookConfig | null;
  open: boolean;
  onClose: () => void;
}

export function TestWebhookDialog({ webhook, open, onClose }: TestWebhookDialogProps) {
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
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok) {
        setTestResult({
          success: true,
          message: data.message || 'Test sent successfully!',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Test failed',
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed - Network error',
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-4xl">
        <DialogHeader>
          <DialogTitle>Test Webhook</DialogTitle>
          <DialogDescription>
            Send a test request to verify your webhook configuration
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Webhook Info */}
          <div className="rounded-2xl bg-accent border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">URL:</span>
              <span className="break-all text-sm text-muted-foreground font-mono">
                {webhook.url}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Method:</span>
              <Badge size="sm" className="font-mono">
                {webhook.method}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Events:</span>
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
            <div className={`rounded-2xl border p-4 ${
              testResult.success 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? 'Success!' : 'Failed'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isTesting}
            >
              Close
            </Button>
            <Button
              onClick={handleTest}
              disabled={isTesting}
              loading={isTesting}
            >
              {isTesting ? (
                <>
                  Testing...
                </>
              ) : (
                'Send Test'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
