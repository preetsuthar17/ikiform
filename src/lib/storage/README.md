# File Upload System Documentation

## Overview

This file upload system provides comprehensive file handling capabilities for forms with Supabase storage integration, including proper organization, security, and analytics support.

## Features

- ✅ **File Upload Field** - Custom form field with drag & drop support
- ✅ **Configurable Settings** - File types, size limits, quantity limits
- ✅ **Private Supabase Storage** - Secure private cloud storage with RLS policies
- ✅ **Analytics Integration** - File preview and statistics in form analytics
- ✅ **Multiple File Types** - Images, documents, videos, audio, archives
- ✅ **Security & Validation** - Size limits, type restrictions, user permissions

## Setup Instructions

### 1. Supabase Storage Setup

Run the SQL commands in `src/lib/storage/supabase-setup.sql` in your Supabase SQL editor:

```sql
-- This will create:
-- - 'form-files' PRIVATE storage bucket (not publicly accessible)
-- - Row Level Security policies for controlled access
-- - Helper functions for file management
-- - Indexes for performance
```

### 2. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. File Structure

Files are organized in Supabase storage as:

```
form-files/
├── forms/{form_id}/{field_id}/
│   └── {timestamp}_{random_id}.{extension}
└── submissions/{submission_id}/{field_id}/
    └── {timestamp}_{random_id}.{extension}
```

## Usage Guide

### Adding File Upload Fields

1. **In Form Builder**: Drag the "File Upload" field from the palette
2. **Configure Settings**:
   - **Max Files**: 1-50 files (default: 10)
   - **Max Size**: Up to 50MB per file (default: 50MB)
   - **File Types**: Choose from presets or add custom extensions
   - **Required**: Make field mandatory

### File Type Configuration

**Quick Select Presets**:
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf, doc, docx
- Spreadsheets: xls, xlsx
- Videos: mp4, avi, mov, wmv
- Audio: mp3, wav, flac, m4a
- Archives: zip, rar, 7z

**Custom Extensions**: Add any file extension (e.g., txt, csv, json)

### Data Structure

Files are stored as arrays of objects:

```typescript
interface UploadedFile {
  id: string;           // Unique file identifier
  name: string;         // Original filename
  size: number;         // File size in bytes
  type: string;         // MIME type
  url: string;          // Storage path
  signedUrl: string;    // Secure signed URL (expires in 24 hours)
}
```

## Security Features

### Row Level Security (RLS)

- **Upload**: Users can only upload to their own forms
- **View**: Users can only access files from their forms via signed URLs
- **Delete**: Users can only delete files from their forms
- **Private Access**: All files require authentication and signed URLs

### File Validation

- **Size Limits**: Configurable up to 50MB per file
- **Type Restrictions**: MIME type validation
- **Quantity Limits**: Configurable maximum files per field

### Storage Policies

1. **User Ownership**: Files linked to form ownership
2. **Submission Context**: Files linked to specific submissions
3. **Cleanup Functions**: Automatic orphaned file removal

## Analytics Integration

### Submission Details

Files are displayed with:
- **Image Previews**: Thumbnail display for images
- **File Information**: Name, size, type badges
- **Download Links**: Direct access to files
- **Type Indicators**: Visual icons for different file types

### Submissions List

File uploads show:
- **File Count**: Number of uploaded files
- **Type Indicators**: Image preview thumbnails
- **Quick Stats**: File counts and types

### Field Analytics

File fields provide:
- **Upload Rates**: Completion statistics
- **File Type Distribution**: Most common file types
- **Usage Patterns**: Upload frequency analysis

## API Reference

### Upload Endpoint

```typescript
POST /api/upload

// FormData fields:
// - file: File object
// - formId: Form UUID
// - fieldId: Field UUID
// - submissionId: Submission UUID (optional)

// Response:
{
  success: true,
  file: {
    id: string,
    name: string,
    size: number,
    type: string,
    url: string,
    signedUrl: string
  }
}
```

### Storage Functions

```typescript
// Upload file
uploadFile(file: File, formId: string, fieldId: string, submissionId?: string)

// Delete file
deleteFile(filePath: string)

// Get signed URL
getSignedUrl(filePath: string, expiresIn?: number)

// Refresh multiple signed URLs
refreshSignedUrls(filePaths: string[], expiresIn?: number)

// List files
listFiles(folderPath: string)
```

## Performance Considerations

### Optimizations

- **Lazy Loading**: Large file lists are paginated
- **Signed URL Caching**: URLs cached for 24 hours to reduce API calls
- **CDN Delivery**: Supabase provides global CDN access
- **Efficient Queries**: Indexed file lookups

### Best Practices

1. **File Naming**: Unique timestamps prevent conflicts
2. **Type Validation**: Client and server-side validation
3. **Size Limits**: Prevent abuse with reasonable limits
4. **URL Expiration**: Signed URLs expire after 24 hours for security
5. **Cleanup**: Periodic removal of orphaned files

## Error Handling

### Common Errors

- **File Too Large**: Size exceeds configured limit
- **Invalid Type**: File type not allowed
- **Upload Failed**: Network or storage issues
- **Permission Denied**: RLS policy restrictions
- **URL Expired**: Signed URL has expired (refresh required)

### Error Messages

All errors include user-friendly messages with specific guidance on resolution.

## Monitoring

### Helper Functions

```sql
-- Get file statistics for a form
SELECT * FROM get_form_file_stats('form-uuid');

-- Clean up orphaned files
SELECT cleanup_orphaned_files();
```

### Storage Metrics

Monitor via Supabase dashboard:
- Storage usage by bucket
- Upload/download bandwidth
- Request counts and errors

## Troubleshooting

### Common Issues

1. **RLS Errors**: Check user authentication and form ownership
2. **Upload Failures**: Verify file size and type restrictions
3. **Missing Files**: Check storage bucket configuration
4. **Slow Uploads**: Consider file size and network conditions

### Debug Steps

1. Check browser network tab for API errors
2. Verify Supabase storage bucket exists
3. Confirm RLS policies are active
4. Test with small files first

## Future Enhancements

### Planned Features

- **Image Resizing**: Automatic thumbnail generation
- **Virus Scanning**: File safety validation
- **Cloud Processing**: Server-side file processing
- **Webhook Integration**: File upload notifications
- **Advanced Analytics**: Detailed file usage metrics

### Customization Options

- **Custom Storage Providers**: Support for AWS S3, Google Cloud
- **Processing Pipelines**: Custom file processing workflows
- **Advanced Validation**: Custom file validation rules
- **Metadata Extraction**: Automatic file metadata parsing
