import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ChatPanelProps } from "@/lib/ai-builder/types";

import { ChatPanel } from "./chat/chat-panel";

interface MobileChatDrawerProps extends ChatPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  drawerId?: string;
}

export function MobileChatDrawer({
  isOpen,
  onOpenChange,
  drawerId,
  ...chatPanelProps
}: MobileChatDrawerProps) {
  return (
    <Drawer onOpenChange={onOpenChange} open={isOpen}>
      <DrawerContent
        className="w-full max-w-full rounded-t-2xl border-t"
        id={drawerId}
      >
        <DrawerHeader className="sticky top-0 z-10 border-b">
          <DrawerTitle className="font-semibold text-base">
            Kiko AI Chat
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Chat with the AI form builder assistant
          </DrawerDescription>
          <DrawerClose className="absolute top-3 right-3" />
        </DrawerHeader>
        <div className="flex h-[calc(100vh-8rem)] min-h-[60vh] flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <ChatPanel {...chatPanelProps} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
