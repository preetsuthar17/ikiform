import clsx from "clsx";
import {
  Activity,
  AlertCircle,
  Check,
  CheckCircle,
  Copy,
  Eye,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebhookLog {
  id: string;
  webhook_id: string;
  event: string;
  status: "success" | "failed" | "pending";
  request_payload: any;
  response_status?: number;
  response_body?: string;
  error?: string;
  timestamp: string;
  attempt: number;
}

interface WebhookLogDrawerProps {
  webhookId: string | null;
  open: boolean;
  onClose: () => void;
}

function CodeBlock({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const [showCheck, setShowCheck] = useState(false);

  return (
    <div className="relative rounded-lg bg-muted font-mono">
      <Button
        aria-label="Copy code to clipboard"
        className="absolute top-2 right-2 size-8"
        onClick={async () => {
          await handleCopy();
          setShowCheck(true);
          setTimeout(() => setShowCheck(false), 1000);
        }}
        size="icon"
        tabIndex={0}
        variant="outline"
      >
        <span className="relative inline-flex size-4 items-center justify-center">
          <span
            aria-hidden={showCheck}
            className={clsx(
              "absolute transition-all duration-300",
              showCheck
                ? "scale-45 opacity-0 blur-sm"
                : "scale-100 opacity-100 blur-0"
            )}
          >
            <Copy className="size-4" />
          </span>
          <span
            aria-hidden={!showCheck}
            className={clsx(
              "absolute transition-all duration-300",
              showCheck
                ? "scale-120 opacity-100 blur-0"
                : "scale-100 opacity-0 blur-sm"
            )}
          >
            <Check className="size-4" />
          </span>
        </span>
      </Button>
      <pre
        className={`overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-xs ${className}`}
      >
        {code}
      </pre>
    </div>
  );
}

function PayloadViewer({ payload }: { payload: any }) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      parsedPayload = payload;
    }
  }

  // Handle empty or null payloads
  if (
    !parsedPayload ||
    (typeof parsedPayload === "object" &&
      Object.keys(parsedPayload).length === 0)
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Eye className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Payload Data</h3>
        <p className="max-w-md text-muted-foreground">
          This webhook delivery doesn't contain any payload data. This might be
          because:
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-muted-foreground text-sm">
          <li>
            • The webhook method doesn't support request bodies (GET, HEAD)
          </li>
          <li>• The payload was empty or null</li>
          <li>• There was an error during payload generation</li>
        </ul>
      </div>
    );
  }

  function getEventName(payload: any): string | undefined {
    if (payload.event) return payload.event;

    if (Array.isArray(payload.embeds) && payload.embeds.length > 0) {
      if (payload.embeds[0].title) return payload.embeds[0].title;
      if (payload.embeds[0].description) return payload.embeds[0].description;
    }

    return;
  }

  function formatFormFields(fields: any[]) {
    if (!Array.isArray(fields)) return null;

    return (
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div className="rounded-lg border bg-card p-3" key={index}>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-medium text-sm">
                {field.label || field.id}
              </span>
              {field.type && (
                <Badge className="text-xs" variant="outline">
                  {field.type}
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground text-sm">
              <span>{formatValue(field.value)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function formatValue(value: any): string {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        try {
          return JSON.stringify(value, null, 2);
        } catch {
          return "[Complex Array]";
        }
      }
      return value.join(", ");
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return "[Complex Object]";
      }
    }
    return String(value);
  }

  function getAdditionalDataKeys(payload: any) {
    const knownKeys = [
      "event",
      "formId",
      "formName",
      "submissionId",
      "ipAddress",
      "fields",
      "rawData",
    ];
    return Object.keys(payload).filter((key) => !knownKeys.includes(key));
  }

  function FormattedView() {
    const eventName = getEventName(parsedPayload);

    return (
      <div className="flex flex-col gap-6">
        {/* Event Information */}
        <div className="rounded-xl border bg-card p-4">
          <h4 className="mb-4 flex items-center gap-2 font-semibold text-sm">
            <Activity className="h-4 w-4" />
            Event Information
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Event:</span>
              <Badge className="font-mono" variant="secondary">
                {eventName || "Unknown"}
              </Badge>
            </div>
            {parsedPayload.formId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Form ID:</span>
                <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                  {parsedPayload.formId}
                </code>
              </div>
            )}
            {parsedPayload.formName && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Form Name:</span>
                <span className="font-medium">{parsedPayload.formName}</span>
              </div>
            )}
            {parsedPayload.submissionId && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submission ID:</span>
                <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                  {parsedPayload.submissionId}
                </code>
              </div>
            )}
            {parsedPayload.ipAddress && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                  {parsedPayload.ipAddress}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        {parsedPayload.fields && (
          <div className="rounded-xl border bg-card p-4">
            <h4 className="mb-4 font-semibold text-sm">Form Fields</h4>
            {formatFormFields(parsedPayload.fields)}
          </div>
        )}

        {/* Raw Form Data */}
        {parsedPayload.rawData && (
          <div className="rounded-xl border bg-card p-4">
            <h4 className="mb-4 font-semibold text-sm">Raw Form Data</h4>
            <div className="flex flex-col gap-3">
              {Object.entries(parsedPayload.rawData).map(([key, value]) => (
                <div
                  className="flex items-start justify-between gap-3 rounded-lg border bg-muted/50 p-3"
                  key={key}
                >
                  <span className="min-w-0 flex-shrink-0 font-medium text-muted-foreground text-sm">
                    {key}:
                  </span>
                  <span className="break-words text-right text-sm">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Data */}
        {getAdditionalDataKeys(parsedPayload).length > 0 && (
          <div className="rounded-xl border bg-card p-4">
            <h4 className="mb-4 font-semibold text-sm">Additional Data</h4>
            <div className="flex flex-col gap-3">
              {getAdditionalDataKeys(parsedPayload).map((key) => {
                const value = parsedPayload[key];

                let displayValue: React.ReactNode;
                if (typeof value === "object" && value !== null) {
                  displayValue = (
                    <CodeBlock
                      className="max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-3 text-xs"
                      code={JSON.stringify(value, null, 2)}
                    />
                  );
                } else {
                  displayValue = (
                    <span className="break-words text-right text-sm">
                      {formatValue(value)}
                    </span>
                  );
                }
                return (
                  <div
                    className="flex flex-col items-start justify-center gap-2 rounded-lg border bg-muted/50 p-3"
                    key={key}
                  >
                    <span className="min-w-0 flex-shrink-0 font-medium text-muted-foreground text-sm">
                      {key}:
                    </span>
                    <div className="min-w-0 flex-1 font-mono">
                      {displayValue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function RawView() {
    return (
      <CodeBlock
        className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-500 p-4 text-xs"
        code={JSON.stringify(parsedPayload, null, 2)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        onValueChange={(value) => setViewMode(value as "formatted" | "raw")}
        value={viewMode}
      >
        <TabsList>
          <TabsTrigger value="formatted">Formatted</TabsTrigger>
          <TabsTrigger value="raw">Raw JSON</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="formatted">
          <FormattedView />
        </TabsContent>
        <TabsContent className="mt-4" value="raw">
          <RawView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LogItem({
  log,
  onResend,
  onViewPayload,
}: {
  log: WebhookLog;
  onResend: (log: WebhookLog) => void;
  onViewPayload: (payload: any) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Measure height for expand/collapse animation
  useEffect(() => {
    if (expanded && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    } else {
      setContentHeight(0);
    }
  }, [expanded, log.id]);

  return (
    <div
      className={`group border bg-card ${expanded ? "rounded-lg shadow-xs" : "rounded-md"}`}
      style={{ transition: "border-radius 200ms, box-shadow 200ms" }}
    >
      <button
        className="flex w-full items-center gap-4 px-3 py-1.5 text-left hover:bg-accent/40"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        <div className="flex flex-1 items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center">
            <span className="text-muted-foreground text-xs tabular-nums">
              {formatTime(log.timestamp)}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 items-center">
            <Badge
              className="font-mono"
              variant={
                log.status === "success"
                  ? "default"
                  : log.status === "failed"
                    ? "destructive"
                    : "secondary"
              }
            >
              {log.response_status ?? log.status}
            </Badge>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 text-muted-foreground text-sm">
              Event:
            </span>
            <span className="truncate font-mono text-sm">{log.event}</span>
          </div>
          <div className="flex min-w-0 flex-1 items-center truncate text-muted-foreground text-xs">
            {log.error
              ? log.error
              : log.response_body
                ? String(log.response_body).slice(0, 80)
                : ""}
          </div>
        </div>
      </button>

      <div
        aria-hidden={!expanded}
        className={`overflow-hidden ${expanded ? "border-t" : ""}`}
        style={{
          transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          height: expanded ? (contentHeight ?? "auto") : 0,
        }}
      >
        <div className="px-3 py-3" ref={contentRef}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-muted-foreground text-xs">Status</span>
              <span className="text-sm">{log.status}</span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-muted-foreground text-xs">Response</span>
              <span className="text-sm">
                {typeof log.response_status === "number"
                  ? log.response_status
                  : "—"}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-muted-foreground text-xs">Attempt</span>
              <span className="text-sm">{(log.attempt ?? 0) + 1}</span>
            </div>
          </div>
          {log.error && (
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
              <span className="font-medium text-sm">
                {String(log.error).toUpperCase()}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2">
            {log.status === "failed" && (
              <Button
                className="flex items-center gap-2"
                onClick={() => onResend(log)}
                size="sm"
              >
                Resend
              </Button>
            )}
            <Button
              className="flex items-center gap-2"
              onClick={() => onViewPayload(log.request_payload)}
              size="sm"
              variant="outline"
            >
              View payload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebhookLogDialog({
  webhookId,
  open,
  onClose,
}: WebhookLogDrawerProps) {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewPayload, setViewPayload] = useState<any | null>(null);

  async function fetchLogs() {
    if (!webhookId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/webhook/logs?webhookId=${webhookId}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!(open && webhookId)) return;
    fetchLogs();
  }, [open, webhookId]);

  async function handleResend(log: WebhookLog) {
    if (!webhookId) return;
    try {
      const res = await fetch(`/api/webhook/${webhookId}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: log.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Webhook resent successfully");
      } else {
        toast.error(data.error || "Failed to resend webhook");
      }
      fetchLogs();
    } catch (e) {
      toast.error("Failed to resend webhook");
    }
  }

  const successCount = logs.filter((log) => log.status === "success").length;
  const failedCount = logs.filter((log) => log.status === "failed").length;
  const pendingCount = logs.filter((log) => log.status === "pending").length;

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="flex w-full max-w-5xl flex-col gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Webhook Delivery Logs
              </DialogTitle>
              {logs.length > 0 && (
                <div className="mt-2 flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{successCount} successful</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>{failedCount} failed</span>
                  </div>
                  {pendingCount > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                      <span>{pendingCount} pending</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <Alert title="Error" variant="destructive">
              {error}
            </Alert>
          ) : logs.length ? (
            <ScrollArea className="flex-1 pr-2">
              <div className="flex flex-col gap-2">
                {logs.map((log) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    onResend={handleResend}
                    onViewPayload={setViewPayload}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No Logs Found</h3>
              <p className="text-muted-foreground">
                No webhook delivery logs found for this webhook.
              </p>
            </div>
          )}
        </div>

        {/* Payload Viewer Dialog */}
        {viewPayload && (
          <Dialog
            onOpenChange={() => setViewPayload(null)}
            open={!!viewPayload}
          >
            <DialogContent className="max-h-[80vh] w-full max-w-3xl overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Webhook Payload
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <PayloadViewer payload={viewPayload} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
