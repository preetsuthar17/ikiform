import { SuspenseWrapper } from "@/components/ui/suspense-wrapper";
import { AIBuilderClient } from "./ai-builder-client";
import { AIBuilderSkeleton } from "./ai-builder-skeleton";

/**
 * Server component wrapper for AI Builder
 * Provides optimized Suspense boundary with enhanced loading states
 * Follows React Server Component best practices
 */
export function AIBuilderWrapper() {
  return (
    <div className="h-screen w-full bg-background">
      <SuspenseWrapper
        className="h-screen w-full"
        fallback={<AIBuilderSkeleton />}
      >
        <AIBuilderClient />
      </SuspenseWrapper>
    </div>
  );
}
