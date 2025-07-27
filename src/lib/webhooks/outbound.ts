import crypto from 'crypto';
import { formsDbServer } from '@/lib/database';
import type {
  WebhookConfig,
  WebhookEventType,
  WebhookLog,
} from '@/lib/database/database.types';
import { createAdminClient } from '@/utils/supabase/admin';

// --- Outbound Webhook Logic ---

// Helper to map DB row to WebhookConfig (camelCase)
function mapWebhookRow(row: any): WebhookConfig {
  const { created_at, updated_at, ...rest } = row;
  return {
    ...rest,
    createdAt: created_at,
    updatedAt: updated_at,
  } as WebhookConfig;
}

// Get webhooks by formId/accountId
export async function getWebhooks({
  formId,
  accountId,
}: {
  formId?: string;
  accountId?: string;
}): Promise<WebhookConfig[]> {
  const supabase = createAdminClient();
  let query = supabase.from('webhooks').select('*');
  if (formId) query = query.eq('form_id', formId);
  if (accountId) query = query.eq('account_id', accountId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  // Never return secrets in API response
  return (data || []).map(({ secret, ...rest }) => mapWebhookRow(rest));
}

// Create a new webhook
export async function createWebhook(
  data: Partial<WebhookConfig>
): Promise<WebhookConfig> {
  // Validate required fields
  if (!(data.url && data.events && data.method)) {
    throw new Error('Missing required fields: url, events, or method');
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const insertData = {
    ...data,
    form_id: data.formId,
    account_id: data.accountId,
    enabled: data.enabled ?? true,
    created_at: now,
    updated_at: now,
    payload_template: data.payloadTemplate ?? (data as any).payload_template,
  };
  delete insertData.formId;
  delete insertData.accountId;
  delete insertData.payloadTemplate;

  // Insert into 'webhooks' table (assumed table name)
  const { data: result, error } = await supabase
    .from('webhooks')
    .insert([insertData])
    .select()
    .single();

  if (error || !result) {
    console.error(
      'Supabase error creating webhook:',
      error,
      'Data:',
      insertData
    );
    throw new Error(error?.message || 'Failed to create webhook');
  }

  // Never return secret in API response
  const { secret, ...safeResult } = result;
  return mapWebhookRow(safeResult);
}

// Update a webhook
export async function updateWebhook(
  id: string,
  data: Partial<WebhookConfig>
): Promise<WebhookConfig> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const updateData = {
    ...data,
    form_id: data.formId,
    account_id: data.accountId,
    updated_at: now,
    payload_template: data.payloadTemplate ?? (data as any).payload_template,
  };
  delete updateData.formId;
  delete updateData.accountId;
  delete updateData.payloadTemplate;
  const { data: result, error } = await supabase
    .from('webhooks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  if (error || !result) {
    console.error(
      'Supabase error updating webhook:',
      error,
      'Data:',
      updateData
    );
    throw new Error(error?.message || 'Failed to update webhook');
  }
  const { secret, ...safeResult } = result;
  return mapWebhookRow(safeResult);
}

// Delete a webhook
export async function deleteWebhook(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('webhooks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Get webhook delivery logs
export async function getWebhookLogs({
  webhookId,
  formId,
  accountId,
}: {
  webhookId?: string;
  formId?: string;
  accountId?: string;
}): Promise<WebhookLog[]> {
  const supabase = createAdminClient();
  let query = supabase.from('webhook_logs').select('*');
  if (webhookId) query = query.eq('webhook_id', webhookId);
  if (formId) query = query.eq('form_id', formId);
  if (accountId) query = query.eq('account_id', accountId);
  query = query.order('timestamp', { ascending: false });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data : [];
}

// Re-send a failed webhook delivery
export async function resendWebhookDelivery(
  id: string,
  body: { logId: string }
): Promise<any> {
  const supabase = createAdminClient();
  // 1. Fetch the log
  const { data: log, error: logError } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('id', body.logId)
    .single();
  if (logError || !log) throw new Error('Log not found');
  // 2. Fetch the webhook
  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', log.webhook_id)
    .single();
  if (webhookError || !webhook) throw new Error('Webhook not found');
  // 3. Prepare payload and headers
  let payload = log.request_payload;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(webhook.headers || {}),
  };
  if (webhook.secret) {
    headers['X-Webhook-Signature'] = signPayload(payload, webhook.secret);
  }
  // Discord/Slack special handling
  if (isDiscordWebhook(webhook.url)) {
    payload = JSON.stringify(
      buildDiscordEmbedPayload(JSON.parse(payload), webhook.form_id || '')
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook(webhook.url)) {
    payload = JSON.stringify(buildSlackMessagePayload(JSON.parse(payload)));
    headers = { 'Content-Type': 'application/json' };
  }
  // 4. Send the webhook (no retry)
  let status = 0;
  let responseBody = '';
  let errorMsg = '';
  try {
    const res = await fetch(webhook.url, {
      method: webhook.method,
      headers,
      body: payload,
      // @ts-expect-error
      timeout: 10_000,
    });
    status = res.status;
    responseBody = await res.text();
  } catch (err: any) {
    errorMsg = String(err);
  }
  // 5. Log the resend attempt
  await supabase.from('webhook_logs').insert([
    {
      webhook_id: webhook.id,
      event: 'resend',
      status: errorMsg ? 'failed' : 'success',
      request_payload: payload,
      response_status: status,
      response_body: responseBody,
      error: errorMsg || undefined,
      timestamp: new Date().toISOString(),
      attempt: (log.attempt || 0) + 1,
    },
  ]);
  if (errorMsg) {
    return { status, responseBody, error: errorMsg };
  }
  return { status, responseBody };
}

// Test a webhook (send sample payload)
export async function testWebhook(
  id: string,
  samplePayload?: any
): Promise<any> {
  const supabase = createAdminClient();
  // Fetch the webhook config
  const { data: webhook, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !webhook) throw new Error('Webhook not found');

  // Prepare test payload
  const payload = samplePayload || {
    test: true,
    message: 'This is a test webhook from Ikiform.',
    timestamp: new Date().toISOString(),
    webhookId: id,
  };
  let body = JSON.stringify(payload);
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(webhook.headers || {}),
  };
  if (webhook.secret) {
    headers['X-Webhook-Signature'] = signPayload(body, webhook.secret);
  }

  // Discord/Slack special handling
  if (isDiscordWebhook(webhook.url)) {
    body = JSON.stringify(
      buildDiscordEmbedPayload(payload, webhook.form_id || '')
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook(webhook.url)) {
    body = JSON.stringify(buildSlackMessagePayload(payload));
    headers = { 'Content-Type': 'application/json' };
  }

  // Send the webhook (no retry)
  let status = 0;
  let responseBody = '';
  let errorMsg = '';
  try {
    const res = await fetch(webhook.url, {
      method: webhook.method,
      headers,
      body,
      // @ts-expect-error
      timeout: 10_000,
    });
    status = res.status;
    responseBody = await res.text();
  } catch (err: any) {
    errorMsg = String(err);
  }

  // Log the test attempt
  await supabase.from('webhook_logs').insert([
    {
      webhook_id: webhook.id,
      event: 'test',
      status: errorMsg ? 'failed' : 'success',
      request_payload: body,
      response_status: status,
      response_body: responseBody,
      error: errorMsg || undefined,
      timestamp: new Date().toISOString(),
      attempt: 0,
    },
  ]);

  if (errorMsg) {
    return { status, responseBody, error: errorMsg };
  }
  return { status, responseBody };
}

// Helper: Sign payload with HMAC SHA256
function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function isDiscordWebhook(url: string) {
  return url.startsWith('https://discord.com/api/webhooks/');
}

function buildDiscordEmbedPayload(
  formData: Record<string, any>,
  formId: string
) {
  // Helper function to safely convert values to strings
  function formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => formatValue(item)).join(', ');
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return '[Complex Object]';
      }
    }

    return String(value);
  }

  // Build fields array, handling the nested structure properly
  const fields: { name: any; value: string; inline: boolean }[] = [];

  // If formData has a 'fields' property (from your formatted payload)
  if (formData.fields && Array.isArray(formData.fields)) {
    formData.fields.forEach((field: any) => {
      fields.push({
        name: field.label || field.id || 'Unknown Field',
        value: formatValue(field.value),
        inline: true,
      });
    });
  } else {
    // If it's raw form data, process it directly
    Object.entries(formData).forEach(([key, value]) => {
      // Skip meta fields that shouldn't be displayed
      if (
        [
          'event',
          'formId',
          'formName',
          'submissionId',
          'ipAddress',
          'rawData',
        ].includes(key)
      ) {
        return;
      }

      fields.push({
        name: key,
        value: formatValue(value),
        inline: true,
      });
    });
  }

  return {
    content: `New submission for form: \`${formData.formName || formId}\``,
    embeds: [
      {
        title: 'Form Submission',
        description: `Form ID: \`${formId}\``,
        fields,
        color: 5_814_783, // Blue color
        timestamp: new Date().toISOString(),
        footer: {
          text: `Submission ID: ${formData.submissionId || 'N/A'}`,
        },
      },
    ],
  };
}

