import { Skeleton } from "@/components/ui/skeleton";
import { SuspenseWrapper } from "@/components/ui/suspense-wrapper";

async function AiBuilderDataLoader() {
	return null;
}

export function AIBuilderServerWrapper() {
	return (
		<SuspenseWrapper
			className="h-screen w-full"
			fallback={
				<div className="flex h-screen w-full items-center justify-center bg-background">
					<div className="flex w-full max-w-md flex-col gap-4">
						<Skeleton className="mx-auto h-8 w-3/4" />
						<Skeleton className="h-64 w-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					</div>
				</div>
			}
		>
			<AiBuilderDataLoader />
		</SuspenseWrapper>
	);
}
