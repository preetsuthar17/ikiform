-- Add API key field to forms table
ALTER TABLE "public"."forms" 
ADD COLUMN "api_key" "text" UNIQUE,
ADD COLUMN "api_enabled" boolean DEFAULT false;

-- Create index for faster API key lookups
CREATE INDEX IF NOT EXISTS "idx_forms_api_key" ON "public"."forms" ("api_key") WHERE "api_key" IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN "public"."forms"."api_key" IS 'Secret key for external API submissions to this form';
COMMENT ON COLUMN "public"."forms"."api_enabled" IS 'Whether external API submissions are enabled for this form';
