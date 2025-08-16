import { useEffect, useState } from 'react';

import { createHighlighter } from 'shiki';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { FormSchema } from '@/lib/ai-builder/types';

import { CopyButton } from './copy-button';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeForm: FormSchema | undefined;
}

export function JsonModal({ isOpen, onClose, activeForm }: JsonModalProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    if (!activeForm?.schema) return;

    const highlightCode = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ['github-dark', 'github-light'],
          langs: ['json'],
        });

        const jsonString = JSON.stringify(activeForm.schema, null, 2);
        const selectedTheme = 'github-light';
        const html = highlighter.codeToHtml(jsonString, {
          lang: 'json',
          theme: selectedTheme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);

        setHighlightedCode(
          `<pre class="whitespace-pre-wrap break-words">${JSON.stringify(activeForm.schema, null, 2)}</pre>`
        );
      }
    };

    highlightCode();
  }, [activeForm?.schema]);

  if (!activeForm?.schema) return null;

  return (
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex w-[95vw] max-w-lg flex-col gap-4">
        <ModalHeader>
          <ModalTitle>Form JSON Schema</ModalTitle>
        </ModalHeader>
        <ScrollArea className="h-[40rem] max-h-[60vh] min-h-[120px] w-full gap-4 rounded-ele border bg-muted p-4 text-xs">
          <div
            className="shiki-container text-xs [&_pre]:m-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-transparent [&_pre]:p-0"
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
