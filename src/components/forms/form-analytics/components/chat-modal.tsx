import React from "react";

// UI Components
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
} from "@/components/ui/modal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerCloseButton,
} from "@/components/ui/drawer";

// Icons
import { Bot } from "lucide-react";

// Chat Interface
import { ChatInterface } from "./chat-interface";

// Types
import type { ChatModalProps } from "../types";

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  isMobile,
  chatMessages,
  chatStreaming,
  streamedContent,
  chatLoading,
  messagesEndRef,
  chatSuggestions,
  setChatInput,
  handleChatSend,
  chatInputRef,
  chatInput,
  abortController,
  handleStopGeneration,
}) => {
  const chatInterfaceProps = {
    chatMessages,
    chatStreaming,
    streamedContent,
    chatLoading,
    messagesEndRef,
    chatSuggestions,
    setChatInput,
    handleChatSend,
    chatInputRef,
    chatInput,
    abortController,
    handleStopGeneration,
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[85vh] flex flex-col focus:outline-none focus:ring-0">
          <DrawerHeader className="border-b border-border flex items-center justify-between gap-2">
            <div className="sr-only flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <DrawerTitle>Kiko</DrawerTitle>
            </div>
            <DrawerCloseButton />
            <DrawerDescription className="sr-only">
              Chat with AI about your form analytics
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1">
            <ChatInterface {...chatInterfaceProps} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-3xl h-[800px] flex flex-col focus:outline-none focus:ring-0">
        <ModalHeader className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <ModalTitle>Kiko</ModalTitle>
          </div>
          <ModalClose onClick={onClose} />
        </ModalHeader>
        <div className="flex-1">
          <ChatInterface {...chatInterfaceProps} />
        </div>
      </ModalContent>
    </Modal>
  );
};
