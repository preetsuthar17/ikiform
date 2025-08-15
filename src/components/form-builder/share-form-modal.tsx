'use client';

import {
  Check,
  Code2,
  Copy,
  Download,
  Globe,
  QrCode,
  Share,
} from 'lucide-react';

import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { Tabs, TabsContent } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState('link');
  const [generatingQR, setGeneratingQR] = useState(false);

  const shareUrl = formId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/f/${formSlug || formId}`
    : '';

  const tabItems = [
    { id: 'link', label: 'Link' },
    { id: 'qr', label: 'QR Code' },
    { id: 'embed', label: 'Embed' },
  ];

  useEffect(() => {
    if (isOpen && isPublished && shareUrl) {
      generateQRCode();
    }
  }, [isOpen, isPublished, shareUrl]);

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

      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 4,
        errorCorrectionLevel: 'M',
        color: {
          dark: style.primaryColor,
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

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex max-w-lg flex-col gap-6">
        <ModalHeader className="text-center">
          <ModalTitle className="flex items-center justify-center gap-2">
            <Share className="h-5 w-5" />
            Share Form
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col gap-6 px-2">
          {isPublished ? (
            <div className="flex flex-col gap-4">
              <Tabs
                className="w-full"
                defaultValue="link"
                items={tabItems}
                onValueChange={setActiveTab}
                value={activeTab}
              />

              <TabsContent activeValue={activeTab} value="link">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label className="font-medium text-sm" htmlFor="share-url">
                      Public Form URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        className="font-mono text-sm"
                        id="share-url"
                        readOnly
                        value={shareUrl}
                      />
                      <Button
                        className="min-w-fit shrink-0 gap-2"
                        disabled={copying}
                        onClick={handleCopyLink}
                        size="icon"
                        variant="secondary"
                      >
                        {copying ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-ele border border-accent/20 bg-accent/10 p-4">
                    <Globe className="h-5 w-5 shrink-0 text-accent-foreground" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">Form is live!</p>
                      <p className="text-muted-foreground text-xs">
                        Anyone with this link can access and submit your form.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent activeValue={activeTab} value="qr">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="border bg-white p-2 shadow-sm">
                        {qrCodeDataUrl && !generatingQR ? (
                          <img
                            alt="QR Code for form"
                            className="h-48 w-48"
                            src={qrCodeDataUrl}
                          />
                        ) : (
                          <div className="flex h-48 w-48 items-center justify-center">
                            {generatingQR ? (
                              <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-card border-2 border-primary border-t-transparent" />
                                <span className="text-muted-foreground text-sm">
                                  Generating QR code...
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-3">
                                <QrCode className="h-12 w-12 text-muted-foreground" />
                                <span className="text-muted-foreground text-sm">
                                  QR code will appear here
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-center">
                    <p className="font-medium text-sm">Scan to access form</p>
                    <p className="text-muted-foreground text-xs">
                      Share this QR code for easy mobile access
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="gap-2"
                      disabled={!qrCodeDataUrl || downloading || generatingQR}
                      onClick={handleDownloadQR}
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                      {downloading ? 'Downloading...' : 'Download QR Code'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent activeValue={activeTab} value="embed">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3 rounded-ele border border-accent/20 bg-accent/10 p-4">
                    <Code2 className="h-5 w-5 shrink-0 text-accent-foreground" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">Embed your form</p>
                      <p className="text-muted-foreground text-xs">
                        Customize and integrate your form into any website.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground text-sm">
                      Get customizable embed codes for HTML, React, Next.js, and
                      more
                    </p>
                    <Button
                      className="gap-2"
                      onClick={() =>
                        window.open(`/embed?formid=${formId}`, '_blank')
                      }
                      variant="default"
                    >
                      <Code2 className="h-4 w-4" />
                      Open Embed Customizer
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-4">
                    <h4 className="mb-2 font-medium text-sm">
                      Quick HTML Embed:
                    </h4>
                    <div className="overflow-x-auto rounded bg-gray-900 p-3 font-mono text-green-400 text-xs">
                      {`<iframe
  src="${shareUrl}"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs">
                      For more customization options, use the embed customizer.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <div className="flex flex-col items-center gap-2 rounded-ele bg-muted/50 p-4">
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

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
            {isPublished && (
              <Button
                className="gap-2"
                disabled={copying}
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
