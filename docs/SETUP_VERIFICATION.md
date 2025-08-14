# Setup Verification Guide

After running the Supabase setup scripts, use this guide to verify everything is working correctly.

## Quick Verification Checklist

### 1. Database Tables
Run this query in Supabase SQL Editor to check all tables exist:

```sql
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'forms', 'form_submissions', 'ai_builder_chat', 'ai_analytics_chat', 'redemption_codes')
ORDER BY tablename;
```

Expected result: 6 rows showing all tables.

### 2. Storage Bucket
Check the storage bucket exists:

```sql
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'form-files';
```

Expected result: 1 row with bucket details.

### 3. RLS Policies
Verify RLS is enabled on all tables:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'forms', 'form_submissions', 'ai_builder_chat', 'ai_analytics_chat', 'redemption_codes');
```

Expected result: All tables should have `rowsecurity = true`.

### 4. Functions and Triggers
Check that the user creation trigger exists:

```sql
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

Expected result: 1 row showing the trigger on auth.users table.

### 5. Test User Creation
Try creating a test user through your application's signup flow to verify:
- User profile is automatically created
- No permission errors occur
- User can access their own data

### 6. Test File Upload
Try uploading a file through a form to verify:
- Storage policies work correctly
- Files are saved to the correct bucket
- Proper file path structure is maintained

## Common Issues and Solutions

### Issue: "relation does not exist" errors
**Solution**: Make sure you ran the database schema script first.

### Issue: "permission denied" errors
**Solution**: Check that RLS policies are properly created and auth is working.

### Issue: File upload fails
**Solution**: Verify storage bucket exists and storage policies are correctly set.

### Issue: User profile not created on signup
**Solution**: Check that the `handle_new_user` function and trigger exist.

## Manual Testing Steps

1. **Sign up a new user**
   - Go to your app's signup page
   - Create a new account
   - Verify user profile appears in `public.users` table

2. **Create a form**
   - Create a new form in the form builder
   - Verify it appears in `public.forms` table
   - Check that `user_id` matches your auth user

3. **Submit to a form**
   - Fill out and submit a form
   - Verify submission appears in `public.form_submissions` table
   - Check that data is properly stored

4. **Upload a file**
   - Add a file upload field to a form
   - Upload a test file
   - Verify file appears in storage bucket

If all these steps pass, your Supabase setup is working correctly!