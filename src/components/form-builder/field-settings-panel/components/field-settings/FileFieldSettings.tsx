"use client";

import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/lib/database";

interface FileFieldSettingsProps {
  field: FormField;
  onUpdateSettings: (updates: Partial<FormField["settings"]>) => void;
  onFieldUpdate: (field: FormField) => void;
}

interface FileFieldSettings {
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  helpText?: string;
}

const COMMON_FILE_TYPES = [
  {
    label: "Images",
    value: "image/*",
    extensions: ["jpg", "jpeg", "png", "gif", "webp"],
  },
  {
    label: "Documents",
    value:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: ["pdf", "doc", "docx"],
  },
  {
    label: "Spreadsheets",
    value:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensions: ["xls", "xlsx"],
  },
  {
    label: "Videos",
    value: "video/*",
    extensions: ["mp4", "avi", "mov", "wmv"],
  },
  {
    label: "Audio",
    value: "audio/*",
    extensions: ["mp3", "wav", "flac", "m4a"],
  },
  {
    label: "Archives",
    value:
      "application/zip,application/x-rar-compressed,application/x-7z-compressed",
    extensions: ["zip", "rar", "7z"],
  },
];

const SIZE_PRESETS = [
  { label: "1 MB", value: 1024 * 1024 },
  { label: "5 MB", value: 5 * 1024 * 1024 },
  { label: "10 MB", value: 10 * 1024 * 1024 },
  { label: "25 MB", value: 25 * 1024 * 1024 },
  { label: "50 MB", value: 50 * 1024 * 1024 },
];

export function FileFieldSettings({
  field,
  onUpdateSettings,
}: FileFieldSettingsProps) {
  const settings = (field.settings as FileFieldSettings) || {};
  const {
    accept = "image/*,application/pdf,video/*,audio/*,text/*,application/zip",
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = [],
    helpText = "",
  } = settings;

  const updateSetting = (key: keyof FileFieldSettings, value: any) => {
    onUpdateSettings({
      [key]: value,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
  };

  const updateAcceptAttribute = (types: string[]) => {
    // Generate accept attribute from allowed types
    const acceptTypes = types.map((type) => `.${type}`).join(",");
    const fullAccept =
      acceptTypes ||
      "image/*,application/pdf,video/*,audio/*,text/*,application/zip";
    updateSetting("accept", fullAccept);
  };

  const addFileType = (type: string) => {
    if (!allowedTypes.includes(type)) {
      const newTypes = [...allowedTypes, type];
      updateSetting("allowedTypes", newTypes);
      updateAcceptAttribute(newTypes);
    }
  };

  const removeFileType = (type: string) => {
    const newTypes = allowedTypes.filter((t) => t !== type);
    updateSetting("allowedTypes", newTypes);
    updateAcceptAttribute(newTypes);
  };

  const toggleCommonType = (typeConfig: (typeof COMMON_FILE_TYPES)[0]) => {
    const hasAllExtensions = typeConfig.extensions.every((ext) =>
      allowedTypes.includes(ext)
    );

    let newTypes: string[];
    if (hasAllExtensions) {
      // Remove all extensions of this type
      newTypes = allowedTypes.filter(
        (type) => !typeConfig.extensions.includes(type)
      );
    } else {
      // Add all extensions of this type
      newTypes = [...new Set([...allowedTypes, ...typeConfig.extensions])];
    }

    updateSetting("allowedTypes", newTypes);
    updateAcceptAttribute(newTypes);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Settings */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="maxFiles">Maximum Files</Label>
          <Input
            id="maxFiles"
            max="50"
            min="1"
            onChange={(e) =>
              updateSetting("maxFiles", Number.parseInt(e.target.value) || 1)
            }
            placeholder="10"
            type="number"
            value={maxFiles}
          />
          <p className="text-muted-foreground text-xs">
            Maximum number of files users can upload (1-50)
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="maxSize">Maximum File Size</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="maxSize"
              min="1"
              onChange={(e) =>
                updateSetting(
                  "maxSize",
                  (Number.parseInt(e.target.value) || 1) * 1024 * 1024
                )
              }
              placeholder="50"
              type="number"
              value={Math.round(maxSize / (1024 * 1024))}
            />
            <span className="flex items-center px-3 text-muted-foreground text-sm">
              MB
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {SIZE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                onClick={() => updateSetting("maxSize", preset.value)}
                size="sm"
                variant={maxSize === preset.value ? "default" : "outline"}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Current: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* File Type Settings */}
      <div className="flex flex-col gap-4">
        <Label>Allowed File Types</Label>

        {/* Common file type toggles */}
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_FILE_TYPES.map((typeConfig) => {
              const hasAllExtensions = typeConfig.extensions.every((ext) =>
                allowedTypes.includes(ext)
              );
              return (
                <Button
                  key={typeConfig.label}
                  onClick={() => toggleCommonType(typeConfig)}
                  size="sm"
                  variant={hasAllExtensions ? "default" : "outline"}
                >
                  {typeConfig.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom file types */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="customType">Custom File Extensions:</Label>
          <div className="flex gap-2">
            <Input
              id="customType"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    addFileType(value);
                    e.currentTarget.value = "";
                  }
                }
              }}
              placeholder="e.g., txt, csv, json"
            />
            <Button
              onClick={() => {
                const input = document.getElementById(
                  "customType"
                ) as HTMLInputElement;
                const value = input.value.trim();
                if (value) {
                  addFileType(value);
                  input.value = "";
                }
              }}
              size="sm"
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Display selected types */}
        {allowedTypes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
              Selected extensions:
            </p>
            <div className="flex flex-wrap gap-1">
              {allowedTypes.map((type) => (
                <Badge className="gap-1" key={type} variant="secondary">
                  .{type}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => removeFileType(type)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Accept attribute (readonly) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="accept">HTML Accept Attribute (readonly)</Label>
          <Input
            className="font-mono text-xs"
            id="accept"
            readOnly
            value={accept}
          />
          <p className="text-muted-foreground text-xs">
            This is automatically generated based on your selections above
          </p>
        </div>
      </div>

      {/* Help Text */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="helpText">Help Text</Label>
        <Textarea
          id="helpText"
          onChange={(e) => updateSetting("helpText", e.target.value)}
          placeholder="Additional instructions for users..."
          rows={2}
          value={helpText}
        />
        <p className="text-muted-foreground text-xs">
          Optional instructions to help users understand what files to upload
        </p>
      </div>
    </div>
  );
}
