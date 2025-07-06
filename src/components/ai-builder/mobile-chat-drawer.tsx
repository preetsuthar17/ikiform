// UI components imports
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  DrawerDescription,
} from "@/components/ui/drawer";

// Local imports
import { ChatPanel } from "./chat/chat-panel";
import { ChatPanelProps } from "@/lib/ai-builder/types";

interface MobileChatDrawerProps extends ChatPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileChatDrawer({
  isOpen,
  onOpenChange,
  ...chatPanelProps
}: MobileChatDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-full w-full">
        <DrawerHeader>
          <DrawerTitle>Kiko AI Chat</DrawerTitle>
          <DrawerDescription className="sr-only">
            Chat with the AI form builder assistant
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>
        <div className="flex flex-col h-[90vh] overflow-y-auto gap-4">
          <ChatPanel {...chatPanelProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
