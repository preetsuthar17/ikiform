"use client";

import React, { useState, useEffect } from "react";

// Icon imports
import { Copy, Share, Globe, Check, Download, QrCode } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Hooks
import { toast } from "@/hooks/use-toast";

// QR Code library
import QRCode from "qrcode";

interface ShareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
  isPublished: boolean;
  onPublish: () => Promise<void>;
}

const QR_CODE_STYLE = {
  primaryColor: "#6366f1",
  backgroundColor: "#FFFFFF",
  logoSize: 32,
  cornerRadius: 6,
};

export function ShareFormModal({
  isOpen,
  onClose,
  formId,
  isPublished,
  onPublish,
}: ShareFormModalProps) {
  const [copying, setCopying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("link");
  const [generatingQR, setGeneratingQR] = useState(false);

  const shareUrl = formId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/forms/${formId}`
    : "";

  const tabItems = [
    { id: "link", label: "Link" },
    { id: "qr", label: "QR Code" },
  ];

  // Generate QR code when modal opens and form is published
  useEffect(() => {
    if (isOpen && isPublished && shareUrl) {
      generateQRCode();
    }
  }, [isOpen, isPublished, shareUrl]);

  // Copy link automatically when modal opens and form is published
  useEffect(() => {
    if (isOpen && isPublished && shareUrl) {
      handleCopyLink();
    }
  }, [isOpen, isPublished, shareUrl]);

  const generateQRCode = async () => {
    if (!shareUrl) return;

    setGeneratingQR(true);
    try {
      const style = QR_CODE_STYLE;

      // Generate base QR code
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 4, // Increased margin for better scannability
        errorCorrectionLevel: "M", // Medium error correction for logo overlay
        color: {
          dark: style.primaryColor,
          light: style.backgroundColor,
        },
      });

      // Create canvas to overlay logo
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = 256;
      canvas.height = 256;

      // Load QR code image
      const qrImage = new Image();
      qrImage.src = qrDataUrl;

      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
      });

      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, 256, 256);

      // Add subtle border
      ctx.strokeStyle = style.primaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 254, 254);

      setQrCodeDataUrl(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    setCopying(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      } else {
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

  const handleDownloadQR = async () => {
    if (!qrCodeDataUrl) return;

    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.download = `ikiform-qr-${formId}.png`;
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Failed to download QR code");
    } finally {
      setDownloading(false);
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
      <ModalContent className="max-w-lg flex flex-col gap-6">
        <ModalHeader className="text-center">
          <ModalTitle className="flex items-center justify-center gap-2">
            <Share className="w-5 h-5" />
            Share Form
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-6 px-2">
          {!isPublished ? (
            <div className="text-center flex flex-col gap-4">
              <div className="p-4 bg-muted/50 rounded-ele flex flex-col items-center gap-2">
                <Globe className="w-8 h-8 text-muted-foreground" />
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
                {publishing ? "Publishing" : "Publish Form"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Tabs
                items={tabItems}
                defaultValue="link"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              />

              <TabsContent value="link" activeValue={activeTab}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="share-url" className="text-sm font-medium">
                      Public Form URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="share-url"
                        value={shareUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleCopyLink}
                        disabled={copying}
                        className="shrink-0 gap-2 min-w-fit"
                      >
                        {copying ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-ele flex gap-3 items-center">
                    <Globe className="w-5 h-5 text-accent-foreground shrink-0" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Form is live!</p>
                      <p className="text-xs text-muted-foreground">
                        Anyone with this link can access and submit your form.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr" activeValue={activeTab}>
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="p-2 bg-white  border shadow-sm">
                        {qrCodeDataUrl && !generatingQR ? (
                          <img
                            src={qrCodeDataUrl}
                            alt="QR Code for form"
                            className="w-48 h-48"
                          />
                        ) : (
                          <div className="w-48 h-48 flex items-center justify-center">
                            {generatingQR ? (
                              <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-card h-8 w-8 border-2 border-primary border-t-transparent"></div>
                                <span className="text-sm text-muted-foreground">
                                  Generating QR code...
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-3">
                                <QrCode className="w-12 h-12 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  QR code will appear here
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center flex flex-col gap-2">
                    <p className="text-sm font-medium">Scan to access form</p>
                    <p className="text-xs text-muted-foreground">
                      Share this QR code for easy mobile access
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleDownloadQR}
                      disabled={!qrCodeDataUrl || downloading || generatingQR}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {downloading ? "Downloading..." : "Download QR Code"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onClose}>
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
