import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui/loader";
import { Alert } from "@/components/ui/alert";
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

// Simple code block component (no syntax highlighting)
function CodeBlock({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  return (
    <pre
      className={`rounded bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono ${className}`}
      style={{ fontFamily: "var(--font-mono, monospace)" }}
    >
      {code}
    </pre>
  );
}

// Component to format and display webhook payload
function PayloadViewer({ payload }: { payload: any }) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  // Parse payload if it's a string
  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      parsedPayload = payload;
    }
  }

  // Try to extract event from various possible locations
  function getEventName(payload: any): string | undefined {
    // 1. Direct event property
    if (payload.event) return payload.event;
    // 2. Discord-style: embeds[0].title or embeds[0].description
    if (Array.isArray(payload.embeds) && payload.embeds.length > 0) {
      // Try title or description as event
      if (payload.embeds[0].title) return payload.embeds[0].title;
      if (payload.embeds[0].description) return payload.embeds[0].description;
    }
    // 3. Fallback: undefined
    return undefined;
  }

  // Format form fields for display
  function formatFormFields(fields: any[]) {
    if (!Array.isArray(fields)) return null;

    return (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="border rounded-md p-3 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">
                {field.label || field.id}
              </span>
              {field.type && (
                <Badge variant="outline" className="text-xs">
                  {field.type}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatValue(field.value)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Format individual values
  function formatValue(value: any): string {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (Array.isArray(value)) {
      // If array of objects, show as JSON, else join
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
      // Show as JSON string, but compact for single-line objects
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return "[Complex Object]";
      }
    }
    return String(value);
  }

  // Helper: get additional data keys (excluding known ones)
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
    // Try to extract event name
    const eventName = getEventName(parsedPayload);

    return (
      <div className="space-y-4">
        {/* Event Information */}
        <div className="border rounded-md p-4">
          <h4 className="font-semibold mb-3 text-sm">Event Information</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event:</span>
              <span className="flex items-center justify-center gap-1.5 rounded-[calc(var(--radius)-4px)] border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring shadow-sm/2 h-6 px-2.5">
                {eventName || "Unknown"}
              </span>
            </div>
            {parsedPayload.formId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Form ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
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
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {parsedPayload.submissionId}
                </code>
              </div>
            )}
            {parsedPayload.ipAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {parsedPayload.ipAddress}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        {parsedPayload.fields && (
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-3 text-sm">Form Fields</h4>
            {formatFormFields(parsedPayload.fields)}
          </div>
        )}

        {/* Raw Form Data */}
        {parsedPayload.rawData && (
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-3 text-sm">Raw Form Data</h4>
            <div className="space-y-2">
              {Object.entries(parsedPayload.rawData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-start gap-2"
                >
                  <span className="text-muted-foreground text-sm font-medium min-w-0 flex-shrink-0">
                    {key}:
                  </span>
                  <span className="text-sm text-right break-words">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Data */}
        {getAdditionalDataKeys(parsedPayload).length > 0 && (
          <div className="border rounded-md p-4">
            <h4 className="font-semibold mb-3 text-sm">Additional Data</h4>
            <div className="space-y-2">
              {getAdditionalDataKeys(parsedPayload).map((key) => {
                const value = parsedPayload[key];
                // For objects/arrays, show as pretty JSON, else as string
                let displayValue: React.ReactNode;
                if (typeof value === "object" && value !== null) {
                  displayValue = (
                    <CodeBlock
                      code={JSON.stringify(value, null, 2)}
                      className="text-xs bg-muted rounded p-2 overflow-x-auto whitespace-pre-wrap max-w-full"
                    />
                  );
                } else {
                  displayValue = (
                    <span className="text-sm text-right break-words">
                      {formatValue(value)}
                    </span>
                  );
                }
                return (
                  <div
                    key={key}
                    className="flex flex-col items-start justify-center gap-2"
                  >
                    <span className="text-muted-foreground text-sm font-medium min-w-0 flex-shrink-0">
                      {key}:
                    </span>
                    <div className="flex-1 min-w-0">{displayValue}</div>
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
        code={JSON.stringify(parsedPayload, null, 2)}
        className="bg-muted rounded p-4 text-xs overflow-x-auto whitespace-pre-wrap"
      />
    );
  }

  // Use new Tabs API: items + controlled value
  const tabItems = [
    { id: "formatted", label: "Formatted" },
    { id: "raw", label: "Raw JSON" },
  ];

  return (
    <div className="space-y-4">
      <Tabs
        items={tabItems}
        value={viewMode}
        onValueChange={(value) => setViewMode(value as "formatted" | "raw")}
        className="w-full"
      />
      <TabsContent value="formatted" activeValue={viewMode} className="mt-4">
        <FormattedView />
      </TabsContent>
      <TabsContent value="raw" activeValue={viewMode} className="mt-4">
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
    if (!open || !webhookId) return;
    fetchLogs();
    // eslint-disable-next-line
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
    } catch (e) {
      // Optionally show error
    }
  }

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-w-lg w-full">
        <DrawerHeader>
          <DrawerTitle>Webhook Delivery Logs</DrawerTitle>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        <div className="px-4 pb-4 flex flex-col gap-4 h-[100vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader size="lg" />
              <span className="mt-4 text-muted-foreground">
                Loading logs...
              </span>
            </div>
          ) : error ? (
            <Alert variant="destructive" title="Error">
              {error}
            </Alert>
          ) : !logs.length ? (
            <Alert variant="info" title="No Logs">
              No webhook delivery logs found for this webhook.
            </Alert>
          ) : (
            <ScrollArea className="flex-1 pr-2">
              <ul className="space-y-4">
                {logs.map((log) => (
                  <li key={log.id}>
                    <Card className="shadow-sm border">
                      <CardContent className="py-4 px-4 flex flex-col gap-2">
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
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            Attempt {log.attempt + 1}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>Event: {log.event}</span>
                          {typeof log.response_status !== "undefined" && (
                            <span>Response: {log.response_status}</span>
                          )}
                        </div>
                        {log.response_body && (
                          <div className="text-xs text-muted-foreground truncate">
                            <span className="font-medium">Response Body:</span>{" "}
                            {log.response_body}
                          </div>
                        )}
                        {log.error && (
                          <Alert variant="destructive" className="mt-2">
                            <span className="text-xs">Error: {log.error}</span>
                          </Alert>
                        )}
                        <div className="flex gap-2 mt-2">
                          {log.status === "failed" && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleResend(log)}
                            >
                              Resend
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewPayload(log.request_payload)}
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
          )}
        </div>
        {/* Enhanced Payload Modal */}
        {viewPayload && (
          <Drawer
            open={!!viewPayload}
            onOpenChange={() => setViewPayload(null)}
            direction="right"
          >
            <DrawerContent className="max-w-2xl w-full">
              <DrawerHeader>
                <DrawerTitle>Webhook Payload</DrawerTitle>
                <DrawerCloseButton onClick={() => setViewPayload(null)} />
              </DrawerHeader>
              <div className="px-4 pb-4 h-[100vh] overflow-hidden">
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
