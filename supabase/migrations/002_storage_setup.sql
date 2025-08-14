-- ============================================================================
-- Ikiform Storage Setup
-- ============================================================================
-- Run this script after the database schema to set up file storage
-- ============================================================================

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
      52428800, -- 50MB limit
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

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy 1: Allow authenticated users to upload files to their own forms
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

-- Policy 2: Allow anonymous users to upload files to public forms
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

-- Policy 3: Allow authenticated users to view files from their forms
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

-- Policy 4: Allow authenticated users to view files from published forms they have access to
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

-- Policy 5: Allow users to delete files from their forms
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

-- Policy 6: Allow users to update file metadata for their forms
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

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_form_id ON storage.objects (bucket_id, (split_part(name, '/', 2))) WHERE bucket_id = 'form-files' AND name ~ '^forms/[^/]+/[^/]+/.*';
CREATE INDEX IF NOT EXISTS idx_storage_objects_submission_id ON storage.objects (bucket_id, (split_part(name, '/', 2))) WHERE bucket_id = 'form-files' AND name ~ '^submissions/[^/]+/[^/]+/.*';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Helper function to get file stats for a form
CREATE OR REPLACE FUNCTION get_form_file_stats(form_id_param UUID)
RETURNS TABLE (
  total_files BIGINT,
  total_size_bytes BIGINT,
  file_types TEXT[]
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM((metadata->>'size')::BIGINT), 0) as total_size_bytes,
    ARRAY_AGG(DISTINCT (metadata->>'mimetype')) FILTER (WHERE metadata->>'mimetype' IS NOT NULL) as file_types
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
  -- Clean up orphaned form files
  DELETE FROM storage.objects 
  WHERE bucket_id = 'form-files' 
  AND name ~ '^forms/[^/]+/[^/]+/.*'
  AND NOT EXISTS (
    SELECT 1 FROM forms 
    WHERE id::text = split_part(name, '/', 2)
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Clean up orphaned submission files
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