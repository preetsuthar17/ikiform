-- Fix RLS policies to prevent users from modifying subscription/billing fields
-- This prevents subscription spoofing and unauthorized data modification

-- Drop the existing weak policy
DROP POLICY IF EXISTS "Users can update their own profile except has_premium" ON "public"."users";

-- Create a trigger function to prevent modification of sensitive fields
-- This silently reverts sensitive fields to their original values, allowing
-- users to still update safe fields like name and email
CREATE OR REPLACE FUNCTION "public"."prevent_user_sensitive_field_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Only allow updates if this is a service role request (admin operations)
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Prevent changing uid by reverting to original value
  IF NEW.uid IS DISTINCT FROM OLD.uid THEN
    NEW.uid := OLD.uid;
  END IF;

  -- Prevent changing subscription/billing fields by reverting to original values
  IF NEW.has_premium IS DISTINCT FROM OLD.has_premium THEN
    NEW.has_premium := OLD.has_premium;
  END IF;

  -- Protect has_free_trial if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'has_free_trial'
  ) THEN
    IF NEW.has_free_trial IS DISTINCT FROM OLD.has_free_trial THEN
      NEW.has_free_trial := OLD.has_free_trial;
    END IF;
  END IF;

  IF NEW.polar_customer_id IS DISTINCT FROM OLD.polar_customer_id THEN
    NEW.polar_customer_id := OLD.polar_customer_id;
  END IF;

  -- Protect customer_name if column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'customer_name'
  ) THEN
    IF NEW.customer_name IS DISTINCT FROM OLD.customer_name THEN
      NEW.customer_name := OLD.customer_name;
    END IF;
  END IF;

  -- Prevent changing system timestamps by reverting to original values
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    NEW.created_at := OLD.created_at;
  END IF;

  IF NEW.updated_at IS DISTINCT FROM OLD.updated_at THEN
    NEW.updated_at := OLD.updated_at;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS "prevent_user_sensitive_field_update_trigger" ON "public"."users";

-- Create trigger to enforce the function
CREATE TRIGGER "prevent_user_sensitive_field_update_trigger"
  BEFORE UPDATE ON "public"."users"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."prevent_user_sensitive_field_update"();

-- Create a simple RLS policy that allows users to update their own records
-- The trigger will prevent modification of sensitive fields
CREATE POLICY "Users can update their own profile" ON "public"."users"
FOR UPDATE
USING (auth.uid() = uid)
WITH CHECK (auth.uid() = uid);

-- Ensure RLS is enabled (should already be enabled, but being explicit)
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- Also add policies to prevent direct deletion of users table via REST API
-- Users should not be able to delete their own records directly
DROP POLICY IF EXISTS "Users can delete their own profile" ON "public"."users";
-- Only service role can delete users (via admin operations)
CREATE POLICY "Only service role can delete users" ON "public"."users"
FOR DELETE
USING (auth.role() = 'service_role');

-- Prevent users from modifying other critical tables directly
-- Forms table: ensure users can only modify their own forms
-- (Policies already exist, but ensure they're correct)

-- Webhooks: ensure users can only modify their own webhooks
-- (Policies already exist, but verify they prevent account_id modification)

-- Webhook logs: prevent direct modification
DROP POLICY IF EXISTS "Users can update webhook logs" ON "public"."webhook_logs";
DROP POLICY IF EXISTS "Users can delete webhook logs" ON "public"."webhook_logs";
-- Only service role can modify webhook logs
CREATE POLICY "Only service role can modify webhook logs" ON "public"."webhook_logs"
FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "Only service role can delete webhook logs" ON "public"."webhook_logs"
FOR DELETE
USING (auth.role() = 'service_role');

-- Form submissions: prevent users from modifying submissions directly
-- (Public insert is needed, but updates/deletes should be restricted)
DROP POLICY IF EXISTS "Users can update form submissions" ON "public"."form_submissions";
DROP POLICY IF EXISTS "Users can delete form submissions" ON "public"."form_submissions";
-- Only admins can modify submissions (already exists for delete, add for update)
CREATE POLICY "Only admins can update submissions" ON "public"."form_submissions"
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'app_metadata')::jsonb ? 'is_admin'
);

-- Redemption codes: prevent users from modifying codes
-- Only apply if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'redemption_codes'
  ) THEN
    DROP POLICY IF EXISTS "Users can update redemption codes" ON "public"."redemption_codes";
    DROP POLICY IF EXISTS "Users can insert redemption codes" ON "public"."redemption_codes";
    DROP POLICY IF EXISTS "Users can delete redemption codes" ON "public"."redemption_codes";
    
    -- Only service role can modify redemption codes
    CREATE POLICY "Only service role can modify redemption codes" ON "public"."redemption_codes"
    FOR INSERT
    USING (auth.role() = 'service_role');

    CREATE POLICY "Only service role can update redemption codes" ON "public"."redemption_codes"
    FOR UPDATE
    USING (auth.role() = 'service_role');

    CREATE POLICY "Only service role can delete redemption codes" ON "public"."redemption_codes"
    FOR DELETE
    USING (auth.role() = 'service_role');
  END IF;
END $$;

