import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import type {
  WebhookConfig,
  WebhookMethod,
} from "./hooks/useWebhookManagement";

const EVENT_OPTIONS = [
  { label: "Form Submitted", value: "form_submitted" },
  { label: "Form Viewed", value: "form_viewed" },
  { label: "Form Started", value: "form_started" },
];

const HTTP_METHODS: {
  value: WebhookMethod;
  label: string;
  description: string;
}[] = [
  { value: "GET", label: "GET", description: "Retrieve data (no body)" },
  { value: "POST", label: "POST", description: "Create or submit data" },
  { value: "PUT", label: "PUT", description: "Update entire resource" },
  { value: "PATCH", label: "PATCH", description: "Update partial resource" },
  { value: "DELETE", label: "DELETE", description: "Remove resource" },
  { value: "HEAD", label: "HEAD", description: "Get headers only" },
];

const DISCORD_WEBHOOK_EXAMPLE = "";

export function WebhookFormModal({
  open,
  onClose,
  onSave,
  initialWebhook,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (webhook: Partial<WebhookConfig>) => void;
  initialWebhook?: WebhookConfig;
  loading?: boolean;
}) {
  const [url, setUrl] = useState(initialWebhook?.url || "");
  const [events, setEvents] = useState<string[]>(initialWebhook?.events || []);
  const [method, setMethod] = useState<WebhookMethod>(
    initialWebhook?.method || "POST"
  );
  const [headers, setHeaders] = useState<Record<string, string>>(
    initialWebhook?.headers || {}
  );
  const [payloadTemplate, setPayloadTemplate] = useState(
    initialWebhook?.payloadTemplate || ""
  );
  const [enabled, setEnabled] = useState(initialWebhook?.enabled ?? true);
  const [notificationEmail, setNotificationEmail] = useState(
    initialWebhook?.notificationEmail || ""
  );
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(
    initialWebhook?.notifyOnSuccess ?? false
  );
  const [notifyOnFailure, setNotifyOnFailure] = useState(
    initialWebhook?.notifyOnFailure ?? true
  );
  const [showDiscordInfo, setShowDiscordInfo] = useState(false);

  useEffect(() => {
    setUrl(initialWebhook?.url || "");
    setEvents(initialWebhook?.events || []);
    setMethod(initialWebhook?.method || "POST");
    setHeaders(initialWebhook?.headers || {});
    setPayloadTemplate(initialWebhook?.payloadTemplate || "");
    setEnabled(initialWebhook?.enabled ?? true);
    setNotificationEmail(initialWebhook?.notificationEmail || "");
    setNotifyOnSuccess(initialWebhook?.notifyOnSuccess ?? false);
    setNotifyOnFailure(initialWebhook?.notifyOnFailure ?? true);
    setShowDiscordInfo(false);
  }, [initialWebhook, open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!(url && Array.isArray(events)) || events.length === 0 || !method) {
      alert(
        "Please provide a webhook URL, select at least one event, and choose a method."
      );
      return;
    }
    onSave({
      url,
      events,
      method,
      headers,
      payloadTemplate,
      enabled,
      notificationEmail: notificationEmail || undefined,
      notifyOnSuccess,
      notifyOnFailure,
    });
  }

  function handleClose() {
    onClose();
    setUrl("");
    setEvents([]);
    setMethod("POST");
    setHeaders({});
    setPayloadTemplate("");
    setEnabled(true);
    setNotificationEmail("");
    setNotifyOnSuccess(false);
    setNotifyOnFailure(true);
    setShowDiscordInfo(false);
  }

  function handleDiscordPreset() {
    setUrl(DISCORD_WEBHOOK_EXAMPLE);
    setMethod("POST");
    setShowDiscordInfo(true);
  }

  return (
    <Modal onOpenChange={open ? handleClose : undefined} open={open}>
      <ModalContent className="w-full max-w-7xl">
        <ModalHeader className="flex flex-row items-center justify-between pb-2">
          <ModalTitle>
            {initialWebhook ? "Edit Webhook" : "Add Webhook"}
          </ModalTitle>
        </ModalHeader>
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            onClick={handleDiscordPreset}
            size="sm"
            type="button"
            variant="outline"
          >
            Discord Preset
          </Button>
          {}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1" htmlFor="notification-email">
              Notification Email (optional)
            </Label>
            <Input
              id="notification-email"
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              value={notificationEmail}
            />
          </div>
          <div className="flex items-end gap-4">
            <Label className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={notifyOnSuccess}
                onCheckedChange={(checked) => setNotifyOnSuccess(!!checked)}
              />
              <span className="text-sm">Email on success</span>
            </Label>
            <Label className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={notifyOnFailure}
                onCheckedChange={(checked) => setNotifyOnFailure(!!checked)}
              />
              <span className="text-sm">Email on failure</span>
            </Label>
          </div>
        </div>
        {showDiscordInfo && (
          <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm">
            <b>Discord Webhook detected!</b> This webhook will send a Discord
            embed for each form submission.
            <br />
            <span className="text-xs">
              You can copy your Discord webhook URL from your Discord server's
              Integrations &rarr; Webhooks settings.
            </span>
            <div className="mt-2 text-blue-700 text-xs">
              <b>Embed Example:</b>
              <pre className="mt-1 overflow-x-auto rounded bg-blue-100 p-2">
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
        {}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-1" htmlFor="webhook-url">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              required
              type="url"
              value={url}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="webhook-events">
              Events
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVENT_OPTIONS.map((opt) => (
                <Toggle
                  aria-pressed={events.includes(opt.value)}
                  key={opt.value}
                  onPressedChange={(pressed) => {
                    setEvents((prev) =>
                      pressed
                        ? [...prev, opt.value]
                        : prev.filter((e) => e !== opt.value)
                    );
                  }}
                  pressed={events.includes(opt.value)}
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
                onValueChange={(val) => setMethod(val as WebhookMethod)}
                value={method}
              >
                <SelectTrigger
                  className="text-left"
                  id="webhook-method"
                  placeholder="Select method"
                >
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>

                <SelectContent>
                  {HTTP_METHODS.map((httpMethod) => (
                    <SelectItem key={httpMethod.value} value={httpMethod.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{httpMethod.label}</span>
                        <span className="text-muted-foreground text-xs">
                          {httpMethod.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 items-end">
              <Label className="flex cursor-pointer items-center gap-2">
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
              onChange={(e) => {
                const entries = e.target.value
                  .split(",")
                  .map((pair) => pair.split(":").map((s) => s.trim()));
                setHeaders(
                  Object.fromEntries(entries.filter(([k, v]) => k && v))
                );
              }}
              placeholder="Authorization: Bearer token, X-Custom: value"
              type="text"
              value={Object.entries(headers)
                .map(([k, v]) => `${k}:${v}`)
                .join(", ")}
            />
          </div>
          <div>
            <Label className="mb-1" htmlFor="webhook-payload">
              Payload Template (optional)
            </Label>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="min-w-[250px] flex-1">
                <Textarea
                  className="min-h-[120px] font-mono"
                  id="webhook-payload"
                  onChange={(e) => setPayloadTemplate(e.target.value)}
                  placeholder='{"event": "{{event}}", "formId": "{{formId}}", "fields": {{formatted.fields}} }'
                  value={payloadTemplate}
                />
              </div>
              <div className="min-w-[250px] flex-1">
                <div className="rounded border p-3 text-sm">
                  <b>Available Variables:</b>
                  <ul className="flex flex-col gap-1 text-xs">
                    <li>
                      <code>{"{{event}}"}</code> - Event type (e.g.,
                      form_submitted)
                    </li>
                    <li>
                      <code>{"{{formId}}"}</code> - Form ID
                    </li>
                    <li>
                      <code>{"{{formData}}"}</code> - Raw form data
                    </li>
                    <li>
                      <code>{"{{formatted}}"}</code> - Human-friendly formatted
                      data
                    </li>
                    <li>
                      <code>{"{{timestamp}}"}</code> - ISO timestamp
                    </li>
                    <li>
                      <code>{"{{submissionId}}"}</code> - Submission ID
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} loading={loading} type="submit">
              {initialWebhook ? "Update" : "Create"} Webhook
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
