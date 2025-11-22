import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SuspenseWrapperProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	className?: string;
}

export function SuspenseWrapper({
	children,
	fallback,
	className = "h-full w-full",
}: SuspenseWrapperProps) {
	const defaultFallback = (
		<div className={className}>
			<div className="flex h-full w-full flex-col gap-4 bg-background">
				{}
				<div className="flex items-center justify-between p-4">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-8 w-24 rounded-2xl" />
				</div>

				{}
				<div className="flex flex-1 gap-4 p-4">
					{}
					<div className="flex w-1/4 flex-col gap-4">
						<Skeleton className="h-10 w-full" />
						<div className="flex flex-col gap-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton className="h-16 w-full" key={i} />
							))}
						</div>
					</div>

					{}
					<div className="flex flex-1 flex-col gap-4">
						<Skeleton className="h-64 w-full" />
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
