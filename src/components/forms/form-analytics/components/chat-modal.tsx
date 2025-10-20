import { Bot } from "lucide-react";
import type React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

import type { ChatModalProps } from "../types";

import { ChatInterface } from "./chat-interface";

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
      <Drawer onOpenChange={onClose} open={isOpen}>
        <DrawerContent className="flex h-[85vh] flex-col focus:outline-none focus:ring-0">
          <DrawerHeader className="flex items-center justify-between gap-2 border-border border-b">
            <div className="sr-only flex items-center gap-2">
              <Bot className="size-4 text-primary" />
              <DrawerTitle>Kiko</DrawerTitle>
            </div>
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
    <Modal onOpenChange={onClose} open={isOpen}>
      <ModalContent className="flex h-[800px] max-w-3xl flex-col focus:outline-none focus:ring-0">
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
