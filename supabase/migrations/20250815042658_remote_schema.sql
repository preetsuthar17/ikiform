-- Update webhooks table to support all HTTP methods
ALTER TABLE "public"."webhooks" DROP CONSTRAINT IF EXISTS "webhooks_method_check";
ALTER TABLE "public"."webhooks" ADD CONSTRAINT "webhooks_method_check" CHECK (("method" = ANY (ARRAY['DELETE'::"text", 'GET'::"text", 'HEAD'::"text", 'PATCH'::"text", 'POST'::"text", 'PUT'::"text"])));

revoke delete on table "auth"."audit_log_entries" from "postgres";

revoke insert on table "auth"."audit_log_entries" from "postgres";

revoke references on table "auth"."audit_log_entries" from "postgres";

revoke select on table "auth"."audit_log_entries" from "postgres";

revoke trigger on table "auth"."audit_log_entries" from "postgres";

revoke truncate on table "auth"."audit_log_entries" from "postgres";

revoke update on table "auth"."audit_log_entries" from "postgres";

revoke delete on table "auth"."flow_state" from "postgres";

revoke insert on table "auth"."flow_state" from "postgres";

revoke references on table "auth"."flow_state" from "postgres";

revoke select on table "auth"."flow_state" from "postgres";

revoke trigger on table "auth"."flow_state" from "postgres";

revoke truncate on table "auth"."flow_state" from "postgres";

revoke update on table "auth"."flow_state" from "postgres";

revoke delete on table "auth"."identities" from "postgres";

revoke insert on table "auth"."identities" from "postgres";

revoke references on table "auth"."identities" from "postgres";

revoke select on table "auth"."identities" from "postgres";

revoke trigger on table "auth"."identities" from "postgres";

revoke truncate on table "auth"."identities" from "postgres";

revoke update on table "auth"."identities" from "postgres";

revoke delete on table "auth"."instances" from "postgres";

revoke insert on table "auth"."instances" from "postgres";

revoke references on table "auth"."instances" from "postgres";

revoke select on table "auth"."instances" from "postgres";

revoke trigger on table "auth"."instances" from "postgres";

revoke truncate on table "auth"."instances" from "postgres";

revoke update on table "auth"."instances" from "postgres";

revoke delete on table "auth"."mfa_amr_claims" from "postgres";

revoke insert on table "auth"."mfa_amr_claims" from "postgres";

revoke references on table "auth"."mfa_amr_claims" from "postgres";

revoke select on table "auth"."mfa_amr_claims" from "postgres";

revoke trigger on table "auth"."mfa_amr_claims" from "postgres";

revoke truncate on table "auth"."mfa_amr_claims" from "postgres";

revoke update on table "auth"."mfa_amr_claims" from "postgres";

revoke delete on table "auth"."mfa_challenges" from "postgres";

revoke insert on table "auth"."mfa_challenges" from "postgres";

revoke references on table "auth"."mfa_challenges" from "postgres";

revoke select on table "auth"."mfa_challenges" from "postgres";

revoke trigger on table "auth"."mfa_challenges" from "postgres";

revoke truncate on table "auth"."mfa_challenges" from "postgres";

revoke update on table "auth"."mfa_challenges" from "postgres";

revoke delete on table "auth"."mfa_factors" from "postgres";

revoke insert on table "auth"."mfa_factors" from "postgres";

revoke references on table "auth"."mfa_factors" from "postgres";

revoke select on table "auth"."mfa_factors" from "postgres";

revoke trigger on table "auth"."mfa_factors" from "postgres";

revoke truncate on table "auth"."mfa_factors" from "postgres";

revoke update on table "auth"."mfa_factors" from "postgres";

revoke delete on table "auth"."one_time_tokens" from "postgres";

revoke insert on table "auth"."one_time_tokens" from "postgres";

revoke references on table "auth"."one_time_tokens" from "postgres";

revoke select on table "auth"."one_time_tokens" from "postgres";

revoke trigger on table "auth"."one_time_tokens" from "postgres";

