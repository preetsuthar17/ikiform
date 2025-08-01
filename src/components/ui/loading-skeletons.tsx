import { Skeleton } from '@/components/ui/skeleton';

/**
 * Optimized skeleton component for form previews
 * Maintains consistent layout during loading states
 */
export function FormPreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
      {}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="space-y-2" key={i}>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * Optimized skeleton component for chat messages
 * Mimics actual chat message structure
 */
export function ChatMessageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="flex gap-3" key={i}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * AI Chat Welcome Message Skeleton
 * Matches the exact structure of WelcomeMessage component
 */
export function ChatWelcomeSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      {}
      <Skeleton className="h-12 w-12 rounded-card" />
      {}
      <Skeleton className="h-8 w-64" />
      {}
      <Skeleton className="h-4 w-80" />
    </div>
  );
}

/**
 * Chat Suggestions Skeleton
 * Matches the ChatSuggestions component layout
 */
export function ChatSuggestionsSkeleton() {
  return (
    <div className="flex flex-col gap-2 overflow-hidden max-sm:hidden">
      <div className="flex grow flex-wrap gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton className="h-8 min-w-[120px] flex-1 rounded-card" key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Chat Header Skeleton
 * Matches the ChatHeader component exactly
 */
export function ChatHeaderSkeleton() {
  return (
    <div className="border-b bg-card/50 backdrop-blur">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" /> {}
          <Skeleton className="h-6 w-16" /> {}
        </div>
      </div>
    </div>
  );
}

/**
 * Preview Panel Header Skeleton
 * Matches both mobile and desktop header layouts
 */
export function PreviewPanelHeaderSkeleton({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  if (isMobile) {
    return (
      <>
        {}
        <div className="flex items-center gap-3 border-b bg-card/50 p-4 backdrop-blur md:hidden">
          <Skeleton className="h-8 w-8" /> {}
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" /> {}
            <Skeleton className="h-6 w-16" /> {}
          </div>
        </div>
        {}
        <div className="hidden gap-2 overflow-x-auto p-3 max-sm:flex">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton className="h-8 w-20 rounded-card" key={i} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {}
      <div className="hidden border-b bg-card/50 p-4 backdrop-blur md:block">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" /> {}
            <Skeleton className="h-6 w-16" /> {}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-card" /> {}
            <Skeleton className="h-8 w-16 rounded-card" /> {}
          </div>
        </div>
      </div>
      {}
      <div className="flex gap-2 overflow-x-auto border-b p-4">
        <Skeleton className="h-8 w-20 rounded-card" />
        <Skeleton className="h-8 w-24 rounded-card" />
      </div>
    </>
  );
}

/**
 * Optimized skeleton component for form builder panels
 * Maintains panel structure during loading
 */
export function FormBuilderPanelSkeleton() {
  return (
    <div className="flex h-full">
      {}
      <div className="w-1/4 space-y-4 border-r p-4">
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton className="h-12 w-full" key={i} />
          ))}
        </div>
      </div>

      {}
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>

      {}
      <div className="w-1/4 space-y-4 border-l p-4">
        <Skeleton className="h-8 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="space-y-2" key={i}>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
