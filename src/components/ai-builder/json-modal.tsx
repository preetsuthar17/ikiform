// React imports
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// UI components imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";

// Syntax highlighting
import { createHighlighter } from "shiki";

// Local imports
import { CopyButton } from "./copy-button";
import { FormSchema } from "@/lib/ai-builder/types";

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: FormSchema | undefined;
}

export function JsonModal({ isOpen, onClose, activeForm }: JsonModalProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    if (!activeForm?.schema) return;

    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ["github-dark", "github-light"],
          langs: ["json"],
        });

        const jsonString = JSON.stringify(activeForm.schema, null, 2);
        const selectedTheme = theme === "dark" ? "github-dark" : "github-light";
        const html = highlighter.codeToHtml(jsonString, {
          lang: "json",
          theme: selectedTheme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        setHighlightedCode(
          `<pre class="whitespace-pre-wrap break-words">${JSON.stringify(activeForm.schema, null, 2)}</pre>`
        );
      }
    };

    highlightCode();
  }, [activeForm?.schema, theme]);

  if (!activeForm?.schema) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-lg w-[95vw] flex flex-col gap-4">
        <ModalHeader>
          <ModalTitle>Form JSON Schema</ModalTitle>
        </ModalHeader>
        <ScrollArea className="bg-muted rounded-ele text-xs max-h-[60vh] min-h-[120px] h-[40rem] w-full border p-4 gap-4">
          <div
            className="shiki-container text-xs [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </ScrollArea>
        <ModalFooter className="flex gap-2">
          <CopyButton schema={activeForm.schema} />
          <ModalClose asChild>
            <Button variant="outline">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
