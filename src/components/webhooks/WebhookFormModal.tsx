import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WebhookFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (webhook: any) => void;
  initialWebhook?: {
    id?: string;
    url: string;
    events: string[];
    method: 'POST' | 'PUT';
    headers: Record<string, string>;
    payloadTemplate: string;
    enabled: boolean;
  };
  loading?: boolean;
}

const EVENT_OPTIONS = [{ value: 'form_submitted', label: 'Form Submitted' }];

const DISCORD_WEBHOOK_EXAMPLE =
  'https://discord.com/api/webhooks/XXXXXXXXX/YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY';

export function WebhookFormModal({
  open,
  onClose,
  onSave,
  initialWebhook,
  loading,
}: WebhookFormModalProps) {
  const [url, setUrl] = useState(initialWebhook?.url || '');
  const [events, setEvents] = useState<string[]>(initialWebhook?.events || []);
  const [method, setMethod] = useState<'POST' | 'PUT'>(
    initialWebhook?.method || 'POST'
  );
  const [headers, setHeaders] = useState<Record<string, string>>(
    initialWebhook?.headers || {}
  );
  const [payloadTemplate, setPayloadTemplate] = useState(
    initialWebhook?.payloadTemplate || ''
  );
  const [enabled, setEnabled] = useState(initialWebhook?.enabled ?? true);
  const [showDiscordInfo, setShowDiscordInfo] = useState(false);

  useEffect(() => {
    setUrl(initialWebhook?.url || '');
    setEvents(initialWebhook?.events || []);
    setMethod(initialWebhook?.method || 'POST');
    setHeaders(initialWebhook?.headers || {});
    setPayloadTemplate(initialWebhook?.payloadTemplate || '');
    setEnabled(initialWebhook?.enabled ?? true);
    setShowDiscordInfo(false);
  }, [initialWebhook, open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!(url && Array.isArray(events)) || events.length === 0 || !method) {
      alert(
        'Please provide a webhook URL, select at least one event, and choose a method.'
      );
      return;
    }
    onSave({ url, events, method, headers, payloadTemplate, enabled });
  }

  function handleClose() {
    onClose();
    setUrl('');
    setEvents([]);
    setMethod('POST');
    setHeaders({});
    setPayloadTemplate('');
    setEnabled(true);
    setShowDiscordInfo(false);
  }

  function handleDiscordPreset() {
    setUrl(DISCORD_WEBHOOK_EXAMPLE);
    setMethod('POST');
    setShowDiscordInfo(true);
  }

  return (
    <Modal onOpenChange={open ? handleClose : undefined} open={open}>
      <ModalContent className="w-full max-w-7xl">
        <ModalHeader className="flex flex-row items-center justify-between pb-2">
          <ModalTitle>
            {initialWebhook ? 'Edit Webhook' : 'Add Webhook'}
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
        {showDiscordInfo && (
          <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3 text-blue-900 text-sm">
            <b>Discord Webhook detected!</b> This webhook will send a Discord
            embed for each form submission.
            <br />
            <span className="text-xs">
              You can copy your Discord webhook URL from your Discord server’s
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
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                onValueChange={(val) => setMethod(val as 'POST' | 'PUT')}
                value={method}
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
                  .split(',')
                  .map((pair) => pair.split(':').map((s) => s.trim()));
                setHeaders(
                  Object.fromEntries(entries.filter(([k, v]) => k && v))
                );
              }}
              placeholder="Authorization: Bearer token, X-Custom: value"
              type="text"
              value={Object.entries(headers)
                .map(([k, v]) => `${k}:${v}`)
                .join(', ')}
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
                  rows={6}
                  value={payloadTemplate}
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
                          'The formatted object with formName, formId, fields (array of {id, label, type, value}), and rawData'
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mt-2 text-muted-foreground text-xs">
                  Use{' '}
                  <code className="rounded bg-muted px-1">
                    &#123;&#123;variable&#125;&#125;
                  </code>{' '}
                  to insert a variable. For example:{' '}
                  <code className="rounded bg-muted px-1">
                    &#123;&#123;formatted.formName&#125;&#125;
                  </code>
                </div>
                <Alert className="mt-2" variant="default">
                  <b>Tip:</b> You can use{' '}
                  <code className="rounded bg-muted px-1">
                    &#123;&#123;#each formatted.fields&#125;&#125;
                  </code>{' '}
                  in advanced templates to loop over fields. See docs for more.
                </Alert>
              </div>
              <div className="min-w-[250px] flex-1">
                <Label className="mb-1">Live Preview</Label>
                <div className="min-h-[120px] border bg-muted/50 p-2">
                  <div className="p-0">
                    <ScrollArea className="max-h-48">
                      <pre className="whitespace-pre-wrap break-words font-mono text-foreground text-xs">
                        {(() => {
                          try {
                            const previewContext = {
                              event: 'form_submitted',
                              formId: 'form-123',
                              submissionId: 'sub-456',
                              ipAddress: '1.2.3.4',
                              formatted: {
                                formId: 'form-123',
                                formName: 'Demo Form',
                                fields: [
                                  {
                                    id: 'field_1',
                                    label: 'Name',
                                    type: 'text',
                                    value: 'John Doe',
                                  },
                                  {
                                    id: 'field_2',
                                    label: 'Email',
                                    type: 'email',
                                    value: 'john@example.com',
                                  },
                                ],
                                rawData: {
                                  field_1: 'John Doe',
                                  field_2: 'john@example.com',
                                },
                              },
                            };

                            let preview =
                              payloadTemplate ||
                              '{"event": "{{event}}", "formId": "{{formId}}", "fields": {{formatted.fields}} }';
                            preview = preview.replace(
                              /{{\s*([\w.]+)\s*}}/g,
                              (_: string, key: string) => {
                                const keys = key.split('.');
                                let value: any = previewContext;
                                for (const k of keys) value = value?.[k];
                                if (typeof value === 'object' && value !== null)
                                  return JSON.stringify(value, null, 2);
                                return value !== undefined ? String(value) : '';
                              }
                            );
                            return preview;
                          } catch {
                            return 'Invalid template';
                          }
                        })()}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalFooter className="mt-6 flex justify-end gap-2">
            <Button onClick={handleClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={!(url && events.length) || loading}
              type="submit"
              variant="default"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