function isSlackWebhook(url: string) {
  return url.startsWith('https://hooks.slack.com/services/');
}

function buildSlackMessagePayload(formData: Record<string, any>) {
  function formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => formatValue(item)).join(', ');
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return '[Complex Object]';
      }
    }

    return String(value);
  }

  const fields: { title: any; value: string; short: boolean }[] = [];

  // If formData has a 'fields' property (from your formatted payload)
  if (formData.fields && Array.isArray(formData.fields)) {
    formData.fields.forEach((field: any) => {
      fields.push({
        title: field.label || field.id || 'Unknown Field',
        value: formatValue(field.value),
        short: true,
      });
    });
  } else {
    // If it's raw form data, process it directly
    Object.entries(formData).forEach(([key, value]) => {
      // Skip meta fields that shouldn't be displayed
      if (
        [
          'event',
          'formId',
          'formName',
          'submissionId',
          'ipAddress',
          'rawData',
        ].includes(key)
      ) {
        return;
      }

      fields.push({
        title: key,
        value: formatValue(value),
        short: true,
      });
    });
  }

  return {
    text: `New form submission: \`${formData.formName || 'Unknown Form'}\``,
    attachments: [
      {
        color: 'good',
        fields,
        footer: `Submission ID: ${formData.submissionId || 'N/A'}`,
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };
}
// Helper: Render a template string with {{variables}} from context (supports dot notation)
function renderTemplate(
  template: string,
  context: Record<string, any>
): string {
  return template.replace(/{{\s*(json)?\s*([\w.]+)\s*}}/g, (_, isJson, key) => {
    const keys = key.split('.');
    let value = context;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined || value === null) return '';
    }
    if (isJson) {
      try {
        return JSON.stringify(value);
      } catch {
        return '';
      }
    }
    return String(value);
  });
}

