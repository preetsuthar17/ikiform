import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
	variant?: "single-step" | "multi-step";
	showProgress?: boolean;
}

const transparentClass = "bg-transparent/40";

export function FormSkeleton({
	variant = "single-step",
	showProgress = false,
}: FormSkeletonProps) {
	if (variant === "multi-step") {
		return (
			<div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-4">
				{showProgress && (
					<div className="flex flex-col gap-2">
						<Skeleton className={`h-4 w-24 ${transparentClass}`} />
						<Skeleton
							className={`h-2 w-full rounded-full ${transparentClass}`}
						/>
					</div>
				)}

				<Skeleton className={`min-h-xl ${transparentClass}`} />

				<div className="flex justify-between">
					<Skeleton className={transparentClass} />
					<Skeleton className={transparentClass} />
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Skeleton className={`h-8 w-3/4 ${transparentClass}`} />
					<Skeleton className={`h-4 w-full ${transparentClass}`} />
					<Skeleton className={`h-4 w-2/3 ${transparentClass}`} />
				</div>
				<div className="flex flex-col gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div className="flex flex-col gap-2" key={i}>
							<Skeleton className={`h-4 w-32 ${transparentClass}`} />
							<Skeleton
								className={`h-10 w-full rounded-2xl ${transparentClass}`}
							/>
						</div>
					))}
				</div>
				<div className="pt-4">
					<Skeleton className={`w-full ${transparentClass}`} />
				</div>
			</div>
		</div>
	);
}

export function FormFieldSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-4 w-32 bg-transparent/40" />
			<Skeleton className="h-10 w-full rounded-2xl" />
		</div>
	);
}

export function FormProgressSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<Skeleton className="h-4 w-24 bg-transparent/40" />
				<Skeleton className="h-4 w-16 bg-transparent/40" />
			</div>
			<Skeleton className="h-2 w-full rounded-full" />
		</div>
	);
}
