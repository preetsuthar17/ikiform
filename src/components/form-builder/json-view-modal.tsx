"use client";

import React, { useState, useEffect } from "react";
import { bundledLanguages, createHighlighter } from "shiki";
import { useTheme } from "next-themes";

// Icon imports
import { Copy, Check } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hooks
import { toast } from "@/hooks/use-toast";

// Types
import type { FormSchema } from "@/lib/database";

interface JsonViewModalProps {
  schema: FormSchema;
  isOpen: boolean;
  onClose: () => void;
}

export function JsonViewModal({ schema, isOpen, onClose }: JsonViewModalProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const { theme } = useTheme();

  const jsonString = JSON.stringify(schema, null, 2);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          langs: Object.keys(bundledLanguages),
          themes: ["github-dark", "github-light"],
        });

        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";

        const html = highlighter.codeToHtml(jsonString, {
          lang: "json",
          theme: selectedTheme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlightedCode(`<pre><code>${jsonString}</code></pre>`);
      }
    };

    if (jsonString) {
      highlightCode();
    }
  }, [jsonString, theme]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success("JSON copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy JSON");
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl h-[80vh] flex flex-col gap-4">
        <ModalHeader>
          <ModalTitle>Form Schema JSON</ModalTitle>
        </ModalHeader>

        <div className="flex-1 relative flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className="ml-auto absolute top-3 right-3 z-10"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <ScrollArea className="h-[71vh] rounded-ele border bg-muted/30 text-foreground">
            <div
              className="p-4 text-sm font-mono h-full [&_pre]:!bg-transparent [&_pre]:!p-0"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
