// Icons
import { Check, Copy, Download } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { OptimizedImage } from '@/components/other/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// UI Components
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Form } from '@/lib/database';
// Types
import type { SubmissionDetailsModalProps } from '../types';

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
  const [copied, setCopied] = useState(false);

  if (!submission) return null;

  const handleCopySubmissionData = async () => {
    try {
      const submissionText = Object.entries(submission.submission_data)
        .map(
          ([key, value]) =>
            `${getFieldLabel(key)}: ${
              typeof value === 'object'
                ? JSON.stringify(value, null, 2)
                : String(value)
            }`
        )
        .join('\n\n');

      await navigator.clipboard.writeText(submissionText);
      toast.success('Submission data copied to clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy submission data:', error);
    }
  };

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
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

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <TooltipProvider>
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
              </TooltipProvider>

              {onExport && (
                <TooltipProvider>
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
                    fieldType === 'signature' &&
                    typeof value === 'string' &&
                    value.startsWith('data:image')
                  ) {
                    return (
                      <div
                        className="flex flex-col gap-2 border-border border-b py-4 last:border-0"
                        key={key}
                      >
                        <h3 className="font-medium text-sm">
                          {getFieldLabel(key)}
                        </h3>
                        <div className=" ml-2 max-w-xs border-l pl-3">
                          <OptimizedImage
                            alt="Signature"
                            className="h-auto w-full max-w-full rounded-ele border"
                            height={50}
                            src={`${value}`}
                            width={500}
                          />
                        </div>
                      </div>
                    );
                  }
                  // Social field as labeled links
                  if (
                    fieldType === 'social' &&
                    typeof value === 'object' &&
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
                            if (k.startsWith('custom_')) {
                              const idx = Number.parseInt(
                                k.replace('custom_', ''),
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
                                  {typeof url === 'string' ? url : ''}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  // File upload field as links/previews
                  if (fieldType === 'file' && value) {
                    const urls = Array.isArray(value) ? value : [value];
                    return (
                      <div
                        className="flex flex-col gap-2 border-border border-b py-4 last:border-0"
                        key={key}
                      >
                        <h3 className="font-medium text-sm">
                          {getFieldLabel(key)}
                        </h3>
                        <div className="ml-2 flex flex-col gap-2 border-l pl-3">
                          {urls.map((url, idx) =>
                            url && typeof url === 'string' ? (
                              url.match(
                                /^https?:.*\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i
                              ) ? (
                                <a
                                  href={url}
                                  key={idx}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <img
                                    alt="Uploaded file"
                                    className="h-24 max-w-xs rounded-ele border"
                                    src={url}
                                  />
                                </a>
                              ) : (
                                <a
                                  className="text-primary underline"
                                  href={url}
                                  key={idx}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {url}
                                </a>
                              )
                            ) : null
                          )}
                        </div>
                      </div>
                    );
                  }
                  // Default rendering
                  return (
                    <div
                      className="flex flex-col gap-2 border-border border-b pb-8 last:border-0"
                      key={key}
                    >
                      <h3 className="font-medium text-sm">
                        {getFieldLabel(key)}
                      </h3>
                      <p className="ml-2 whitespace-pre-wrap border-l pl-3 text-muted-foreground text-sm">
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
};
