import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { SKELETON_FORM_COUNT } from "../constants";

import type { LoadingSkeletonProps } from "../types";

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
	const containerClassName = useMemo(
		() => `flex flex-col gap-8 ${className || ""}`,
		[className],
	);

	const skeletonCards = useMemo(
		() =>
			[...Array(SKELETON_FORM_COUNT)].map((_, i) => {
				let cardClass =
					"group flex cursor-pointer flex-col gap-4 shadow-none p-6 hover:bg-accent/50 relative";

				if (String(SKELETON_FORM_COUNT) === "1") {
					cardClass += " rounded-xl border-b-0";
				} else if (i === 0) {
					cardClass += " rounded-t-xl rounded-b-none border-b-0";
				} else if (i === SKELETON_FORM_COUNT - 1) {
					cardClass += " rounded-b-xl rounded-t-none border-b";
				} else {
					cardClass += " rounded-none border-b-0";
				}

				return (
					<Skeleton aria-hidden="true" className={cardClass} key={i}>
						<div className="flex items-center justify-between">
							<div className="flex min-w-0 flex-1 items-center gap-4">
								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center gap-2">
										<Skeleton aria-hidden="true" className="h-6 w-48" />
										<Skeleton
											aria-hidden="true"
											className="h-5 w-16 rounded-lg"
										/>
									</div>
									<Skeleton aria-hidden="true" className="mb-1 h-4 w-32" />
									<Skeleton aria-hidden="true" className="mt-1 h-3 w-24" />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Skeleton aria-hidden="true" className="size-8 rounded" />
							</div>
						</div>
					</Skeleton>
				);
			}),
		[],
	);

	return (
		<div
			aria-label="Loading forms management"
			className={containerClassName}
			role="status"
		>
			<Skeleton aria-hidden="true" className="rounded-xl p-6 py-8 shadow-none">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="flex flex-col gap-2">
						<Skeleton aria-hidden="true" className="h-8 w-48" />
						<Skeleton aria-hidden="true" className="h-5 w-72" />
					</div>
					<Skeleton aria-hidden="true" className="h-10 w-full sm:w-40" />
				</div>
			</Skeleton>

			<div aria-hidden="true" className="flex items-center gap-3">
				<Skeleton className="h-10 flex-1" />
				<Skeleton className="size-10" />
			</div>

			<div className="relative flex flex-col">{skeletonCards}</div>
		</div>
	);
}
