'use client';

import { Check, Copy } from 'lucide-react';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';

import { toast } from '@/hooks/use-toast';

import type { FormSchema } from '@/lib/database';
import { Loader } from '../ui/loader';

interface JsonViewModalProps {
  schema: FormSchema;
  isOpen: boolean;
  onClose: () => void;
}

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = async (): Promise<Highlighter> => {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (highlighterPromise) {
    return highlighterPromise;
  }

  highlighterPromise = createHighlighter({
    langs: ['json'],
    themes: ['github-dark', 'github-light'],
  }).then((highlighter) => {
    highlighterInstance = highlighter;
    highlighterPromise = null;
    return highlighter;
  });

  return highlighterPromise;
};

export function JsonViewModal({ schema, isOpen, onClose }: JsonViewModalProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isHighlighting, setIsHighlighting] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(schema, null, 2);
    } catch (error) {
      console.error('Failed to stringify schema:', error);
      return '{}';
    }
  }, [schema]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const highlightCode = async () => {
      if (abortController.signal.aborted) return;

      setIsHighlighting(true);

      try {
        const highlighter = await getHighlighter();

        if (abortController.signal.aborted) return;

        const selectedTheme = 'github-light';

        const highlight = () => {
          if (abortController.signal.aborted) return;

          try {
            const html = highlighter.codeToHtml(jsonString, {
              lang: 'json',
              theme: selectedTheme,
            });

            if (!abortController.signal.aborted) {
              setHighlightedCode(html);
            }
          } catch (error) {
            console.error('Failed to highlight code:', error);
            if (!abortController.signal.aborted) {
              setHighlightedCode(`<pre><code>${jsonString}</code></pre>`);
            }
          } finally {
            if (!abortController.signal.aborted) {
              setIsHighlighting(false);
            }
          }
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(highlight);
        } else {
          setTimeout(highlight, 0);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to create highlighter:', error);
          setHighlightedCode(`<pre><code>${jsonString}</code></pre>`);
          setIsHighlighting(false);
        }
      }
    };

    highlightCode();

    return () => {
      abortController.abort();
    };
  }, [jsonString, isOpen]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      const { copyToClipboard: robustCopy } = await import(
        '@/lib/utils/clipboard'
      );
      const success = await robustCopy(jsonString, {
        showSuccessToast: true,
        successMessage: 'JSON copied to clipboard!',
        showErrorToast: true,
        errorMessage: 'Failed to copy JSON',
      });

      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      const { toast } = await import('@/hooks/use-toast');
      toast.error('Failed to copy JSON');
    }
  };

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex h-[80vh] max-w-4xl flex-col gap-4">
        <ModalHeader>
          <ModalTitle>Form Schema JSON</ModalTitle>
        </ModalHeader>

        <div className="relative flex flex-1 flex-col">
          <Button
            className="absolute top-3 right-3 z-10 ml-auto"
            disabled={isHighlighting}
            onClick={copyToClipboard}
            size="icon"
            variant="ghost"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <ScrollArea className="h-[71vh] rounded-card border bg-muted/30 text-foreground">
            {isHighlighting ? (
              <div className="flex h-[71vh] items-center justify-center p-4">
                <Loader />
              </div>
            ) : (
              <div
                className="[&_pre]:!bg-transparent [&_pre]:!p-0 h-full p-4 font-mono text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            )}
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
