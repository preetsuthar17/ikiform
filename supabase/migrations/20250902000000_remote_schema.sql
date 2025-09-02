-- Add notification fields to webhooks table
alter table if exists public.webhooks
  add column if not exists notification_email text,
  add column if not exists notify_on_success boolean default false not null,
  add column if not exists notify_on_failure boolean default true not null;

comment on column public.webhooks.notification_email is 'Email to notify about webhook deliveries';
comment on column public.webhooks.notify_on_success is 'Send email on successful delivery';
comment on column public.webhooks.notify_on_failure is 'Send email on failed delivery';

