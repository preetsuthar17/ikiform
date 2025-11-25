import { AIBuilderClient } from "@/components/ai-builder/ai-builder-client";
import { AIBuilderSkeleton } from "@/components/ai-builder/ai-builder-skeleton";
import { SuspenseWrapper } from "@/components/ui/suspense-wrapper";

export default function AIChatPage() {
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
