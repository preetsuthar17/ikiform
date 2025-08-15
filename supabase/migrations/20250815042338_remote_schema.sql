

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."cleanup_orphaned_files"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  deleted_count INTEGER := 0;
  current_deleted INTEGER;
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND name ~ '^forms/[^/]+/[^/]+/.*'
  AND NOT EXISTS (
    SELECT 1 FROM forms 
    WHERE id::text = split_part(name, '/', 2)
  );
  
  GET DIAGNOSTICS current_deleted = ROW_COUNT;
  deleted_count := deleted_count + current_deleted;
  
  DELETE FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND name ~ '^submissions/[^/]+/[^/]+/.*'
  AND NOT EXISTS (
    SELECT 1 FROM form_submissions 
    WHERE id::text = split_part(name, '/', 2)
  );
  
  GET DIAGNOSTICS current_deleted = ROW_COUNT;
  deleted_count := deleted_count + current_deleted;
  
  RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_orphaned_files"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_form_file_stats"("form_id_param" "uuid") RETURNS TABLE("total_files" bigint, "total_size_bytes" bigint, "file_types" "text"[])
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    COUNT(*) as total_files,
    SUM((metadata->>'size')::BIGINT) as total_size_bytes,
    ARRAY_AGG(DISTINCT (metadata->>'mimetype')) as file_types
  FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND (
    name ~ ('^forms/' || form_id_param::text || '/.*') 
    OR 
    name ~ '^submissions/[^/]+/[^/]+/.*' 
    AND EXISTS (
      SELECT 1 FROM form_submissions fs
      WHERE fs.id::text = split_part(name, '/', 2) 
      AND fs.form_id = form_id_param
    )
  );
$$;


