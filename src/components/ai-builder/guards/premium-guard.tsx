import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AIBuilderSkeleton } from "../ai-builder-skeleton";

interface PremiumGuardProps {
	user: any;
	hasPremium: boolean | null;
	authLoading: boolean;
	checking: boolean;
	children: React.ReactNode;
	useSkeleton?: boolean;
}

export function PremiumGuard({
	user,
	hasPremium,
	authLoading,
	checking,
	children,
	useSkeleton = false,
}: PremiumGuardProps) {
	if (authLoading || checking || hasPremium === null) {
		return useSkeleton ? (
			<AIBuilderSkeleton />
		) : (
			<div className="flex min-h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!(user && hasPremium)) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
				<div className="text-center font-semibold text-2xl">
					Requires Premium
				</div>
				<div className="max-w-md text-center text-muted-foreground">
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
