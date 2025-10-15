-- Add optional name and description to webhooks
alter table public.webhooks
  add column if not exists name text null,
  add column if not exists description text null;

-- backfill defaults not needed; leave nulls

-- Update RLS policies or permissions are assumed unchanged

