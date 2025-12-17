"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps
	extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	indicatorStyle?: React.CSSProperties;
}

function Progress({
	className,
	value,
	indicatorStyle,
	...props
}: ProgressProps) {
	const customBg = indicatorStyle?.backgroundColor;

	return (
		<ProgressPrimitive.Root
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full",
				!customBg && "bg-primary/20",
				className,
			)}
			data-slot="progress"
			style={
				customBg
					? {
							backgroundColor: `color-mix(in srgb, ${customBg} 20%, transparent)`,
						}
					: undefined
			}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(
					"h-full w-full flex-1 transition-all",
					!customBg && "bg-primary",
				)}
				data-slot="progress-indicator"
				style={{
					transform: `translateX(-${100 - (value || 0)}%)`,
					...indicatorStyle,
				}}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
