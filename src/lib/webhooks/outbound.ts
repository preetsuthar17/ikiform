import crypto from 'crypto';
import { formsDbServer } from '@/lib/database';
import type {
  Database,
  WebhookConfig,
  WebhookEventType,
  WebhookLog,
} from '@/lib/database/database.types';
import { createAdminClient } from '@/utils/supabase/admin';

type WebhookRow = Database['public']['Tables']['webhooks']['Row'];
type WebhookInsert = Database['public']['Tables']['webhooks']['Insert'];
type WebhookUpdate = Database['public']['Tables']['webhooks']['Update'];

type WebhookLogRow = Database['public']['Tables']['webhook_logs']['Row'];
type WebhookLogInsert = Database['public']['Tables']['webhook_logs']['Insert'];

function mapWebhookRow(row: Omit<WebhookRow, 'secret'>): WebhookConfig {
  const { created_at, updated_at, ...rest } = row as any;
  return {
    ...(rest as unknown as Omit<WebhookConfig, 'createdAt' | 'updatedAt'>),
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
  let query = supabase.from('webhooks' as const).select('*');
  if (formId) query = query.eq('form_id', formId);
  if (accountId) query = query.eq('account_id', accountId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const { secret, ...rest } = row as WebhookRow & { secret?: string | null };
    return mapWebhookRow(rest as Omit<WebhookRow, 'secret'>);
  });
}

export async function createWebhook(
  data: Partial<WebhookConfig>
): Promise<WebhookConfig> {
  if (!(data.url && data.events && data.method)) {
    throw new Error('Missing required fields: url, events, or method');
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const insertData: WebhookInsert = {
    url: data.url,
    events: data.events as string[],
    method: data.method,
    headers: (data.headers as any) ?? {},
    form_id: (data as any).form_id ?? data.formId ?? null,
    account_id: (data as any).account_id ?? data.accountId ?? null,
    enabled: data.enabled ?? true,
    payload_template:
      (data as any).payload_template ?? data.payloadTemplate ?? null,
    secret: (data as any).secret ?? null,
    created_at: now,
    updated_at: now,
  };

  const { data: result, error } = await supabase
    .from('webhooks' as const)
    .insert([insertData] as any)
    .select('*')
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

  const { secret, ...safeResult } = result as WebhookRow & {
    secret?: string | null;
  };
  return mapWebhookRow(safeResult as Omit<WebhookRow, 'secret'>);
}

export async function updateWebhook(
  id: string,
  data: Partial<WebhookConfig>
): Promise<WebhookConfig> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const updateData: WebhookUpdate = {
    url: data.url,
    events: data.events as any,
    method: data.method,
    headers: data.headers as any,
    form_id: (data as any).form_id ?? data.formId ?? null,
    account_id: (data as any).account_id ?? data.accountId ?? null,
    enabled: data.enabled,
    payload_template:
      (data as any).payload_template ?? data.payloadTemplate ?? null,
    secret: (data as any).secret ?? null,
    updated_at: now,
  };
  const { data: result, error } = await (
    supabase.from('webhooks' as const) as any
  )
    .update(updateData)
    .eq('id', id)
    .select('*')
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
  const { secret, ...safeResult } = result as WebhookRow & {
    secret?: string | null;
  };
  return mapWebhookRow(safeResult as Omit<WebhookRow, 'secret'>);
}

export async function deleteWebhook(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('webhooks' as const)
    .delete()
    .eq('id', id);
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
  let query = supabase.from('webhook_logs' as const).select('*');
  if (webhookId) query = query.eq('webhook_id', webhookId);
  if (formId) query = query.eq('form_id', formId as any);
  if (accountId) query = query.eq('account_id', accountId as any);
  query = query.order('timestamp', { ascending: false });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? (data as unknown as WebhookLog[]) : [];
}

