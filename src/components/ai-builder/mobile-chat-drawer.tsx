// UI components imports
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { ChatPanelProps } from '@/lib/ai-builder/types';
// Local imports
import { ChatPanel } from './chat/chat-panel';

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
    <Drawer onOpenChange={onOpenChange} open={isOpen}>
      <DrawerContent className="w-full max-w-full">
        <DrawerHeader>
          <DrawerTitle>Kiko AI Chat</DrawerTitle>
          <DrawerDescription className="sr-only">
            Chat with the AI form builder assistant
          </DrawerDescription>
          <DrawerCloseButton />
        </DrawerHeader>
        <div className="flex h-[90vh] flex-col gap-4 overflow-y-auto">
          <ChatPanel {...chatPanelProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
