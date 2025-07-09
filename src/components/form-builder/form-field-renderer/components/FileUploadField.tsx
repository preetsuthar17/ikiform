import React, { useRef, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { createClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";
import type { BaseFieldProps } from "../types";

const MAX_SIZE_MB = 50;

export function FileUploadField({
  field,
  value,
  onChange,
  error,
}: BaseFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supabase = createClient();

  const maxFiles = field.settings?.maxFiles || 1;
  const allowedTypes = field.settings?.allowedTypes?.join(",") || "";
  const allowMultiple = field.settings?.allowMultiple || false;
  const maxSizeMB = field.settings?.maxSizeMB || MAX_SIZE_MB;
  const fileLabel = field.settings?.fileLabel || "Upload file(s)";
  const filePlaceholder = field.settings?.filePlaceholder || "Choose file(s)";

  const handleUpload = async (files: File[]) => {
    setUploadError(null);
    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of files.slice(0, maxFiles)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setUploadError(`File too large: ${file.name} (max ${maxSizeMB}MB)`);
        continue;
      }
      let uploadFile = file;
      if (file.type.startsWith("image/")) {
        try {
          uploadFile = await imageCompression(file, {
            maxSizeMB: Math.min(maxSizeMB, 5),
            maxWidthOrHeight: 1920,
          });
        } catch (err) {
          setUploadError(`Image compression failed: ${file.name}`);
          continue;
        }
      }
      const filePath = `form-uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("form-uploads")
        .upload(filePath, uploadFile, { upsert: true });
      if (uploadErr) {
        setUploadError(`Upload failed: ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage
        .from("form-uploads")
        .getPublicUrl(filePath);
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    setUploading(false);
    if (uploadedUrls.length) {
      onChange(allowMultiple ? uploadedUrls : uploadedUrls[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm">{fileLabel}</label>
      <FileUpload
        accept={allowedTypes}
        multiple={allowMultiple}
        maxFiles={maxFiles}
        maxSize={maxSizeMB * 1024 * 1024}
        disabled={uploading}
        onUpload={handleUpload}
        showPreview
      />
      {uploadError && (
        <div className="text-destructive text-xs mt-1">{uploadError}</div>
      )}
    </div>
  );
}
