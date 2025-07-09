import React, { useState } from "react";
import toast from "react-hot-toast";

// UI Components
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { Download, Copy, Check } from "lucide-react";

// Types
import type { SubmissionDetailsModalProps } from "../types";
import type { Form } from "@/lib/database";
import { OptimizedImage } from "@/components/other/optimized-image";

function getFieldType(
  form: Form | undefined,
  fieldId: string,
): string | undefined {
  if (!form || !form.schema) return undefined;
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
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const handleCopySubmissionData = async () => {
    try {
      const submissionText = Object.entries(submission.submission_data)
        .map(
          ([key, value]) =>
            `${getFieldLabel(key)}: ${
              typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value)
            }`,
        )
        .join("\n\n");

      await navigator.clipboard.writeText(submissionText);
      toast.success("Submission data copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy submission data:", error);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl">
        <ModalHeader className="border-b border-border flex items-left gap-4">
          <ModalTitle>Submission Details</ModalTitle>
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <div className="flex flex-col gap-4 p-2 md:p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline">
                {formatDate(submission.submitted_at)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ID: {submission.id.slice(-8)}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleCopySubmissionData}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent size="sm">
                    Copy submission data
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {onExport && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onExport(submission)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent size="sm">Export submission</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <ScrollArea className="h-[60vh]">
            <div className="flex flex-col gap-4">
              {Object.entries(submission.submission_data).map(
                ([key, value]) => {
                  const fieldType = getFieldType(form, key);
                  // Signature field as image
                  if (
                    fieldType === "signature" &&
                    typeof value === "string" &&
                    value.startsWith("data:image")
                  ) {
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-2 py-4 border-b border-border last:border-0"
                      >
                        <h3 className="text-sm font-medium">
                          {getFieldLabel(key)}
                        </h3>
                        <div className=" ml-2 pl-3 border-l max-w-xs">
                          <OptimizedImage
                            src={`${value}`}
                            alt="Signature"
                            className="h-auto w-full max-w-full border rounded-ele"
                            height={50}
                            width={500}
                          />
                        </div>
                      </div>
                    );
                  }
                  // Social field as labeled links
                  if (
                    fieldType === "social" &&
                    typeof value === "object" &&
                    value !== null &&
                    form
                  ) {
                    const allFields = [
                      ...(form.schema.fields || []),
                      ...(form.schema.blocks?.flatMap(
                        (block) => block.fields || [],
                      ) || []),
                    ];
                    const field = allFields.find((f) => f.id === key);
                    const customLinks = field?.settings?.customLinks || [];
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-2 py-4 border-b border-border last:border-0"
                      >
                        <h3 className="text-sm font-medium">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="flex flex-col gap-1 ml-2 pl-3 border-l">
                          {Object.entries(value).map(([k, url]) => {
                            let label = k;
                            if (k.startsWith("custom_")) {
                              const idx = parseInt(
                                k.replace("custom_", ""),
                                10,
                              );
                              label =
                                customLinks[idx]?.label ||
                                `Custom Link ${idx + 1}`;
                            } else {
                              label = k.charAt(0).toUpperCase() + k.slice(1);
                            }
                            return (
                              <div className="flex gap-2 text-sm flex-wrap">
                                {label}:
                                <a
                                  key={k}
                                  href={`${url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline"
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
                  // File upload field as links/previews
                  if (fieldType === "file" && value) {
                    const urls = Array.isArray(value) ? value : [value];
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-2 py-4 border-b border-border last:border-0"
                      >
                        <h3 className="text-sm font-medium">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="flex flex-col gap-2 ml-2 pl-3 border-l">
                          {urls.map((url, idx) =>
                            url && typeof url === "string" ? (
                              url.match(
                                /^https?:.*\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i,
                              ) ? (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={url}
                                    alt="Uploaded file"
                                    className="h-24 max-w-xs border rounded-ele"
                                  />
                                </a>
                              ) : (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary underline"
                                >
                                  {url}
                                </a>
                              )
                            ) : null,
                          )}
                        </div>
                      </div>
                    );
                  }
                  // Default rendering
                  return (
                    <div
                      key={key}
                      className="flex flex-col gap-2 pb-8 border-b border-border last:border-0"
                    >
                      <h3 className="text-sm font-medium">
                        {getFieldLabel(key)}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap ml-2 pl-3 border-l">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
};