ALTER FUNCTION "public"."get_form_file_stats"("form_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_form_file_url"("form_id" "uuid", "file_path" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  file_url TEXT;
BEGIN
  -- Check if the user owns the form
  IF NOT EXISTS (
    SELECT 1 FROM forms
    WHERE id = form_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: You do not own this form';
  END IF;

  -- Return the storage path (you'll generate signed URL in your application)
  RETURN format('%s/%s', form_id, file_path);
END;
$$;


ALTER FUNCTION "public"."get_form_file_url"("form_id" "uuid", "file_path" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO public.users (uid, name, email, has_premium)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    FALSE
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin_request"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Service role requests will have no auth.uid() value
  -- and will have special claims in the JWT
  RETURN (SELECT auth.uid() IS NULL AND auth.jwt() IS NOT NULL);
END;
$$;


ALTER FUNCTION "public"."is_admin_request"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_premium_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- If this is not an admin request and has_premium is being changed
  IF NOT public.is_admin_request() AND NEW.has_premium IS DISTINCT FROM OLD.has_premium THEN
    -- Reset has_premium to its old value
    NEW.has_premium := OLD.has_premium;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_premium_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_form_bypass_rls"("p_form_id" "uuid", "p_submission_data" "jsonb", "p_ip_address" "inet" DEFAULT NULL::"inet") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  v_submission_id UUID;
  v_is_published BOOLEAN;
BEGIN
  -- Check if the form exists and is published
  SELECT is_published INTO v_is_published
  FROM public.forms
  WHERE id = p_form_id;
  
  IF v_is_published IS NULL THEN
    RAISE EXCEPTION 'Form not found';
  END IF;
  
  IF NOT v_is_published THEN
    RAISE EXCEPTION 'Form is not published';
  END IF;
  
  -- Insert the submission
  INSERT INTO public.form_submissions(form_id, submission_data, ip_address)
  VALUES (p_form_id, p_submission_data, p_ip_address)
  RETURNING id INTO v_submission_id;
  
  RETURN v_submission_id;
END;
$$;


ALTER FUNCTION "public"."submit_form_bypass_rls"("p_form_id" "uuid", "p_submission_data" "jsonb", "p_ip_address" "inet") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_users_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_users_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ai_analytics_chat" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "form_id" "uuid" NOT NULL,
    "session_id" "text" NOT NULL,
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_analytics_chat_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."ai_analytics_chat" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_builder_chat" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_id" "text" NOT NULL,
    "role" "text" NOT NULL,
    "content" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_builder_chat_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."ai_builder_chat" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."form_submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "form_id" "uuid" NOT NULL,
    "submission_data" "jsonb" NOT NULL,
    "submitted_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ip_address" "inet",
    "is_flagged" boolean DEFAULT false NOT NULL,
    "flag_reason" "text",
    "flagged_at" timestamp with time zone,
    "flagged_by" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL
);


ALTER TABLE "public"."form_submissions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."form_submissions"."is_flagged" IS 'Indicates whether this submission has been flagged for review';



COMMENT ON COLUMN "public"."form_submissions"."flag_reason" IS 'The reason why this submission was flagged';



COMMENT ON COLUMN "public"."form_submissions"."flagged_at" IS 'Timestamp when the submission was flagged';



COMMENT ON COLUMN "public"."form_submissions"."flagged_by" IS 'User ID of who flagged the submission';



COMMENT ON COLUMN "public"."form_submissions"."tags" IS 'Array of custom tags applied to this submission';



CREATE TABLE IF NOT EXISTS "public"."forms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "schema" "jsonb" NOT NULL,
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "slug" "text"
);


ALTER TABLE "public"."forms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."redemption_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" character varying(50) NOT NULL,
    "redeemer_email" character varying(255),
    "redeemer_user_id" "uuid",
    "redeemed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true,
    "max_uses" integer DEFAULT 1,
    "current_uses" integer DEFAULT 0,
    "expires_at" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."redemption_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "uid" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "has_premium" boolean DEFAULT false,
    "polar_customer_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waitlist" (
    "id" bigint NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."waitlist" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."waitlist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."waitlist_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."waitlist_id_seq" OWNED BY "public"."waitlist"."id";



CREATE TABLE IF NOT EXISTS "public"."webhook_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "webhook_id" "uuid",
    "event" "text" NOT NULL,
    "status" "text" NOT NULL,
    "request_payload" "jsonb",
    "response_status" integer,
    "response_body" "text",
    "error" "text",
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "attempt" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."webhook_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhooks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "form_id" "uuid",
    "account_id" "uuid",
    "url" "text" NOT NULL,
    "events" "text"[] NOT NULL,
    "secret" "text",
    "method" "text" NOT NULL,
    "headers" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "payload_template" "text",
    "enabled" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "webhooks_method_check" CHECK (("method" = ANY (ARRAY['POST'::"text", 'PUT'::"text"])))
);


ALTER TABLE "public"."webhooks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."waitlist" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."waitlist_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ai_analytics_chat"
    ADD CONSTRAINT "ai_analytics_chat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_builder_chat"
    ADD CONSTRAINT "ai_builder_chat_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_submissions"
    ADD CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."redemption_codes"
    ADD CONSTRAINT "redemption_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."redemption_codes"
    ADD CONSTRAINT "redemption_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("uid");



ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."waitlist"
    ADD CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_logs"
    ADD CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhooks"
    ADD CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_ai_analytics_chat_created_at" ON "public"."ai_analytics_chat" USING "btree" ("created_at");



CREATE INDEX "idx_ai_analytics_chat_form_id" ON "public"."ai_analytics_chat" USING "btree" ("form_id");



CREATE INDEX "idx_ai_analytics_chat_session_id" ON "public"."ai_analytics_chat" USING "btree" ("session_id");



CREATE INDEX "idx_ai_analytics_chat_user_id" ON "public"."ai_analytics_chat" USING "btree" ("user_id");



CREATE INDEX "idx_ai_builder_chat_created_at" ON "public"."ai_builder_chat" USING "btree" ("created_at");



CREATE INDEX "idx_ai_builder_chat_session_id" ON "public"."ai_builder_chat" USING "btree" ("session_id");



CREATE INDEX "idx_ai_builder_chat_user_id" ON "public"."ai_builder_chat" USING "btree" ("user_id");



CREATE INDEX "idx_form_submissions_flagged_at" ON "public"."form_submissions" USING "btree" ("flagged_at");



CREATE INDEX "idx_form_submissions_form_flagged" ON "public"."form_submissions" USING "btree" ("form_id", "is_flagged");



CREATE INDEX "idx_form_submissions_form_id" ON "public"."form_submissions" USING "btree" ("form_id");



CREATE INDEX "idx_form_submissions_is_flagged" ON "public"."form_submissions" USING "btree" ("is_flagged");



CREATE INDEX "idx_form_submissions_submitted_at" ON "public"."form_submissions" USING "btree" ("submitted_at" DESC);



CREATE INDEX "idx_form_submissions_tags" ON "public"."form_submissions" USING "gin" ("tags");



CREATE INDEX "idx_forms_is_published" ON "public"."forms" USING "btree" ("is_published");



CREATE INDEX "idx_forms_updated_at" ON "public"."forms" USING "btree" ("updated_at" DESC);



CREATE INDEX "idx_forms_user_id" ON "public"."forms" USING "btree" ("user_id");



CREATE INDEX "idx_redemption_codes_code" ON "public"."redemption_codes" USING "btree" ("code");



CREATE INDEX "idx_redemption_codes_is_active" ON "public"."redemption_codes" USING "btree" ("is_active");



CREATE INDEX "idx_redemption_codes_redeemer_email" ON "public"."redemption_codes" USING "btree" ("redeemer_email");



CREATE INDEX "idx_redemption_codes_redeemer_user_id" ON "public"."redemption_codes" USING "btree" ("redeemer_user_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_has_premium" ON "public"."users" USING "btree" ("has_premium");



CREATE INDEX "idx_users_polar_customer_id" ON "public"."users" USING "btree" ("polar_customer_id") WHERE ("polar_customer_id" IS NOT NULL);



CREATE INDEX "webhook_logs_event_idx" ON "public"."webhook_logs" USING "btree" ("event");



CREATE INDEX "webhook_logs_status_idx" ON "public"."webhook_logs" USING "btree" ("status");



CREATE INDEX "webhook_logs_webhook_id_idx" ON "public"."webhook_logs" USING "btree" ("webhook_id");



CREATE INDEX "webhooks_account_id_idx" ON "public"."webhooks" USING "btree" ("account_id");



CREATE INDEX "webhooks_form_id_idx" ON "public"."webhooks" USING "btree" ("form_id");



CREATE OR REPLACE TRIGGER "update_ai_analytics_chat_updated_at" BEFORE UPDATE ON "public"."ai_analytics_chat" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_ai_builder_chat_updated_at" BEFORE UPDATE ON "public"."ai_builder_chat" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forms_updated_at" BEFORE UPDATE ON "public"."forms" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_redemption_codes_updated_at" BEFORE UPDATE ON "public"."redemption_codes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_users_updated_at_column"();



ALTER TABLE ONLY "public"."ai_analytics_chat"
    ADD CONSTRAINT "ai_analytics_chat_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_analytics_chat"
    ADD CONSTRAINT "ai_analytics_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_builder_chat"
    ADD CONSTRAINT "ai_builder_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."form_submissions"
    ADD CONSTRAINT "form_submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."redemption_codes"
    ADD CONSTRAINT "redemption_codes_redeemer_user_id_fkey" FOREIGN KEY ("redeemer_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_uid_fkey" FOREIGN KEY ("uid") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webhook_logs"
    ADD CONSTRAINT "webhook_logs_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhooks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webhooks"
    ADD CONSTRAINT "webhooks_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."users"("uid") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."webhooks"
    ADD CONSTRAINT "webhooks_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE;



CREATE POLICY "Allow insert for authenticated users" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "uid"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."waitlist" FOR DELETE USING ((( SELECT "auth"."email"() AS "email") = "email"));



CREATE POLICY "Enable read access for all users" ON "public"."waitlist" FOR SELECT USING (true);



CREATE POLICY "Form owner can view webhook logs" ON "public"."webhook_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."webhooks"
     JOIN "public"."forms" ON (("webhooks"."form_id" = "forms"."id")))
  WHERE (("webhooks"."id" = "webhook_logs"."webhook_id") AND ("forms"."id" = "auth"."uid"())))));



CREATE POLICY "Form owners can view submissions" ON "public"."form_submissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "form_submissions"."form_id") AND ("forms"."user_id" = "auth"."uid"())))));



CREATE POLICY "Form/account owners can insert webhooks" ON "public"."webhooks" FOR INSERT WITH CHECK (((("form_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "webhooks"."form_id") AND ("forms"."user_id" = "auth"."uid"()))))) OR (("account_id" IS NOT NULL) AND ("account_id" = "auth"."uid"()))));



CREATE POLICY "Form/account owners can manage their webhooks" ON "public"."webhooks" USING (((("form_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "webhooks"."form_id") AND ("forms"."user_id" = "auth"."uid"()))))) OR (("account_id" IS NOT NULL) AND ("account_id" = "auth"."uid"()))));



CREATE POLICY "Form/account owners can update webhooks" ON "public"."webhooks" FOR UPDATE USING (((("form_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "webhooks"."form_id") AND ("forms"."user_id" = "auth"."uid"()))))) OR (("account_id" IS NOT NULL) AND ("account_id" = "auth"."uid"())))) WITH CHECK (((("form_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "webhooks"."form_id") AND ("forms"."user_id" = "auth"."uid"()))))) OR (("account_id" IS NOT NULL) AND ("account_id" = "auth"."uid"()))));



CREATE POLICY "Only admins can delete submissions" ON "public"."form_submissions" FOR DELETE TO "authenticated" USING (((("auth"."jwt"() ->> 'app_metadata'::"text"))::"jsonb" ? 'is_admin'::"text"));



CREATE POLICY "Public can view published forms" ON "public"."forms" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Public insert" ON "public"."form_submissions" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can do anything" ON "public"."webhooks" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service role full access" ON "public"."redemption_codes" USING (("auth"."role"() = 'service_role'::"text"));



CREATE POLICY "Users can delete their own forms" ON "public"."forms" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own AI analytics chats" ON "public"."ai_analytics_chat" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own AI builder chats" ON "public"."ai_builder_chat" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own forms" ON "public"."forms" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can only access analytics for their own forms" ON "public"."ai_analytics_chat" USING ((EXISTS ( SELECT 1
   FROM "public"."forms"
  WHERE (("forms"."id" = "ai_analytics_chat"."form_id") AND ("forms"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their own AI analytics chats" ON "public"."ai_analytics_chat" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own AI builder chats" ON "public"."ai_builder_chat" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own forms" ON "public"."forms" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile except has_premium" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "uid")) WITH CHECK ((("auth"."uid"() = "uid") AND (NOT ("has_premium" IS DISTINCT FROM "has_premium"))));



CREATE POLICY "Users can view own redemptions only" ON "public"."redemption_codes" FOR SELECT USING ((("auth"."uid"() IS NOT NULL) AND ("auth"."uid"() = "redeemer_user_id")));



CREATE POLICY "Users can view their own AI analytics chats" ON "public"."ai_analytics_chat" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own AI builder chats" ON "public"."ai_builder_chat" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own forms" ON "public"."forms" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "uid"));



ALTER TABLE "public"."ai_analytics_chat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_builder_chat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."form_submissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public insert" ON "public"."form_submissions" FOR INSERT WITH CHECK (true);



CREATE POLICY "public select" ON "public"."form_submissions" FOR SELECT USING (true);



ALTER TABLE "public"."redemption_codes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_all_forms" ON "public"."forms" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select_own_forms" ON "public"."forms" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waitlist" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhook_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhooks" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."cleanup_orphaned_files"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_orphaned_files"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_orphaned_files"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_form_file_stats"("form_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_form_file_stats"("form_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_form_file_stats"("form_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_form_file_url"("form_id" "uuid", "file_path" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_form_file_url"("form_id" "uuid", "file_path" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_form_file_url"("form_id" "uuid", "file_path" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin_request"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_premium_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_premium_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_premium_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."submit_form_bypass_rls"("p_form_id" "uuid", "p_submission_data" "jsonb", "p_ip_address" "inet") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_form_bypass_rls"("p_form_id" "uuid", "p_submission_data" "jsonb", "p_ip_address" "inet") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_form_bypass_rls"("p_form_id" "uuid", "p_submission_data" "jsonb", "p_ip_address" "inet") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_users_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_users_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_users_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."ai_analytics_chat" TO "anon";
GRANT ALL ON TABLE "public"."ai_analytics_chat" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_analytics_chat" TO "service_role";



GRANT ALL ON TABLE "public"."ai_builder_chat" TO "anon";
GRANT ALL ON TABLE "public"."ai_builder_chat" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_builder_chat" TO "service_role";



GRANT ALL ON TABLE "public"."form_submissions" TO "anon";
GRANT ALL ON TABLE "public"."form_submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."form_submissions" TO "service_role";



GRANT ALL ON TABLE "public"."forms" TO "anon";
GRANT ALL ON TABLE "public"."forms" TO "authenticated";
GRANT ALL ON TABLE "public"."forms" TO "service_role";



GRANT ALL ON TABLE "public"."redemption_codes" TO "anon";
GRANT ALL ON TABLE "public"."redemption_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."redemption_codes" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."waitlist" TO "anon";
GRANT ALL ON TABLE "public"."waitlist" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist" TO "service_role";



GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."waitlist_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_logs" TO "anon";
GRANT ALL ON TABLE "public"."webhook_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_logs" TO "service_role";



GRANT ALL ON TABLE "public"."webhooks" TO "anon";
GRANT ALL ON TABLE "public"."webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."webhooks" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
