import React from "react";

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

// Types
import type { SubmissionDetailsModalProps } from "../types";

export const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  submission,
  isOpen,
  onClose,
  getFieldLabel,
  formatDate,
}) => {
  if (!submission) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl">
        <ModalHeader className="border-b border-border flex items-center gap-4">
          <ModalTitle>Submission Details</ModalTitle>
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {formatDate(submission.submitted_at)}
            </Badge>
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
