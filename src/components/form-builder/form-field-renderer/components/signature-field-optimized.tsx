import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SignatureFieldSkeleton } from "./signature-field-skeleton";

const SignatureFieldClient = dynamic(
  () =>
    import("./signature-field-client").then((mod) => ({
      default: mod.SignatureFieldClient,
    })),
  {
    ssr: false,
    loading: () => <SignatureFieldSkeleton />,
  }
);

interface SignatureFieldOptimizedProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Server-optimized SignatureField component
 * Uses Suspense boundaries and skeletons for optimal loading experience
 */
export function SignatureFieldOptimized(props: SignatureFieldOptimizedProps) {
  return (
    <Suspense fallback={<SignatureFieldSkeleton />}>
      <SignatureFieldClient {...props} />
    </Suspense>
  );
}
