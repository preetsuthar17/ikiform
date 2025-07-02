"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { FormSchema } from "@/lib/database.types";

interface JsonViewModalProps {
  schema: FormSchema;
  isOpen: boolean;
  onClose: () => void;
}

export function JsonViewModal({ schema, isOpen, onClose }: JsonViewModalProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(schema, null, 2);

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
        <ModalHeader className="flex-shrink-0">
          <ModalTitle>Form Schema JSON</ModalTitle>
        </ModalHeader>

        <div className="flex-1 min-h-0 relative">
          <Button
            variant="ghost"
            size={"icon"}
            onClick={copyToClipboard}
            className="ml-auto absolute  z-99 top-[12px] right-[12px] "
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <ScrollArea className="h-full rounded-ele border border-border bg-muted/30 text-foreground">
            <pre className="p-4 text-sm [font-family:var(--font-jetbrains-mono)] h-full">
              <code>{jsonString}</code>
            </pre>
          </ScrollArea>
        </div>
      </ModalContent>
    </Modal>
  );
}
