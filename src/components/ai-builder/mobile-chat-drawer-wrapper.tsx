import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChatPanelProps } from '@/lib/ai-builder/types';

const MobileChatDrawerLazy = lazy(() =>
  import('./mobile-chat-drawer').then((module) => ({
    default: module.MobileChatDrawer,
  }))
);

interface MobileChatDrawerWrapperProps extends ChatPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Optimized MobileChatDrawer wrapper with lazy loading
 * Only loads on mobile devices when needed
 */
export function MobileChatDrawerWrapper({
  isOpen,
  onOpenChange,
  ...chatPanelProps
}: MobileChatDrawerWrapperProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full border-l bg-background">
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <MobileChatDrawerLazy
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...chatPanelProps}
      />
    </Suspense>
  );
}
