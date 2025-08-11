-- Create the form-files storage bucket (PRIVATE) if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'form-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'form-files',
      'form-files',
      false,
      52428800,
      ARRAY[
        'image/*',
        'video/*',
        'audio/*',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        'application/json',
        'application/zip',
        'application/x-rar-compressed', 
        'application/x-7z-compressed'
      ]
    );
  END IF;
END
$$;

-- RLS Policies for form-files bucket
-- NOTE: The following RLS and index statements require ownership of the storage.objects table.
-- If you are not the owner, you must run these as the storage schema owner (typically the service_role in Supabase).
-- You can use the Supabase dashboard SQL editor as an owner, or run these as a migration with elevated privileges.

-- Policy 1: Allow authenticated users to upload files to their own forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload files to their forms' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Users can upload files to their forms" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'form-files' 
        AND auth.role() = 'authenticated'
        AND (
          (name ~ '^forms/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM forms 
             WHERE id::text = split_part(name, '/', 2) 
             AND user_id = auth.uid()
           ))
          OR 
          (name ~ '^submissions/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM form_submissions fs
             JOIN forms f ON f.id = fs.form_id
             WHERE fs.id::text = split_part(name, '/', 2) 
             AND f.user_id = auth.uid()
           ))
        )
      );
    $pol$;
  END IF;
END
$$;

-- Policy 1.5: Allow anonymous users to upload files to public forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anonymous users can upload files to public forms' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Anonymous users can upload files to public forms" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'form-files' 
        AND auth.role() = 'anon'
        AND name ~ '^forms/[^/]+/[^/]+/.*'
        AND EXISTS (
          SELECT 1 FROM forms 
          WHERE id::text = split_part(name, '/', 2) 
          AND is_published = true
        )
      );
    $pol$;
  END IF;
END
$$;

-- Policy 2: Allow authenticated users to view files from their forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view files from their forms' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Users can view files from their forms" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'form-files' 
        AND auth.role() = 'authenticated'
        AND (
          (name ~ '^forms/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM forms 
             WHERE id::text = split_part(name, '/', 2) 
             AND user_id = auth.uid()
           ))
          OR 
          (name ~ '^submissions/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM form_submissions fs
             JOIN forms f ON f.id = fs.form_id
             WHERE fs.id::text = split_part(name, '/', 2) 
             AND f.user_id = auth.uid()
           ))
        )
      );
    $pol$;
  END IF;
END
$$;

-- Policy 3: Allow authenticated users to view files from published forms (controlled access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view files from published forms they have access to' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Users can view files from published forms they have access to" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'form-files' 
        AND auth.role() = 'authenticated'
        AND name ~ '^submissions/[^/]+/[^/]+/.*'
        AND EXISTS (
          SELECT 1 FROM form_submissions fs
          JOIN forms f ON f.id = fs.form_id
          WHERE fs.id::text = split_part(name, '/', 2) 
          AND (f.user_id = auth.uid() OR f.is_published = true)
        )
      );
    $pol$;
  END IF;
END
$$;

-- Policy 4: Allow users to delete files from their forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete files from their forms' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Users can delete files from their forms" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'form-files' 
        AND auth.role() = 'authenticated'
        AND (
          (name ~ '^forms/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM forms 
             WHERE id::text = split_part(name, '/', 2) 
             AND user_id = auth.uid()
           ))
          OR 
          (name ~ '^submissions/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM form_submissions fs
             JOIN forms f ON f.id = fs.form_id
             WHERE fs.id::text = split_part(name, '/', 2) 
             AND f.user_id = auth.uid()
           ))
        )
      );
    $pol$;
  END IF;
END
$$;

-- Policy 5: Allow users to update file metadata for their forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update files from their forms' AND tablename = 'objects' AND schemaname = 'storage'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Users can update files from their forms" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'form-files' 
        AND auth.role() = 'authenticated'
        AND (
          (name ~ '^forms/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM forms 
             WHERE id::text = split_part(name, '/', 2) 
             AND user_id = auth.uid()
           ))
          OR 
          (name ~ '^submissions/[^/]+/[^/]+/.*' AND 
           EXISTS (
             SELECT 1 FROM form_submissions fs
             JOIN forms f ON f.id = fs.form_id
             WHERE fs.id::text = split_part(name, '/', 2) 
             AND f.user_id = auth.uid()
           ))
        )
      );
    $pol$;
  END IF;
END
$$;

-- Enable RLS on storage.objects (must be run as table owner)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'objects' AND n.nspname = 'storage' AND c.relrowsecurity
  ) THEN
    EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;';
  END IF;
END
$$;

-- Create indexes for better performance (must be run as table owner)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'storage' AND tablename = 'objects' AND indexname = 'idx_storage_objects_form_id'
  ) THEN
    EXECUTE 'CREATE INDEX idx_storage_objects_form_id ON storage.objects (bucket_id, (split_part(name, ''/'', 2))) WHERE bucket_id = ''form-files'' AND name ~ ''^forms/[^/]+/[^/]+/.*'';';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'storage' AND tablename = 'objects' AND indexname = 'idx_storage_objects_submission_id'
  ) THEN
    EXECUTE 'CREATE INDEX idx_storage_objects_submission_id ON storage.objects (bucket_id, (split_part(name, ''/'', 2))) WHERE bucket_id = ''form-files'' AND name ~ ''^submissions/[^/]+/[^/]+/.*'';';
  END IF;
END
$$;

-- Helper function to get file stats for a form
CREATE OR REPLACE FUNCTION get_form_file_stats(form_id_param UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size_bytes BIGINT,
  file_types TEXT[]
) LANGUAGE sql SECURITY DEFINER AS $$
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

-- Helper function to clean up orphaned files
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND name ~ '^forms/[^/]+/[^/]+/.*'
  AND NOT EXISTS (
    SELECT 1 FROM forms 
    WHERE id::text = split_part(name, '/', 2)
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND name ~ '^submissions/[^/]+/[^/]+/.*'
  AND NOT EXISTS (
    SELECT 1 FROM form_submissions 
    WHERE id::text = split_part(name, '/', 2)
  );
  
  GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;
