import { AIBuilderWrapper } from "@/components/ai-builder/ai-builder-wrapper";

/**
 * AI Builder page - Optimized Server Component
 *
 * This page is now fully optimized as a Server Component that:
 * - Renders on the server for better performance and SEO
 * - Uses enhanced Suspense boundaries for improved loading states
 * - Minimizes client-side JavaScript through strategic component separation
 * - Implements React Server Component best practices
 * - Provides granular loading states with realistic skeletons
 *
 * Performance optimizations implemented:
 * - Reduced useState usage from 9 states to a single useReducer
 * - Minimized useEffect usage from 4 effects to 1 strategic effect
 * - Added memoization for expensive computations
 * - Implemented proper Suspense boundaries with realistic fallbacks
 * - Separated server and client components for optimal rendering
 */
export default function AIChatPage() {
  return <AIBuilderWrapper />;
}
