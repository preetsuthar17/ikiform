import crypto from 'crypto';
import { formsDbServer } from '@/lib/database';
import type {
  WebhookConfig,
  WebhookEventType,
  WebhookLog,
} from '@/lib/database/database.types';
import { createAdminClient } from '@/utils/supabase/admin';

function mapWebhookRow(row: any): WebhookConfig {
  const { created_at, updated_at, ...rest } = row;
  return {
    ...rest,
    createdAt: created_at,
    updatedAt: updated_at,
  } as WebhookConfig;
}

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

  return (data || []).map(({ secret, ...rest }) => mapWebhookRow(rest));
}

export async function createWebhook(
  data: Partial<WebhookConfig>
): Promise<WebhookConfig> {
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

  const { secret, ...safeResult } = result;
  return mapWebhookRow(safeResult);
}

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

export async function deleteWebhook(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from('webhooks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

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

export async function resendWebhookDelivery(
  id: string,
  body: { logId: string }
): Promise<any> {
  const supabase = createAdminClient();

  const { data: log, error: logError } = await supabase
    .from('webhook_logs')
    .select('*')
    .eq('id', body.logId)
    .single();
  if (logError || !log) throw new Error('Log not found');

  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', log.webhook_id)
    .single();
  if (webhookError || !webhook) throw new Error('Webhook not found');

  let payload = log.request_payload;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(webhook.headers || {}),
  };
  if (webhook.secret) {
    headers['X-Webhook-Signature'] = signPayload(payload, webhook.secret);
  }

  if (isDiscordWebhook(webhook.url)) {
    payload = JSON.stringify(
      buildDiscordEmbedPayload(JSON.parse(payload), webhook.form_id || '')
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook(webhook.url)) {
    payload = JSON.stringify(buildSlackMessagePayload(JSON.parse(payload)));
    headers = { 'Content-Type': 'application/json' };
  }

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

export async function testWebhook(
  id: string,
  samplePayload?: any
): Promise<any> {
  const supabase = createAdminClient();

  const { data: webhook, error } = await supabase
    .from('webhooks')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !webhook) throw new Error('Webhook not found');

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

  if (isDiscordWebhook(webhook.url)) {
    body = JSON.stringify(
      buildDiscordEmbedPayload(payload, webhook.form_id || '')
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook(webhook.url)) {
    body = JSON.stringify(buildSlackMessagePayload(payload));
    headers = { 'Content-Type': 'application/json' };
  }

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

  const fields: { name: any; value: string; inline: boolean }[] = [];

  if (formData.fields && Array.isArray(formData.fields)) {
    formData.fields.forEach((field: any) => {
      fields.push({
        name: field.label || field.id || 'Unknown Field',
        value: formatValue(field.value),
        inline: true,
      });
    });
  } else {
    Object.entries(formData).forEach(([key, value]) => {
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
        color: 5_814_783,
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

  if (formData.fields && Array.isArray(formData.fields)) {
    formData.fields.forEach((field: any) => {
      fields.push({
        title: field.label || field.id || 'Unknown Field',
        value: formatValue(field.value),
        short: true,
      });
    });
  } else {
    Object.entries(formData).forEach(([key, value]) => {
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

export async function formatHumanFriendlyPayload(
  formId: string,
  formData: Record<string, any>
) {
  const form = await formsDbServer.getPublicForm(formId);
  const schema = form.schema;
  const allFields = schema.blocks?.length
    ? schema.blocks.flatMap((block: any) => block.fields)
    : schema.fields || [];
  const fields = Object.entries(formData).map(([fieldId, value]) => {
    const field = allFields.find((f: any) => f.id === fieldId);
    return {
      id: fieldId,
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

export async function triggerWebhooks(
  event: WebhookEventType,
  payload: any
): Promise<void> {
  const supabase = createAdminClient();

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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(webhook.headers || {}),
    };
    if (webhook.secret) {
      headers['X-Webhook-Signature'] = signPayload(body, webhook.secret);
    }

    deliverWithRetry(webhook, body, headers, 0);
  }
}

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
    } else if (isSlackWebhook(webhook.url)) {
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

    if (attempt < 3) {
      setTimeout(
        () => deliverWithRetry(webhook, body, headers, attempt + 1),
        2 ** attempt * 1000
      );
    }
  }
}
