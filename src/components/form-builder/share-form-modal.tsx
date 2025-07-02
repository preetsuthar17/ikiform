"use client";

import React, { useState } from "react";
import { Copy, Share, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { toast } from "@/hooks/use-toast";

interface ShareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
  isPublished: boolean;
  onPublish: () => Promise<void>;
}

export function ShareFormModal({
  isOpen,
  onClose,
  formId,
  isPublished,
  onPublish,
}: ShareFormModalProps) {
  const [copying, setCopying] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const shareUrl = formId
    ? `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/forms/${formId}`
    : "";

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    setCopying(true);
    try {
      // Use the modern clipboard API with proper error handling
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } else {
        // Fallback for older browsers or non-secure contexts
        // Create a temporary textarea element
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link. Please copy manually.");
    } finally {
      setCopying(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } catch (error) {
      console.error("Failed to publish form:", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-md flex flex-col gap-6">
        <ModalHeader>
          <ModalTitle className="flex items-center gap-2">
            <Share className="w-5 h-5" />
            Share Form
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-6">
          {!isPublished ? (
            // Form not published yet
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your form needs to be published before it can be shared
                  publicly.
                </p>
              </div>
              <Button
                onClick={handlePublish}
                loading={publishing}
                disabled={!formId || publishing}
                className="w-full"
              >
                {publishing ? "Publishing..." : "Publish Form"}
              </Button>
            </div>
          ) : (
            // Form is published
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="share-url">Public Form URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    disabled={copying}
                    className="gap-2 min-w-fit"
                  >
                    {copying ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copying ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-accent-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Form is live!</p>
                    <p className="text-xs text-muted-foreground">
                      Anyone with this link can access and submit your form.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {isPublished && (
              <Button
                onClick={handleCopyLink}
                disabled={copying}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
