import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export interface FileUploadResult {
  id: string;
  path: string;
  signedUrl: string;
  fullPath: string;
}

export async function uploadFile(
  file: File,
  formId: string,
  fieldId: string,
  submissionId?: string
): Promise<FileUploadResult> {
  try {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomId}.${fileExtension}`;

    const basePath = submissionId
      ? `submissions/${submissionId}/${fieldId}`
      : `forms/${formId}/${fieldId}`;

    const filePath = `${basePath}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('form-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    let signedUrl = '';

    if (supabaseAdmin) {
      const { data: adminUrlData, error: adminUrlError } =
        await supabaseAdmin.storage
          .from('form-files')
          .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (!adminUrlError && adminUrlData) {
        signedUrl = adminUrlData.signedUrl;
      }
    }

    if (!signedUrl) {
      const { data: signedUrlData, error: fallbackError } =
        await supabase.storage
          .from('form-files')
          .createSignedUrl(filePath, 60 * 60 * 24);

      if (!fallbackError && signedUrlData) {
        signedUrl = signedUrlData.signedUrl;
      }
    }

    if (!signedUrl) {
      signedUrl = data.fullPath;
    }

    return {
      id: data.id,
      path: data.path,
      signedUrl,
      fullPath: data.fullPath,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('form-files')
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
}

/**
 * Get signed URL for private file access
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('form-files')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL error:', error);
    throw error;
  }
}

/**
 * Refresh signed URLs for uploaded files
 */
export async function refreshSignedUrls(
  filePaths: string[],
  expiresIn = 86_400
): Promise<Record<string, string>> {
  try {
    const signedUrls: Record<string, string> = {};

    const promises = filePaths.map(async (filePath) => {
      const signedUrl = await getSignedUrl(filePath, expiresIn);
      signedUrls[filePath] = signedUrl;
    });

    await Promise.all(promises);
    return signedUrls;
  } catch (error) {
    console.error('Refresh signed URLs error:', error);
    throw error;
  }
}

/**
 * List files in a directory
 */
export async function listFiles(folderPath: string) {
  try {
    const { data, error } = await supabase.storage
      .from('form-files')
      .list(folderPath);

    if (error) {
      throw new Error(`List files failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(filePath: string) {
  try {
    const { data, error } = await supabase.storage.from('form-files').list('', {
      search: filePath,
    });

    if (error) {
      throw new Error(`Get metadata failed: ${error.message}`);
    }

    return data[0] || null;
  } catch (error) {
    console.error('Get metadata error:', error);
    throw error;
  }
}