revoke truncate on table "auth"."one_time_tokens" from "postgres";

revoke update on table "auth"."one_time_tokens" from "postgres";

revoke delete on table "auth"."refresh_tokens" from "postgres";

revoke insert on table "auth"."refresh_tokens" from "postgres";

revoke references on table "auth"."refresh_tokens" from "postgres";

revoke select on table "auth"."refresh_tokens" from "postgres";

revoke trigger on table "auth"."refresh_tokens" from "postgres";

revoke truncate on table "auth"."refresh_tokens" from "postgres";

revoke update on table "auth"."refresh_tokens" from "postgres";

revoke delete on table "auth"."saml_providers" from "postgres";

revoke insert on table "auth"."saml_providers" from "postgres";

revoke references on table "auth"."saml_providers" from "postgres";

revoke select on table "auth"."saml_providers" from "postgres";

revoke trigger on table "auth"."saml_providers" from "postgres";

revoke truncate on table "auth"."saml_providers" from "postgres";

revoke update on table "auth"."saml_providers" from "postgres";

revoke delete on table "auth"."saml_relay_states" from "postgres";

revoke insert on table "auth"."saml_relay_states" from "postgres";

revoke references on table "auth"."saml_relay_states" from "postgres";

revoke select on table "auth"."saml_relay_states" from "postgres";

revoke trigger on table "auth"."saml_relay_states" from "postgres";

revoke truncate on table "auth"."saml_relay_states" from "postgres";

revoke update on table "auth"."saml_relay_states" from "postgres";

revoke select on table "auth"."schema_migrations" from "postgres";

revoke delete on table "auth"."sessions" from "postgres";

revoke insert on table "auth"."sessions" from "postgres";

revoke references on table "auth"."sessions" from "postgres";

revoke select on table "auth"."sessions" from "postgres";

revoke trigger on table "auth"."sessions" from "postgres";

revoke truncate on table "auth"."sessions" from "postgres";

revoke update on table "auth"."sessions" from "postgres";

revoke delete on table "auth"."sso_domains" from "postgres";

revoke insert on table "auth"."sso_domains" from "postgres";

revoke references on table "auth"."sso_domains" from "postgres";

revoke select on table "auth"."sso_domains" from "postgres";

revoke trigger on table "auth"."sso_domains" from "postgres";

revoke truncate on table "auth"."sso_domains" from "postgres";

revoke update on table "auth"."sso_domains" from "postgres";

revoke delete on table "auth"."sso_providers" from "postgres";

revoke insert on table "auth"."sso_providers" from "postgres";

revoke references on table "auth"."sso_providers" from "postgres";

revoke select on table "auth"."sso_providers" from "postgres";

revoke trigger on table "auth"."sso_providers" from "postgres";

revoke truncate on table "auth"."sso_providers" from "postgres";

revoke update on table "auth"."sso_providers" from "postgres";

revoke delete on table "auth"."users" from "postgres";

revoke insert on table "auth"."users" from "postgres";

revoke references on table "auth"."users" from "postgres";

revoke select on table "auth"."users" from "postgres";

revoke trigger on table "auth"."users" from "postgres";

revoke truncate on table "auth"."users" from "postgres";

revoke update on table "auth"."users" from "postgres";

revoke delete on table "storage"."buckets" from "anon";

revoke insert on table "storage"."buckets" from "anon";

revoke references on table "storage"."buckets" from "anon";

revoke select on table "storage"."buckets" from "anon";

revoke trigger on table "storage"."buckets" from "anon";

revoke truncate on table "storage"."buckets" from "anon";

revoke update on table "storage"."buckets" from "anon";

revoke delete on table "storage"."buckets" from "authenticated";

revoke insert on table "storage"."buckets" from "authenticated";

revoke references on table "storage"."buckets" from "authenticated";

revoke select on table "storage"."buckets" from "authenticated";

revoke trigger on table "storage"."buckets" from "authenticated";

revoke truncate on table "storage"."buckets" from "authenticated";

revoke update on table "storage"."buckets" from "authenticated";

