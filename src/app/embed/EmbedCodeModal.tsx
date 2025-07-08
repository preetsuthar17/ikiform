"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { Loader } from "@/components/ui/loader";

interface EmbedCodeModalProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = async (): Promise<Highlighter> => {
  if (highlighterInstance) return highlighterInstance;
  if (highlighterPromise) return highlighterPromise;
  highlighterPromise = createHighlighter({
    langs: ["html"],
    themes: ["github-dark", "github-light"],
  }).then((highlighter) => {
    highlighterInstance = highlighter;
    highlighterPromise = null;
    return highlighter;
  });
  return highlighterPromise;
};

export function EmbedCodeModal({ code, isOpen, onClose }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isHighlighting, setIsHighlighting] = useState(false);
  const { theme } = useTheme();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const highlightCode = async () => {
      if (abortController.signal.aborted) return;
      setIsHighlighting(true);
      try {
        const highlighter = await getHighlighter();
        if (abortController.signal.aborted) return;
        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";
        const html = highlighter.codeToHtml(code, {
          lang: "html",
          theme: selectedTheme,
        });
        if (!abortController.signal.aborted) setHighlightedCode(html);
      } catch (error) {
        if (!abortController.signal.aborted)
          setHighlightedCode(`<pre><code>${code}</code></pre>`);
      } finally {
        if (!abortController.signal.aborted) setIsHighlighting(false);
      }
    };
    highlightCode();
    return () => abortController.abort();
  }, [code, theme, isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // ignore
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl h-[60vh] flex flex-col gap-4">
        <ModalHeader>
          <ModalTitle>Embed Code</ModalTitle>
        </ModalHeader>
        <div className="flex-1 relative flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="ml-auto absolute top-3 right-3 z-10"
            disabled={isHighlighting}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <ScrollArea className="h-[45vh] rounded-ele border bg-muted/30 text-foreground">
            {isHighlighting ? (
              <div className="p-4 flex items-center justify-center h-[45vh]">
                <Loader />
              </div>
            ) : (
              <div
                className="p-4 text-sm font-mono h-full break-words whitespace-pre-wrap [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:break-words [&_code]:whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            )}
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