// Helper: Format human-friendly payload for webhooks/logs
export async function formatHumanFriendlyPayload(
  formId: string,
  formData: Record<string, any>
) {
  // Fetch form schema
  const form = await formsDbServer.getPublicForm(formId);
  const schema = form.schema;
  const allFields = schema.blocks?.length
    ? schema.blocks.flatMap((block: any) => block.fields)
    : schema.fields || [];
  const fields = Object.entries(formData).map(([fieldId, value]) => {
    const field = allFields.find((f: any) => f.id === fieldId);
    return {
      id: fieldId, // <-- Add fieldId to the output
      label: field?.label || fieldId,
      type: field?.type || 'unknown',
      value,
    };
  });
  return {
    formId,
    formName: schema.settings?.title || form.title || formId,
    fields,
    rawData: formData,
  };
}

// Trigger webhooks for an event
export async function triggerWebhooks(
  event: WebhookEventType,
  payload: any
): Promise<void> {
  const supabase = createAdminClient();
  // Find all enabled webhooks for this event (by formId/accountId if present)
  const { formId, accountId } = payload;
  console.log('[Webhook] triggerWebhooks called:', { event, payload });
  const { data: webhooks, error } = await supabase
    .from('webhooks')
    .select('*')
    .contains('events', [event])
    .eq('enabled', true)
    .or(
      [
        formId ? `form_id.eq.${formId}` : undefined,
        accountId ? `account_id.eq.${accountId}` : undefined,
      ]
        .filter(Boolean)
        .join(',')
    );
  if (error) throw new Error(error.message);
  if (!webhooks || webhooks.length === 0) {
    console.log(
      '[Webhook] No webhooks found for event',
      event,
      'formId',
      formId,
      'accountId',
      accountId
    );
    return;
  }
  console.log(
    '[Webhook] Found webhooks:',
    webhooks.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      enabled: w.enabled,
      form_id: w.form_id,
      account_id: w.account_id,
    }))
  );
  for (const webhook of webhooks) {
    let body: string;
    // Use human-friendly formatting for form_submitted
    if (event === 'form_submitted' && payload.formId && payload.formData) {
      const formatted = await formatHumanFriendlyPayload(
        payload.formId,
        payload.formData
      );
      body = webhook.payloadTemplate
        ? renderTemplate(webhook.payloadTemplate, {
            event,
            ...payload,
            formatted,
          })
        : JSON.stringify({ event, ...payload, formatted });
    } else {
      body = webhook.payloadTemplate
        ? renderTemplate(webhook.payloadTemplate, { event, ...payload })
        : JSON.stringify({ event, ...payload });
    }
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(webhook.headers || {}),
    };
    if (webhook.secret) {
      headers['X-Webhook-Signature'] = signPayload(body, webhook.secret);
    }
    // Deliver asynchronously
    deliverWithRetry(webhook, body, headers, 0);
  }
}

