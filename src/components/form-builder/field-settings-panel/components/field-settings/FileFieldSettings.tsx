"use client";

import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="gap-2 p-4 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">File Upload Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="maxFiles">
            Maximum Files
          </Label>
          <Input
            aria-describedby="maxFiles-help"
            autoComplete="off"
            id="maxFiles"
            max="50"
            min="1"
            name="maxFiles"
            onChange={(e) =>
              updateSetting("maxFiles", Number.parseInt(e.target.value) || 1)
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              }
            }}
            placeholder="10"
            type="number"
            value={maxFiles}
          />
          <p className="text-muted-foreground text-xs" id="maxFiles-help">
            Maximum number of files users can upload (1-50)
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="maxSize">
            Maximum File Size
          </Label>
          <div className="flex gap-2">
            <Input
              aria-describedby="maxSize-help"
              autoComplete="off"
              className="flex-1"
              id="maxSize"
              min="1"
              name="maxSize"
              onChange={(e) =>
                updateSetting(
                  "maxSize",
                  (Number.parseInt(e.target.value) || 1) * 1024 * 1024
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.currentTarget.blur();
                }
              }}
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
                aria-label={`Set maximum file size to ${preset.label}`}
                className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                key={preset.label}
                onClick={() => updateSetting("maxSize", preset.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    updateSetting("maxSize", preset.value);
                  }
                }}
                size="sm"
                variant={maxSize === preset.value ? "default" : "outline"}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <p className="text-muted-foreground text-xs" id="maxSize-help">
            Current: {formatFileSize(maxSize)}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Label className="font-medium text-sm" htmlFor="allowed-file-types">
            Allowed File Types
          </Label>

          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_FILE_TYPES.map((typeConfig) => {
                const hasAllExtensions = typeConfig.extensions.every((ext) =>
                  allowedTypes.includes(ext)
                );
                return (
                  <Button
                    aria-label={`Toggle ${typeConfig.label} file types`}
                    className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    key={typeConfig.label}
                    onClick={() => toggleCommonType(typeConfig)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleCommonType(typeConfig);
                      }
                    }}
                    size="sm"
                    variant={hasAllExtensions ? "default" : "outline"}
                  >
                    {typeConfig.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-medium text-sm" htmlFor="customType">
              Custom File Extensions
            </Label>
            <div className="flex gap-2">
              <Input
                aria-describedby="customType-help"
                autoComplete="off"
                id="customType"
                name="customType"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.blur();
                  }
                }}
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
                type="text"
              />
              <Button
                aria-label="Add custom file extension"
                className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const input = document.getElementById(
                      "customType"
                    ) as HTMLInputElement;
                    const value = input.value.trim();
                    if (value) {
                      addFileType(value);
                      input.value = "";
                    }
                  }
                }}
                size="icon"
                type="button"
              >
                <Plus aria-hidden="true" className="size-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs" id="customType-help">
              Add custom file extensions (without the dot)
            </p>
          </div>

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
                      aria-label={`Remove ${type} file extension`}
                      className="ml-1 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      onClick={() => removeFileType(type)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          removeFileType(type);
                        }
                      }}
                    >
                      <X aria-hidden="true" className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="font-medium text-sm" htmlFor="accept">
              HTML Accept Attribute (readonly)
            </Label>
            <Input
              aria-describedby="accept-help"
              className="font-mono text-xs"
              id="accept"
              name="accept"
              readOnly
              value={accept}
            />
            <p className="text-muted-foreground text-xs" id="accept-help">
              This is automatically generated based on your selections above
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-medium text-sm" htmlFor="helpText">
            Help Text
          </Label>
          <Textarea
            aria-describedby="helpText-help"
            className="resize-none"
            id="helpText"
            name="helpText"
            onChange={(e) => updateSetting("helpText", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.currentTarget.blur();
              } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            placeholder="Additional instructions for users..."
            rows={2}
            value={helpText}
          />
          <p className="text-muted-foreground text-xs" id="helpText-help">
            Optional instructions to help users understand what files to upload
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
