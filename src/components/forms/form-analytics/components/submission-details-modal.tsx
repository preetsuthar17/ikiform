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

export const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  submission,
  isOpen,
  onClose,
  getFieldLabel,
  formatDate,
  onExport,
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
            }`
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
      <ModalContent className="max-w-3xl ">
        <ModalHeader className="border-b border-border flex items-left gap-4">
          <ModalTitle>Submission Details</ModalTitle>
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <div className="flex flex-col gap-4 pr-4">
              {Object.entries(submission.submission_data).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-2 pb-4 border-b border-border last:border-0"
                  >
                    <h3 className="text-sm font-medium">
                      {getFieldLabel(key)}
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </p>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
};
