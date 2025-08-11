"use client";

import React, { useCallback, useState, useEffect, useMemo } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
} from "lucide-react";
import type { BaseFieldProps } from "../types";

interface FileUploadSettings {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  signedUrl: string;
}

export function FileUploadField({
  field,
  value,
  onChange,
  error,
  disabled,
  formId,
}: BaseFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fallbackFormId = useMemo(() => {
    if (formId) return formId;
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const match = path.match(/^\/f\/([^/]+)/);
      return match?.[1] || null;
    }
    return null;
  }, [formId]);

  const settings = useMemo(
    () => field.settings as FileUploadSettings,
    [field.settings],
  );
  const maxSize = settings?.maxSize || 50 * 1024 * 1024;
  const maxFiles = settings?.maxFiles || 10;
  const accept =
    settings?.accept ||
    "image/*,application/pdf,video/*,audio/*,text/*,application/zip";

  const uploadedFiles: UploadedFile[] = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  useEffect(() => {
    if (value === undefined || value === null || value === "") {
      onChange([]);
    }
  }, []);

  const getFileIcon = useCallback((type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("audio/")) return Music;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    if (type.includes("zip") || type.includes("archive")) return Archive;
    return FileText;
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
  }, []);

  const handleUpload = useCallback(
    async (files: File[]) => {
      const actualFormId = fallbackFormId;

      if (!actualFormId) {
        const mockFiles = files.map((file, index) => ({
          id: `preview-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: `preview/${file.name}`,
          signedUrl: URL.createObjectURL(file),
        }));

        const currentFiles = Array.isArray(value) ? value : [];
        onChange([...currentFiles, ...mockFiles]);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("formId", actualFormId);
          formData.append("fieldId", field.id);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Upload failed");
          }

          const result = await response.json();
          return result.file;
        });

        const newUploadedFiles = await Promise.all(uploadPromises);
        const currentFiles = Array.isArray(value) ? value : [];
        onChange([...currentFiles, ...newUploadedFiles]);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed",
        );
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [fallbackFormId, field.id, value, onChange],
  );

  const handleRemoveFile = useCallback(
    (fileId: string) => {
      const currentFiles = Array.isArray(value) ? value : [];
      const fileToRemove = currentFiles.find((file) => file.id === fileId);

      if (fileToRemove && fileToRemove.signedUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.signedUrl);
      }

      onChange(currentFiles.filter((file) => file.id !== fileId));
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-4">
      {!fallbackFormId && (
        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
          📋 Preview Mode - Files will be shown for demo purposes
        </div>
      )}

      <FileUpload
        accept={accept}
        disabled={disabled || isUploading}
        maxFiles={maxFiles - uploadedFiles.length}
        maxSize={maxSize}
        multiple={maxFiles > 1}
        onUpload={handleUpload}
        variant="default"
        className="bg-input shadow-sm/2"
        showPreview={false}
      />

      {uploadError && (
        <Alert variant="destructive">
          <p className="font-medium">Upload Error</p>
          <p className="text-sm">{uploadError}</p>
        </Alert>
      )}

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid gap-2">
            {uploadedFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              const isImage = file.type.startsWith("image/");

              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  {/* File preview or icon */}
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <img
                        src={file.signedUrl}
                        alt={file.name}
                        className="h-10 w-10 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      <Badge variant="secondary" size="sm">
                        Uploaded
                      </Badge>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
                    disabled={disabled}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File constraints info */}
      <div className="text-xs text-muted-foreground">
        <p>
          Max {maxFiles} files, up to {formatFileSize(maxSize)} each
        </p>
        {settings?.allowedTypes && (
          <p>Allowed types: {settings.allowedTypes.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
