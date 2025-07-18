import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface WebhookFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (webhook: any) => void;
  initialWebhook?: {
    id?: string;
    url: string;
    events: string[];
    method: "POST" | "PUT";
    headers: Record<string, string>;
    payloadTemplate: string;
    enabled: boolean;
  };
  loading?: boolean;
}

const EVENT_OPTIONS = [{ value: "form_submitted", label: "Form Submitted" }];

const DISCORD_WEBHOOK_EXAMPLE =
  "https://discord.com/api/webhooks/XXXXXXXXX/YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";

export function WebhookFormModal({
  open,
  onClose,
  onSave,
  initialWebhook,
  loading,
}: WebhookFormModalProps) {
  const [url, setUrl] = useState(initialWebhook?.url || "");
  const [events, setEvents] = useState<string[]>(initialWebhook?.events || []);
  const [method, setMethod] = useState<"POST" | "PUT">(
    initialWebhook?.method || "POST",
  );
  const [headers, setHeaders] = useState<Record<string, string>>(
    initialWebhook?.headers || {},
  );
  const [payloadTemplate, setPayloadTemplate] = useState(
    initialWebhook?.payloadTemplate || "",
  );
  const [enabled, setEnabled] = useState(initialWebhook?.enabled ?? true);
  const [showDiscordInfo, setShowDiscordInfo] = useState(false);
  // Removed showSlackInfo and showZapierInfo state

  useEffect(() => {
    setUrl(initialWebhook?.url || "");
    setEvents(initialWebhook?.events || []);
    setMethod(initialWebhook?.method || "POST");
    setHeaders(initialWebhook?.headers || {});
    setPayloadTemplate(initialWebhook?.payloadTemplate || "");
    setEnabled(initialWebhook?.enabled ?? true);
    setShowDiscordInfo(false);
    // Removed showSlackInfo and showZapierInfo reset
  }, [initialWebhook, open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validation: url, events (non-empty array), method
    if (!url || !Array.isArray(events) || events.length === 0 || !method) {
      alert(
        "Please provide a webhook URL, select at least one event, and choose a method.",
      );
      return;
    }
    onSave({ url, events, method, headers, payloadTemplate, enabled });
  }

  function handleClose() {
    onClose();
    setUrl("");
    setEvents([]);
    setMethod("POST");
    setHeaders({});
    setPayloadTemplate("");
    setEnabled(true);
    setShowDiscordInfo(false);
  }

  function handleDiscordPreset() {
    setUrl(DISCORD_WEBHOOK_EXAMPLE);
    setMethod("POST");
    setShowDiscordInfo(true);
  }

  return (
    <Modal open={open} onOpenChange={open ? handleClose : undefined}>
      <ModalContent className="max-w-7xl w-full">
        <ModalHeader className="flex flex-row items-center justify-between pb-2">
          <ModalTitle>
            {initialWebhook ? "Edit Webhook" : "Add Webhook"}
          </ModalTitle>
        </ModalHeader>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDiscordPreset}
          >
            Discord Preset
          </Button>
          {/* Only Discord preset remains */}
        </div>
        {showDiscordInfo && (
          <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-900 text-sm">
            <b>Discord Webhook detected!</b> This webhook will send a Discord
            embed for each form submission.
            <br />
            <span className="text-xs">
              You can copy your Discord webhook URL from your Discord server’s
              Integrations &rarr; Webhooks settings.
            </span>
            <div className="mt-2 text-xs text-blue-700">
              <b>Embed Example:</b>
              <pre className="bg-blue-100 rounded p-2 overflow-x-auto mt-1">
                {`{
  "content": "New submission for form: [formId]",
  "embeds": [
    {
      "title": "Form Submission",
      "fields": [
        { "name": "Name", "value": "John Doe" },
        { "name": "Email", "value": "john@example.com" }
      ]
    }
  ]
}`}
              </pre>
            </div>
          </div>
        )}
        {/* Removed Slack and Zapier info sections */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-1" htmlFor="webhook-url">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              required
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="webhook-events">
              Events
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EVENT_OPTIONS.map((opt) => (
                <Toggle
                  key={opt.value}
                  pressed={events.includes(opt.value)}
                  onPressedChange={(pressed) => {
                    setEvents((prev) =>
                      pressed
                        ? [...prev, opt.value]
                        : prev.filter((e) => e !== opt.value),
                    );
                  }}
                  aria-pressed={events.includes(opt.value)}
                >
                  {opt.label}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="mb-1" htmlFor="webhook-method">
                HTTP Method
              </Label>
              <Select
                value={method}
                onValueChange={(val) => setMethod(val as "POST" | "PUT")}
              >
                <SelectTrigger id="webhook-method" placeholder="Select method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex items-end">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={(checked) => setEnabled(!!checked)}
                />
                <span className="text-sm">Enabled</span>
              </Label>
            </div>
          </div>
          <div>
            <Label className="mb-1" htmlFor="webhook-headers">
              Headers (key:value, comma separated)
            </Label>
            <Input
              id="webhook-headers"
              type="text"
              value={Object.entries(headers)
                .map(([k, v]) => `${k}:${v}`)
                .join(", ")}
              onChange={(e) => {
                const entries = e.target.value
                  .split(",")
                  .map((pair) => pair.split(":").map((s) => s.trim()));
                setHeaders(
                  Object.fromEntries(entries.filter(([k, v]) => k && v)),
                );
              }}
              placeholder="Authorization: Bearer token, X-Custom: value"
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="webhook-payload">
              Payload Template (optional)
            </Label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-w-[250px]">
                <Textarea
                  id="webhook-payload"
                  className="font-mono min-h-[120px]"
                  rows={6}
                  value={payloadTemplate}
                  onChange={(e) => setPayloadTemplate(e.target.value)}
                  placeholder='{"event": "{{event}}", "formId": "{{formId}}", "fields": {{formatted.fields}} }'
                />
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="font-semibold">Available variables:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">event</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        The event type (e.g. form_submitted)
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">formId</Badge>
                      </TooltipTrigger>
                      <TooltipContent>The form ID</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">submissionId</Badge>
                      </TooltipTrigger>
                      <TooltipContent>The submission ID</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">ipAddress</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        The IP address of the submitter
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">formatted</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {
                          "The formatted object with formName, formId, fields (array of {id, label, type, value}), and rawData"
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Use{" "}
                  <code className="bg-muted px-1 rounded">
                    &#123;&#123;variable&#125;&#125;
                  </code>{" "}
                  to insert a variable. For example:{" "}
                  <code className="bg-muted px-1 rounded">
                    &#123;&#123;formatted.formName&#125;&#125;
                  </code>
                </div>
                <Alert className="mt-2" variant="default">
                  <b>Tip:</b> You can use{" "}
                  <code className="bg-muted px-1 rounded">
                    &#123;&#123;#each formatted.fields&#125;&#125;
                  </code>{" "}
                  in advanced templates to loop over fields. See docs for more.
                </Alert>
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label className="mb-1">Live Preview</Label>
                <div className="bg-muted/50 border p-2 min-h-[120px]">
                  <div className="p-0">
                    <ScrollArea className="max-h-48">
                      <pre className="text-xs font-mono whitespace-pre-wrap break-words text-foreground">
                        {(() => {
                          try {
                            // Fake preview context
                            const previewContext = {
                              event: "form_submitted",
                              formId: "form-123",
                              submissionId: "sub-456",
                              ipAddress: "1.2.3.4",
                              formatted: {
                                formId: "form-123",
                                formName: "Demo Form",
                                fields: [
                                  {
                                    id: "field_1",
                                    label: "Name",
                                    type: "text",
                                    value: "John Doe",
                                  },
                                  {
                                    id: "field_2",
                                    label: "Email",
                                    type: "email",
                                    value: "john@example.com",
                                  },
                                ],
                                rawData: {
                                  field_1: "John Doe",
                                  field_2: "john@example.com",
                                },
                              },
                            };
                            // Simple mustache-like replacement for preview
                            let preview =
                              payloadTemplate ||
                              '{"event": "{{event}}", "formId": "{{formId}}", "fields": {{formatted.fields}} }';
                            preview = preview.replace(
                              /{{\s*([\w.]+)\s*}}/g,
                              (_: string, key: string) => {
                                const keys = key.split(".");
                                let value: any = previewContext;
                                for (const k of keys) value = value?.[k];
                                if (typeof value === "object" && value !== null)
                                  return JSON.stringify(value, null, 2);
                                return value !== undefined ? String(value) : "";
                              },
                            );
                            return preview;
                          } catch {
                            return "Invalid template";
                          }
                        })()}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalFooter className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!url || !events.length || loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