// Deliver webhook with retries, signing, and logging
export async function deliverWithRetry(
  webhook: WebhookConfig,
  body: string,
  headers: Record<string, string>,
  attempt: number
): Promise<void> {
  const supabase = createAdminClient();
  try {
    let finalBody = body;
    let finalHeaders = { ...headers };
    // Discord webhook: override body and headers
    if (isDiscordWebhook(webhook.url)) {
      try {
        const parsed = JSON.parse(body);
        finalBody = JSON.stringify(
          buildDiscordEmbedPayload(
            parsed.formData || parsed,
            parsed.formId || ''
          )
        );
      } catch {
        finalBody = JSON.stringify(buildDiscordEmbedPayload({}, ''));
      }
      finalHeaders = { 'Content-Type': 'application/json' };
    }
    // Slack webhook: override body and headers
    else if (isSlackWebhook(webhook.url)) {
      try {
        const parsed = JSON.parse(body);
        finalBody = JSON.stringify(
          buildSlackMessagePayload(parsed.formData || parsed)
        );
      } catch {
        finalBody = JSON.stringify(buildSlackMessagePayload({}));
      }
      finalHeaders = { 'Content-Type': 'application/json' };
    }
    const res = await fetch(webhook.url, {
      method: webhook.method,
      headers: finalHeaders,
      body: finalBody,
      // @ts-expect-error
      timeout: 10_000,
    });
    const responseBody = await res.text();
    // Log success
    await supabase.from('webhook_logs').insert([
      {
        webhook_id: webhook.id,
        event: 'triggered',
        status: 'success',
        request_payload: finalBody,
        response_status: res.status,
        response_body: responseBody,
        timestamp: new Date().toISOString(),
        attempt,
      },
    ]);
  } catch (err: any) {
    // Log failure
    await supabase.from('webhook_logs').insert([
      {
        webhook_id: webhook.id,
        event: 'triggered',
        status: 'failed',
        request_payload: body,
        error: String(err),
        timestamp: new Date().toISOString(),
        attempt,
      },
    ]);
    // Retry with exponential backoff (max 3 attempts)
    if (attempt < 3) {
      setTimeout(
        () => deliverWithRetry(webhook, body, headers, attempt + 1),
        2 ** attempt * 1000
      );
    }
  }
}