export async function resendWebhookDelivery(
  id: string,
  body: { logId: string }
): Promise<any> {
  const supabase = createAdminClient();

  const { data: log, error: logError } = await supabase
    .from('webhook_logs' as const)
    .select('*')
    .eq('id', body.logId)
    .single();
  if (logError || !log) throw new Error('Log not found');

  const webhookIdFromLog = (log as WebhookLogRow).webhook_id;
  if (!webhookIdFromLog) throw new Error('Webhook id missing on log');

  const { data: webhook, error: webhookError } = await supabase
    .from('webhooks' as const)
    .select('*')
    .eq('id', webhookIdFromLog)
    .single();
  if (webhookError || !webhook) throw new Error('Webhook not found');

  let payload = (log as WebhookLogRow).request_payload as string | null;
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(((webhook as WebhookRow).headers as any) || {}),
  };
  if ((webhook as WebhookRow).secret) {
    headers['X-Webhook-Signature'] = signPayload(
      payload ?? '',
      (webhook as WebhookRow).secret as string
    );
  }

  if (isDiscordWebhook((webhook as WebhookRow).url)) {
    payload = JSON.stringify(
      buildDiscordEmbedPayload(
        JSON.parse(payload ?? '{}'),
        (webhook as WebhookRow).form_id || ''
      )
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook((webhook as WebhookRow).url)) {
    payload = JSON.stringify(
      buildSlackMessagePayload(JSON.parse(payload ?? '{}'))
    );
    headers = { 'Content-Type': 'application/json' };
  }

  let status = 0;
  let responseBody = '';
  let errorMsg = '';
  try {
    const res = await fetch((webhook as WebhookRow).url, {
      method: (webhook as WebhookRow).method,
      headers,
      body: payload ?? undefined,
      // @ts-expect-error
      timeout: 10_000,
    });
    status = res.status;
    responseBody = await res.text();
  } catch (err: any) {
    errorMsg = String(err);
  }

  const logInsert: WebhookLogInsert = {
    webhook_id: (webhook as WebhookRow).id,
    event: 'resend',
    status: errorMsg ? 'failed' : 'success',
    request_payload: payload ?? null,
    response_status: status,
    response_body: responseBody,
    error: errorMsg || null,
    timestamp: new Date().toISOString(),
    attempt: ((log as WebhookLogRow).attempt || 0) + 1,
  };

  await supabase.from('webhook_logs' as const).insert([logInsert] as any);
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
    .from('webhooks' as const)
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
    ...(((webhook as WebhookRow).headers as any) || {}),
  };
  if ((webhook as WebhookRow).secret) {
    headers['X-Webhook-Signature'] = signPayload(
      body,
      (webhook as WebhookRow).secret as string
    );
  }

  if (isDiscordWebhook((webhook as WebhookRow).url)) {
    body = JSON.stringify(
      buildDiscordEmbedPayload(payload, (webhook as WebhookRow).form_id || '')
    );
    headers = { 'Content-Type': 'application/json' };
  } else if (isSlackWebhook((webhook as WebhookRow).url)) {
    body = JSON.stringify(buildSlackMessagePayload(payload));
    headers = { 'Content-Type': 'application/json' };
  }

  let status = 0;
  let responseBody = '';
  let errorMsg = '';
  try {
    const res = await fetch((webhook as WebhookRow).url, {
      method: (webhook as WebhookRow).method,
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

  const logInsert: WebhookLogInsert = {
    webhook_id: (webhook as WebhookRow).id,
    event: 'test',
    status: errorMsg ? 'failed' : 'success',
    request_payload: body,
    response_status: status,
    response_body: responseBody,
    error: errorMsg || null,
    timestamp: new Date().toISOString(),
    attempt: 0,
  };

  await supabase.from('webhook_logs' as const).insert([logInsert] as any);

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

  const { data: webhooks, error } = await supabase
    .from('webhooks' as const)
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
    return;
  }
  for (const webhook of webhooks as WebhookRow[]) {
    let body: string;

    if (event === 'form_submitted' && payload.formId && payload.formData) {
      const formatted = await formatHumanFriendlyPayload(
        payload.formId,
        payload.formData
      );
      body = (webhook as WebhookRow).payload_template
        ? renderTemplate((webhook as WebhookRow).payload_template as any, {
            event,
            ...payload,
            formatted,
          })
        : JSON.stringify({ event, ...payload, formatted });
    } else {
      body = (webhook as WebhookRow).payload_template
        ? renderTemplate((webhook as WebhookRow).payload_template as any, {
            event,
            ...payload,
          })
        : JSON.stringify({ event, ...payload });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(((webhook as WebhookRow).headers as any) || {}),
    };
    if ((webhook as WebhookRow).secret) {
      headers['X-Webhook-Signature'] = signPayload(
        body,
        (webhook as WebhookRow).secret as string
      );
    }

    deliverWithRetry(
      {
        ...(webhook as unknown as WebhookConfig),
        payloadTemplate: (webhook as WebhookRow).payload_template as any,
        createdAt: (webhook as WebhookRow).created_at,
        updatedAt: (webhook as WebhookRow).updated_at,
      },
      body,
      headers,
      0
    );
  }
}

export async function deliverWithRetry(
  webhook: WebhookConfig,
  body: string,
  headers: Record<string, string>,
  attempt: number
): Promise<void> {
  const supabase = createAdminClient();
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  const startTime = Date.now();

  console.log(
    `[WEBHOOK DELIVERY] Starting delivery for webhook ${webhook.id} (${webhook.method} ${webhook.url}) - Attempt ${attempt + 1}`
  );

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
        console.log(
          '[WEBHOOK DELIVERY] Discord webhook detected, transformed payload'
        );
      } catch {
        finalBody = JSON.stringify(buildDiscordEmbedPayload({}, ''));
        console.log(
          '[WEBHOOK DELIVERY] Discord webhook detected, using fallback payload'
        );
      }
      finalHeaders = { 'Content-Type': 'application/json' };
    } else if (isSlackWebhook(webhook.url)) {
      try {
        const parsed = JSON.parse(body);
        finalBody = JSON.stringify(
          buildSlackMessagePayload(parsed.formData || parsed)
        );
        console.log(
          '[WEBHOOK DELIVERY] Slack webhook detected, transformed payload'
        );
      } catch {
        finalBody = JSON.stringify(buildSlackMessagePayload({}));
        console.log(
          '[WEBHOOK DELIVERY] Slack webhook detected, using fallback payload'
        );
      }
      finalHeaders = { 'Content-Type': 'application/json' };
    }

    const fetchOptions: RequestInit = {
      method: webhook.method,
      headers: finalHeaders,
      // @ts-expect-error
      timeout: 10_000,
    };

    if (methodsWithBody.includes(webhook.method)) {
      fetchOptions.body = finalBody;
      console.log(
        `[WEBHOOK DELIVERY] Including request body for ${webhook.method} method`
      );
    } else {
      console.log(
        `[WEBHOOK DELIVERY] Skipping request body for ${webhook.method} method`
      );
    }

    console.log(
      `[WEBHOOK DELIVERY] Sending ${webhook.method} request to ${webhook.url}`
    );
    const res = await fetch(webhook.url, fetchOptions);
    const responseBody = await res.text();

    const duration = Date.now() - startTime;
    console.log(
      `[WEBHOOK DELIVERY] Response received: ${res.status} ${res.statusText} in ${duration}ms`
    );

    const successLog: WebhookLogInsert = {
      webhook_id: webhook.id,
      event: 'triggered',
      status: 'success',
      request_payload: methodsWithBody.includes(webhook.method)
        ? finalBody
        : null,
      response_status: res.status,
      response_body: responseBody,
      timestamp: new Date().toISOString(),
      attempt,
    };
    await supabase.from('webhook_logs' as const).insert([successLog] as any);

    console.log(
      `[WEBHOOK DELIVERY] Successfully delivered webhook ${webhook.id} in ${duration}ms`
    );
  } catch (err: any) {
    const duration = Date.now() - startTime;
    console.error(
      `[WEBHOOK DELIVERY] Failed to deliver webhook ${webhook.id} after ${duration}ms:`,
      err.message
    );

    const failureLog: WebhookLogInsert = {
      webhook_id: webhook.id,
      event: 'triggered',
      status: 'failed',
      request_payload: methodsWithBody.includes(webhook.method) ? body : null,
      error: String(err),
      timestamp: new Date().toISOString(),
      attempt,
    };
    await supabase.from('webhook_logs' as const).insert([failureLog] as any);

    if (attempt < 3) {
      const retryDelay = 2 ** attempt * 1000;
      console.log(
        `[WEBHOOK DELIVERY] Scheduling retry ${attempt + 2}/3 for webhook ${webhook.id} in ${retryDelay}ms`
      );
      setTimeout(
        () => deliverWithRetry(webhook, body, headers, attempt + 1),
        retryDelay
      );
    } else {
      console.error(
        `[WEBHOOK DELIVERY] Max retries reached for webhook ${webhook.id}`
      );
    }
  }
}
