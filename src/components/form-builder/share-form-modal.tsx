'use client';

import { Check, Copy, Download, Globe, QrCode, Share, X } from 'lucide-react';

import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';

import { toast } from '@/hooks/use-toast';

interface ShareFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string | null;
  formSlug?: string | null;
  isPublished: boolean;
  onPublish: () => Promise<void>;
}

const QR_CODE_STYLE = {
  primaryColor: '#6366f1',
  backgroundColor: '#FFFFFF',
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);

  const shareUrl = formId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${formSlug || formId}`
    : '';

  useEffect(() => {
    if (isOpen && isPublished && shareUrl && showQR && !qrCodeDataUrl) {
      generateQRCode();
    }
  }, [isOpen, isPublished, shareUrl, showQR, qrCodeDataUrl]);

  const generateQRCode = async () => {
    if (!shareUrl) return;

    setGeneratingQR(true);
    try {
      const style = QR_CODE_STYLE;

      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 4,
        errorCorrectionLevel: 'M',
        color: {
          light: style.backgroundColor,
        },
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

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

      setQrCodeDataUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    setCopying(true);
    try {
      const { copyWithToast } = await import('@/lib/utils/clipboard');
      await copyWithToast(
        shareUrl,
        'Link copied to clipboard!',
        'Failed to copy link. Please copy manually.'
      );
    } catch (error) {
      console.error('Failed to copy link:', error);
      const { toast } = await import('@/hooks/use-toast');
      toast.error('Failed to copy link. Please copy manually.');
    } finally {
      setCopying(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCodeDataUrl) return;

    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.download = `ikiform-qr-${formId}.png`;
      link.href = qrCodeDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR code');
    } finally {
      setDownloading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish();
    } catch (error) {
      console.error('Failed to publish form:', error);
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex max-w-lg flex-col gap-6 rounded-4xl">
        <ModalHeader className="text-left">
          <ModalTitle className="flex items-center justify-start gap-2 text-left">
            Share Public Form URL
          </ModalTitle>
        </ModalHeader>

        <div className="flex w-full flex-col gap-6 px-2 sm:px-4">
          {isPublished ? (
            <div className="flex w-full flex-col gap-6">
              {showQR && (
                <div className="flex w-full flex-col gap-4 rounded-3xl border border-border/50 bg-muted/20 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">QR Code</h3>
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={handleToggleQR}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="flex items-center justify-center rounded-lg border bg-white p-2 shadow-sm sm:p-4">
                        {qrCodeDataUrl && !generatingQR ? (
                          <img
                            alt="QR Code for form"
                            className="h-28 w-28 sm:h-32 sm:w-32"
                            src={qrCodeDataUrl}
                          />
                        ) : (
                          <div className="flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                            {generatingQR ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="text-muted-foreground text-xs">
                                  Generating...
                                </span>
                              </div>
                            ) : (
                              <QrCode className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-center">
                    <p className="text-muted-foreground text-xs">
                      Scan for easy mobile access
                    </p>
                    <Button
                      className="mx-auto w-full gap-2 sm:w-auto"
                      disabled={!qrCodeDataUrl || downloading || generatingQR}
                      onClick={handleDownloadQR}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-3 w-3" />
                      {downloading ? 'Downloading...' : 'Download'}
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full flex-col flex-col gap-2 md:flex-row">
                    <Input
                      className="w-full font-mono text-sm rounded-full"
                      id="share-url"
                      readOnly
                      size="xl"
                      value={shareUrl}
                    />
                    <Button
                      className="w-full min-w-fit shrink-0 gap-2 md:w-fit rounded-full"
                      disabled={copying}
                      onClick={handleCopyLink}
                      size="xl"
                    >
                      {copying ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">Copy Link</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="text-muted-foreground text-xs underline underline-offset-2 transition-colors hover:text-foreground"
                    onClick={handleToggleQR}
                  >
                    {showQR ? 'Hide QR Code' : 'Show QR Code'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 text-center">
              <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 p-3 sm:p-4">
                <Globe className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  Your form needs to be published before it can be shared
                  publicly.
                </p>
              </div>
              <Button
                className="w-full"
                disabled={!formId || publishing}
                loading={publishing}
                onClick={handlePublish}
              >
                {publishing ? 'Publishing' : 'Publish Form'}
              </Button>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
