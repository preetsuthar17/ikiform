"use client";

import { Check, Copy, Download, Globe, QrCode, Share } from "lucide-react";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";

interface ShareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
  formSlug?: string | null;
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
  formSlug,
  isPublished,
  onPublish,
}: ShareFormModalProps) {
  const [copying, setCopying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [generatingQr, setGeneratingQr] = useState(false);

  const shareUrl = formId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/f/${formSlug || formId}`
    : "";

  useEffect(() => {
    if (isOpen && isPublished && shareUrl && showQr && !qrCodeDataUrl) {
      generateQrCode();
    }
  }, [isOpen, isPublished, shareUrl, showQr, qrCodeDataUrl]);

  const generateQrCode = async () => {
    if (!shareUrl) return;

    setGeneratingQr(true);
    try {
      const style = QR_CODE_STYLE;

      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 4,
        errorCorrectionLevel: "M",
        color: {
          light: style.backgroundColor,
        },
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = 256;
      canvas.height = 256;

      const qrImage = new Image();
      qrImage.src = qrDataUrl;

      await new Promise((resolve, reject) => {
        qrImage.onload = resolve;
        qrImage.onerror = reject;
      });

      ctx.drawImage(qrImage, 0, 0, 256, 256);

      ctx.strokeStyle = style.primaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, 254, 254);

      setQrCodeDataUrl(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setGeneratingQr(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    setCopying(true);
    try {
      const { copyWithToast } = await import("@/lib/utils/clipboard");
      await copyWithToast(
        shareUrl,
        "Link copied to clipboard!",
        "Failed to copy link. Please copy manually."
      );
    } catch (error) {
      console.error("Failed to copy link:", error);
      const { toast } = await import("@/hooks/use-toast");
      toast.error("Failed to copy link. Please copy manually.");
    } finally {
      setTimeout(() => {
        setCopying(false);
      }, 2000);
    }
  };

  const handleDownloadQr = async () => {
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

  const handleToggleQr = () => {
    setShowQr(!showQr);
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle className="flex items-center gap-2">
            <Share aria-hidden="true" className="size-5" />
            Share Form
          </DialogTitle>
          <DialogDescription>
            {isPublished
              ? "Share your form with others using the link or QR code below"
              : "Publish your form to make it shareable with others"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {isPublished ? (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Globe
                    aria-hidden="true"
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span className="font-medium text-sm">Share Link</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    className="flex-1 font-mono text-sm"
                    id="share-url"
                    readOnly
                    value={shareUrl}
                  />
                  <Button
                    className="shrink-0"
                    disabled={copying}
                    onClick={handleCopyLink}
                  >
                    {copying ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Button onClick={handleToggleQr} size="sm" variant="outline">
                    <div className="flex items-center gap-2">
                      <QrCode
                        aria-hidden="true"
                        className="h-4 w-4 text-muted-foreground"
                      />
                      <span className="font-medium text-sm">
                        {showQr ? "Hide" : "Show"} QR Code
                      </span>
                    </div>
                  </Button>
                </div>

                {showQr && (
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-lg border bg-white p-3">
                        {qrCodeDataUrl && !generatingQr ? (
                          <img
                            alt="QR Code for form"
                            className="h-24 w-24"
                            src={qrCodeDataUrl}
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center">
                            {generatingQr ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="text-muted-foreground text-xs">
                                  Generating...
                                </span>
                              </div>
                            ) : (
                              <QrCode className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="mb-2 text-muted-foreground text-xs">
                          Scan for easy mobile access
                        </p>
                        <Button
                          className="w-full"
                          disabled={
                            !qrCodeDataUrl || downloading || generatingQr
                          }
                          onClick={handleDownloadQr}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          {downloading ? "Downloading..." : "Download QR"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <div className="rounded-lg bg-muted/50 p-6">
                <Globe
                  aria-hidden="true"
                  className="mx-auto mb-3 h-12 w-12 text-muted-foreground"
                />
                <p className="text-muted-foreground text-sm">
                  Your form needs to be published before it can be shared
                  publicly.
                </p>
              </div>
              <Button
                className="w-full"
                disabled={!formId || publishing}
                onClick={handlePublish}
              >
                {publishing ? "Publishing..." : "Publish Form"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
