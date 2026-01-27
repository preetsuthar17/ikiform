"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
	return (
		<div
			className={cn(
				"relative inline-block",
				size === "sm" && "size-3",
				size === "md" && "size-4",
				size === "lg" && "size-6",
				className
			)}
			{...props}
		>
			{Array.from({ length: 12 }).map((_, i) => (
				<div className="spinner-blade" key={i} />
			))}
		</div>
	);
}
