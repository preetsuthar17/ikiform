'use client';

// Icon imports
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createHighlighter, type Highlighter } from 'shiki';

// UI components
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';

// Hooks
import { toast } from '@/hooks/use-toast';

// Types
import type { FormSchema } from '@/lib/database';
import { Loader } from '../ui/loader';

interface JsonViewModalProps {
  schema: FormSchema;
  isOpen: boolean;
  onClose: () => void;
}

// Singleton highlighter instance to avoid recreation
let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

// Create highlighter with only JSON language for performance
const getHighlighter = async (): Promise<Highlighter> => {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  if (highlighterPromise) {
    return highlighterPromise;
  }

  highlighterPromise = createHighlighter({
    langs: ['json'], // Only load JSON language
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
  const { theme } = useTheme();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize JSON string to avoid unnecessary re-stringification
  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(schema, null, 2);
    } catch (error) {
      console.error('Failed to stringify schema:', error);
      return '{}';
    }
  }, [schema]);

  useEffect(() => {
    // Don't highlight if modal is not open
    if (!isOpen) {
      return;
    }

    // Cancel previous highlighting operation
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

        const selectedTheme = theme === 'dark' ? 'github-dark' : 'github-light';

        // Use requestIdleCallback for non-blocking highlighting
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

        // Use requestIdleCallback if available, otherwise setTimeout
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
  }, [jsonString, theme, isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success('JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
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
          <ScrollArea className="h-[71vh] rounded-ele border bg-muted/30 text-foreground">
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
