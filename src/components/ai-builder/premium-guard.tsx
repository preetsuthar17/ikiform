// UI components imports
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

// Next.js imports
import Link from "next/link";

interface PremiumGuardProps {
  user: any;
  hasPremium: boolean | null;
  authLoading: boolean;
  checking: boolean;
  children: React.ReactNode;
}

export function PremiumGuard({
  user,
  hasPremium,
  authLoading,
  checking,
  children,
}: PremiumGuardProps) {
  if (authLoading || checking || hasPremium === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user || !hasPremium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-2xl font-semibold">Requires Premium</div>
        <div className="text-muted-foreground text-center max-w-md">
          You need a premium subscription to use the AI form builder. Upgrade to
          unlock all features.
        </div>
        <Link href="/#pricing">
          <Button size="lg">View Pricing</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