revoke delete on table "storage"."buckets" from "postgres";

revoke insert on table "storage"."buckets" from "postgres";

revoke references on table "storage"."buckets" from "postgres";

revoke select on table "storage"."buckets" from "postgres";

revoke trigger on table "storage"."buckets" from "postgres";

revoke truncate on table "storage"."buckets" from "postgres";

revoke update on table "storage"."buckets" from "postgres";

revoke delete on table "storage"."buckets" from "service_role";

revoke insert on table "storage"."buckets" from "service_role";

revoke references on table "storage"."buckets" from "service_role";

revoke select on table "storage"."buckets" from "service_role";

revoke trigger on table "storage"."buckets" from "service_role";

revoke truncate on table "storage"."buckets" from "service_role";

revoke update on table "storage"."buckets" from "service_role";

revoke delete on table "storage"."objects" from "anon";

revoke insert on table "storage"."objects" from "anon";

revoke references on table "storage"."objects" from "anon";

revoke select on table "storage"."objects" from "anon";

revoke trigger on table "storage"."objects" from "anon";

revoke truncate on table "storage"."objects" from "anon";

revoke update on table "storage"."objects" from "anon";

revoke delete on table "storage"."objects" from "authenticated";

revoke insert on table "storage"."objects" from "authenticated";

revoke references on table "storage"."objects" from "authenticated";

revoke select on table "storage"."objects" from "authenticated";

revoke trigger on table "storage"."objects" from "authenticated";

revoke truncate on table "storage"."objects" from "authenticated";

revoke update on table "storage"."objects" from "authenticated";

revoke delete on table "storage"."objects" from "postgres";

revoke insert on table "storage"."objects" from "postgres";

revoke references on table "storage"."objects" from "postgres";

revoke select on table "storage"."objects" from "postgres";

revoke trigger on table "storage"."objects" from "postgres";

revoke truncate on table "storage"."objects" from "postgres";

revoke update on table "storage"."objects" from "postgres";

revoke delete on table "storage"."objects" from "service_role";

revoke insert on table "storage"."objects" from "service_role";

revoke references on table "storage"."objects" from "service_role";

revoke select on table "storage"."objects" from "service_role";

revoke trigger on table "storage"."objects" from "service_role";

revoke truncate on table "storage"."objects" from "service_role";

revoke update on table "storage"."objects" from "service_role";

revoke select on table "storage"."s3_multipart_uploads" from "anon";

revoke select on table "storage"."s3_multipart_uploads" from "authenticated";

revoke delete on table "storage"."s3_multipart_uploads" from "service_role";

revoke insert on table "storage"."s3_multipart_uploads" from "service_role";

revoke references on table "storage"."s3_multipart_uploads" from "service_role";

revoke select on table "storage"."s3_multipart_uploads" from "service_role";

revoke trigger on table "storage"."s3_multipart_uploads" from "service_role";

revoke truncate on table "storage"."s3_multipart_uploads" from "service_role";

revoke update on table "storage"."s3_multipart_uploads" from "service_role";

revoke select on table "storage"."s3_multipart_uploads_parts" from "anon";

revoke select on table "storage"."s3_multipart_uploads_parts" from "authenticated";

revoke delete on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke insert on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke references on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke select on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke trigger on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke truncate on table "storage"."s3_multipart_uploads_parts" from "service_role";

revoke update on table "storage"."s3_multipart_uploads_parts" from "service_role";


  create policy "Allow authenticated deletes"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'form-files'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Allow authenticated downloads"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'form-files'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Allow authenticated updates"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'form-files'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Allow authenticated uploads"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'form-files'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Anonymous users can upload files to public forms"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'form-files'::text) AND (auth.role() = 'anon'::text) AND (name ~ '^forms/[^/]+/[^/]+/.*'::text) AND (EXISTS ( SELECT 1
   FROM forms
  WHERE (((forms.id)::text = split_part(objects.name, '/'::text, 2)) AND (forms.is_published = true))))));



  create policy "Deny all deletes"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (false);



