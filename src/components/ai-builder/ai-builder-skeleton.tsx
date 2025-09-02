import {
  ChatHeaderSkeleton,
  ChatSuggestionsSkeleton,
  ChatWelcomeSkeleton,
  FormPreviewSkeleton,
  PreviewPanelHeaderSkeleton,
} from "@/components/ui/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Precise skeleton loader for AI Builder that matches the exact layout
 * Uses component-specific skeletons for pixel-perfect loading states
 */
export function AIBuilderSkeleton() {
  return (
    <div className="flex h-screen w-full flex-col gap-4 bg-background md:flex-row">
      {}
      <div className="md:hidden">
        {}
        <div className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 w-full max-w-[90%]">
          <Skeleton className="h-12 w-full rounded-card" />
        </div>

        {}
        <PreviewPanelHeaderSkeleton isMobile={true} />

        {}
        <div className="my-12 flex-1 overflow-auto p-3">
          <ChatWelcomeSkeleton />
        </div>
      </div>

      {}
      <div className="hidden h-full w-full md:flex">
        {}
        <div
          className="flex w-1/5 min-w-[15%] max-w-[30%] flex-col border-r"
          style={{ width: "20%" }}
        >
          {}
          <ChatHeaderSkeleton />

          {}
          <div className="relative flex-1 p-4">
            <div className="flex h-full flex-col gap-4">
              {}
              <ChatWelcomeSkeleton />

              {}
              <div className="mt-auto">
                <ChatSuggestionsSkeleton />
              </div>
            </div>
          </div>

          {}
          <div className="h-px bg-border" />

          {}
          <div className="p-4">
            <div className="relative">
              <Skeleton className="h-10 w-full rounded-card pr-12" />
              <Skeleton className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6" />
            </div>
          </div>
        </div>

        {}
        <div className="w-1 cursor-col-resize bg-border transition-colors hover:bg-border/80" />

        {}
        <div className="flex flex-1 flex-col" style={{ width: "80%" }}>
          {}
          <PreviewPanelHeaderSkeleton isMobile={false} />

          {}
          <div className="my-12 flex-1 overflow-auto p-6">
            <div className="mx-auto w-full max-w-2xl">
              {}
              <ChatWelcomeSkeleton />

              {}
              <div className="hidden">
                <FormPreviewSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
