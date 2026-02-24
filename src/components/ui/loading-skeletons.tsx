import { Skeleton } from "@/components/ui/skeleton";

export function FormPreviewSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
			{}
			<div className="flex flex-col gap-2">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>

			{}
			<div className="flex flex-col gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div className="flex flex-col gap-2" key={i}>
						<Skeleton className="h-4 w-1/4" />
						<Skeleton className="h-10 w-full" />
					</div>
				))}
			</div>

			{}
			<Skeleton className="h-10 w-32" />
		</div>
	);
}

export function ChatMessageSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<div className="flex gap-3" key={i}>
					<Skeleton className="size-8 rounded-full" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>
			))}
		</div>
	);
}

export function ChatWelcomeSkeleton() {
	return (
		<div className="flex flex-col items-center gap-4 py-8 text-center">
			{}
			<Skeleton className="size-12 rounded-2xl" />
			{}
			<Skeleton className="h-8 w-64" />
			{}
			<Skeleton className="h-4 w-80" />
		</div>
	);
}

export function ChatSuggestionsSkeleton() {
	return (
		<div className="flex flex-col gap-2 overflow-hidden max-sm:hidden">
			<div className="flex grow flex-wrap gap-2 overflow-x-auto">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton className="h-8 min-w-[120px] flex-1 rounded-2xl" key={i} />
				))}
			</div>
		</div>
	);
}

export function ChatHeaderSkeleton() {
	return (
		<div className="border-b bg-card/50 backdrop-blur">
			<div className="flex items-center justify-between gap-4 p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="size-8" /> {}
					<Skeleton className="h-6 w-16" /> {}
				</div>
			</div>
		</div>
	);
}

export function PreviewPanelHeaderSkeleton({
	isMobile = false,
}: {
	isMobile?: boolean;
}) {
	if (isMobile) {
		return (
			<>
				{}
				<div className="flex items-center gap-3 border-b bg-card/50 p-4 backdrop-blur md:hidden">
					<Skeleton className="size-8" /> {}
					<div className="flex items-center gap-2">
						<Skeleton className="size-2 rounded-full" /> {}
						<Skeleton className="h-6 w-16" /> {}
					</div>
				</div>
				{}
				<div className="hidden gap-2 overflow-x-auto p-3 max-sm:flex">
					{Array.from({ length: 2 }).map((_, i) => (
						<Skeleton className="h-8 w-20 rounded-2xl" key={i} />
					))}
				</div>
			</>
		);
	}

	return (
		<>
			{}
			<div className="hidden border-b bg-card/50 p-4 backdrop-blur md:block">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Skeleton className="size-2 rounded-full" /> {}
						<Skeleton className="h-6 w-16" /> {}
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-8 w-20 rounded-2xl" /> {}
						<Skeleton className="h-8 w-16 rounded-2xl" /> {}
					</div>
				</div>
			</div>
			{}
			<div className="flex gap-2 overflow-x-auto border-b p-4">
				<Skeleton className="h-8 w-20 rounded-2xl" />
				<Skeleton className="h-8 w-24 rounded-2xl" />
			</div>
		</>
	);
}

export function FormBuilderPanelSkeleton() {
	return (
		<div className="flex h-full">
			{}
			<div className="flex w-1/4 flex-col gap-4 border-r p-4">
				<Skeleton className="h-8 w-full" />
				<div className="flex flex-col gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton className="h-12 w-full" key={i} />
					))}
				</div>
			</div>

			{}
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
					<div className="flex gap-2">
						<Skeleton className="size-8" />
						<Skeleton className="size-8" />
					</div>
				</div>
				<Skeleton className="h-96 w-full" />
			</div>

			{}
			<div className="flex w-1/4 flex-col gap-4 border-l p-4">
				<Skeleton className="h-8 w-full" />
				<div className="flex flex-col gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div className="flex flex-col gap-2" key={i}>
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-8 w-full" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function FormBuilderHeaderSkeleton() {
	return (
		<header
			aria-busy="true"
			className="z-20 shrink-0 border-border border-b bg-card px-4 py-3 md:py-4"
			role="status"
		>
			<span aria-live="polite" className="sr-only">
				Loading form builder header…
			</span>
			<div className="flex h-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
				<div className="flex items-center gap-3 md:gap-4">
					<h1
						aria-hidden="true"
						className="absolute font-semibold text-xl opacity-0"
					>
						Form Builder
					</h1>
					<div className="flex items-center gap-2 md:gap-3">
						<Skeleton className="h-9 w-36" />
						<Skeleton className="h-4 w-16" />
						<div className="hidden items-center gap-1 md:flex">
							<Skeleton className="h-1.5 w-1.5 rounded-full" />
							<Skeleton className="h-3 w-12" />
						</div>
					</div>
				</div>

				{}
				<nav
					aria-label="Form builder actions"
					className="relative w-full md:hidden"
				>
					<div className="w-full">
						<div className="flex items-center gap-2 pb-2">
							<Skeleton className="size-8" />
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-16" />
						</div>
					</div>
				</nav>

				{}
				<nav
					aria-label="Form builder actions"
					className="hidden items-center gap-3 md:flex"
				>
					<div className="flex items-center gap-2">
						<Skeleton className="h-9 w-28" />
						<Skeleton className="h-9 w-24" />
						<Skeleton className="h-9 w-24" />
						<Skeleton className="size-9" />
					</div>
					<Skeleton className="h-9 w-28" />
				</nav>
			</div>
		</header>
	);
}
