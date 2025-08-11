import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Loader } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
  return (
    <pre
      className={`overflow-x-auto whitespace-pre-wrap rounded bg-muted p-4 font-mono text-xs ${className}`}
      style={{ fontFamily: "var(--font-mono, monospace)" }}
    >
      {code}
    </pre>
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
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div className="rounded-md border bg-muted/50 p-3" key={index}>
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
      <div className="space-y-4">
        {}
        <div className="rounded-md border p-4">
          <h4 className="mb-3 font-semibold text-sm">Event Information</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event:</span>
              <span className="flex h-6 items-center justify-center gap-1.5 rounded-[calc(var(--radius)-4px)] border border-border px-2.5 font-medium text-foreground text-xs shadow-sm/2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                {eventName || "Unknown"}
              </span>
            </div>
            {parsedPayload.formId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Form ID:</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {parsedPayload.formId}
                </code>
              </div>
            )}
            {parsedPayload.formName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Form Name:</span>
                <span className="font-medium">{parsedPayload.formName}</span>
              </div>
            )}
            {parsedPayload.submissionId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submission ID:</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {parsedPayload.submissionId}
                </code>
              </div>
            )}
            {parsedPayload.ipAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">
                  {parsedPayload.ipAddress}
                </code>
              </div>
            )}
          </div>
        </div>

        {}
        {parsedPayload.fields && (
          <div className="rounded-md border p-4">
            <h4 className="mb-3 font-semibold text-sm">Form Fields</h4>
            {formatFormFields(parsedPayload.fields)}
          </div>
        )}

        {}
        {parsedPayload.rawData && (
          <div className="rounded-md border p-4">
            <h4 className="mb-3 font-semibold text-sm">Raw Form Data</h4>
            <div className="space-y-2">
              {Object.entries(parsedPayload.rawData).map(([key, value]) => (
                <div
                  className="flex items-start justify-between gap-2"
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

        {}
        {getAdditionalDataKeys(parsedPayload).length > 0 && (
          <div className="rounded-md border p-4">
            <h4 className="mb-3 font-semibold text-sm">Additional Data</h4>
            <div className="space-y-2">
              {getAdditionalDataKeys(parsedPayload).map((key) => {
                const value = parsedPayload[key];

                let displayValue: React.ReactNode;
                if (typeof value === "object" && value !== null) {
                  displayValue = (
                    <CodeBlock
                      className="max-w-full overflow-x-auto whitespace-pre-wrap rounded bg-muted p-2 text-xs"
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
                    className="flex flex-col items-start justify-center gap-2"
                    key={key}
                  >
                    <span className="min-w-0 flex-shrink-0 font-medium text-muted-foreground text-sm">
                      {key}:
                    </span>
                    <div className="min-w-0 flex-1">{displayValue}</div>
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
        className="overflow-x-auto whitespace-pre-wrap rounded bg-muted p-4 text-xs"
        code={JSON.stringify(parsedPayload, null, 2)}
      />
    );
  }

  const tabItems = [
    { id: "formatted", label: "Formatted" },
    { id: "raw", label: "Raw JSON" },
  ];

  return (
    <div className="space-y-4">
      <Tabs
        className="w-full"
        items={tabItems}
        onValueChange={(value) => setViewMode(value as "formatted" | "raw")}
        value={viewMode}
      />
      <TabsContent activeValue={viewMode} className="mt-4" value="formatted">
        <FormattedView />
      </TabsContent>
      <TabsContent activeValue={viewMode} className="mt-4" value="raw">
        <RawView />
      </TabsContent>
    </div>
  );
}

export function WebhookLogDrawer({
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
      fetchLogs();
    } catch (e) {}
  }

  return (
    <Drawer direction="right" onOpenChange={onClose} open={open}>
      <DrawerContent className="w-full max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Webhook Delivery Logs</DrawerTitle>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        <div className="flex h-[100vh] flex-col gap-4 px-4 pb-4">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Loader size="lg" />
              <span className="mt-4 text-muted-foreground">
                Loading logs...
              </span>
            </div>
          ) : error ? (
            <Alert title="Error" variant="destructive">
              {error}
            </Alert>
          ) : logs.length ? (
            <ScrollArea className="flex-1 pr-2">
              <ul className="space-y-4">
                {logs.map((log) => (
                  <li key={log.id}>
                    <Card className="border shadow-sm">
                      <CardContent className="flex flex-col gap-2 px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            size="sm"
                            variant={
                              log.status === "success"
                                ? "default"
                                : log.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {log.status.toUpperCase()}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="ml-auto text-muted-foreground text-xs">
                            Attempt {log.attempt + 1}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
                          <span>Event: {log.event}</span>
                          {typeof log.response_status !== "undefined" && (
                            <span>Response: {log.response_status}</span>
                          )}
                        </div>
                        {log.response_body && (
                          <div className="truncate text-muted-foreground text-xs">
                            <span className="font-medium">Response Body:</span>{" "}
                            {log.response_body}
                          </div>
                        )}
                        {log.error && (
                          <Alert className="mt-2" variant="destructive">
                            <span className="text-xs">Error: {log.error}</span>
                          </Alert>
                        )}
                        <div className="mt-2 flex gap-2">
                          {log.status === "failed" && (
                            <Button
                              onClick={() => handleResend(log)}
                              size="sm"
                              variant="default"
                            >
                              Resend
                            </Button>
                          )}
                          <Button
                            onClick={() => setViewPayload(log.request_payload)}
                            size="sm"
                            variant="outline"
                          >
                            View Payload
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <Alert title="No Logs" variant="info">
              No webhook delivery logs found for this webhook.
            </Alert>
          )}
        </div>
        {}
        {viewPayload && (
          <Drawer
            direction="right"
            onOpenChange={() => setViewPayload(null)}
            open={!!viewPayload}
          >
            <DrawerContent className="w-full max-w-2xl">
              <DrawerHeader>
                <DrawerTitle>Webhook Payload</DrawerTitle>
                <DrawerCloseButton onClick={() => setViewPayload(null)} />
              </DrawerHeader>
              <div className="h-[100vh] overflow-hidden px-4 pb-4">
                <ScrollArea className="h-full">
                  <PayloadViewer payload={viewPayload} />
                </ScrollArea>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </DrawerContent>
    </Drawer>
  );
}
