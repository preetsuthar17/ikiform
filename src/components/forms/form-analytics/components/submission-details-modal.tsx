import { Check, Copy, Download } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { OptimizedImage } from "@/components/other/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Form } from "@/lib/database";

import type { SubmissionDetailsModalProps } from "../types";

function getFieldType(
  form: Form | undefined,
  fieldId: string
): string | undefined {
  if (!(form && form.schema)) return;
  const allFields = [
    ...(form.schema.fields || []),
    ...(form.schema.blocks?.flatMap((block) => block.fields || []) || []),
  ];
  return allFields.find((f) => f.id === fieldId)?.type;
}

export const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  submission,
  isOpen,
  onClose,
  getFieldLabel,
  formatDate,
  onExport,
  form,
}) => {
  if (!submission) return null;

  const [copied, setCopied] = useState(false);

  const handleCopySubmissionData = useCallback(async () => {
    if (!submission) return;

    try {
      const submissionText = Object.entries(submission.submission_data)
        .map(
          ([key, value]) =>
            `${getFieldLabel(key)}: ${
              typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value)
            }`
        )
        .join("\n\n");

      const { copyWithToast } = await import("@/lib/utils/clipboard");
      const success = await copyWithToast(
        submissionText,
        "Submission data copied to clipboard",
        "Failed to copy submission data"
      );

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy submission data:", error);
    }
  }, [submission?.submission_data, getFieldLabel]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen, submission?.id]);

  return (
    <Modal key={submission?.id} onOpenChange={onClose} open={isOpen}>
      <ModalContent className="max-w-3xl">
        <ModalHeader className="items-left flex gap-4 border-border border-b">
          <ModalTitle>Submission Details</ModalTitle>
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <div className="flex flex-col gap-4 p-2 md:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">
                {formatDate(submission.submitted_at)}
              </Badge>
              <Badge className="text-xs" variant="secondary">
                ID: {submission.id.slice(-8)}
              </Badge>
            </div>

            {}
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCopySubmissionData}
                      size="icon"
                      variant="secondary"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent size="sm">
                    Copy submission data
                  </TooltipContent>
                </Tooltip>

                {onExport && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onExport(submission)}
                        size="icon"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent size="sm">Export submission</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {Object.entries(submission.submission_data).map(
                ([key, value]) => {
                  const fieldType = getFieldType(form, key);

                  if (
                    fieldType === "signature" &&
                    typeof value === "string" &&
                    value.startsWith("data:image")
                  ) {
                    return (
                      <div
                        className="flex flex-col gap-2 border-border border-b py-4 last:border-0"
                        key={key}
                      >
                        <h3 className="font-medium text-sm">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="ml-2 max-w-xs border-l pl-3">
                          <OptimizedImage
                            alt="Signature"
                            className="h-auto w-full max-w-full rounded-xl border"
                            height={50}
                            src={`${value}`}
                            width={500}
                          />
                        </div>
                      </div>
                    );
                  }

                  if (
                    fieldType === "social" &&
                    typeof value === "object" &&
                    value !== null &&
                    form
                  ) {
                    const allFields = [
                      ...(form.schema.fields || []),
                      ...(form.schema.blocks?.flatMap(
                        (block) => block.fields || []
                      ) || []),
                    ];
                    const field = allFields.find((f) => f.id === key);
                    const customLinks = field?.settings?.customLinks || [];
                    return (
                      <div
                        className="flex flex-col gap-2 border-border border-b py-4 last:border-0"
                        key={key}
                      >
                        <h3 className="font-medium text-sm">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="ml-2 flex flex-col gap-1 border-l pl-3">
                          {Object.entries(value).map(([k, url]) => {
                            let label = k;
                            if (k.startsWith("custom_")) {
                              const idx = Number.parseInt(
                                k.replace("custom_", ""),
                                10
                              );
                              label =
                                customLinks[idx]?.label ||
                                `Custom Link ${idx + 1}`;
                            } else {
                              label = k.charAt(0).toUpperCase() + k.slice(1);
                            }
                            return (
                              <div className="flex flex-wrap gap-2 text-sm">
                                {label}:
                                <a
                                  className="text-primary underline"
                                  href={`${url}`}
                                  key={k}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {typeof url === "string" ? url : ""}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (fieldType === "file" && value) {
                    // Handle new UploadedFile structure or legacy string URLs
                    const files = Array.isArray(value) ? value : [value];
                    return (
                      <div
                        className="flex flex-col gap-2 border-border border-b py-4 last:border-0"
                        key={key}
                      >
                        <h3 className="font-medium text-sm">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="ml-2 flex flex-col gap-2 border-l pl-3">
                          {files.map((file, idx) => {
                            // Handle new file object structure
                            if (
                              file &&
                              typeof file === "object" &&
                              file.signedUrl
                            ) {
                              const isImage =
                                file.type?.startsWith("image/") ||
                                file.signedUrl.match(
                                  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
                                );

                              return (
                                <div
                                  className="flex items-start gap-3 rounded-lg border bg-card p-2"
                                  key={file.id || idx}
                                >
                                  {isImage ? (
                                    <a
                                      className="flex-shrink-0"
                                      href={file.signedUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      <img
                                        alt={file.name || "Uploaded file"}
                                        className="h-16 w-16 rounded-md border object-cover"
                                        src={file.signedUrl}
                                      />
                                    </a>
                                  ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-accent">
                                      <span className="font-medium text-xs">
                                        {file.name
                                          ?.split(".")
                                          .pop()
                                          ?.toUpperCase() || "FILE"}
                                      </span>
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-sm">
                                      {file.name || "Unknown file"}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                      <Badge size="sm" variant="secondary">
                                        {file.size
                                          ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                                          : "Unknown size"}
                                      </Badge>
                                      {file.type && (
                                        <Badge size="sm" variant="outline">
                                          {file.type}
                                        </Badge>
                                      )}
                                    </div>
                                    <a
                                      className="mt-1 inline-block text-primary text-xs hover:underline"
                                      href={file.signedUrl}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              );
                            }

                            // Handle legacy string URLs
                            if (file && typeof file === "string") {
                              const isImage = file.match(
                                /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
                              );
                              return isImage ? (
                                <a
                                  href={file}
                                  key={idx}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <img
                                    alt="Uploaded file"
                                    className="h-24 max-w-xs rounded-xl border"
                                    src={file}
                                  />
                                </a>
                              ) : (
                                <a
                                  className="text-primary underline"
                                  href={file}
                                  key={idx}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {file}
                                </a>
                              );
                            }

                            return null;
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      className="flex flex-col gap-2 border-border border-b pb-8 last:border-0"
                      key={key}
                    >
                      <h3 className="font-medium text-sm">
                        {getFieldLabel(key)}
                      </h3>
                      <p className="ml-2 whitespace-pre-wrap border-l pl-3 text-muted-foreground text-sm">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
