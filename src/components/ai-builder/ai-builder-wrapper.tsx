import { SuspenseWrapper } from "@/components/ui/suspense-wrapper";
import { AIBuilderClient } from "./ai-builder-client";
import { AIBuilderSkeleton } from "./ai-builder-skeleton";

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
