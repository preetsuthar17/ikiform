"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MarqueeProps {
	children: React.ReactNode;
	direction?: "left" | "right" | "up" | "down";
	speed?: "slow" | "normal" | "fast" | number;
	pauseOnHover?: boolean;
	repeat?: number;
	gap?: string | number;
	fade?: boolean;
	className?: string;
	style?: React.CSSProperties;
	vertical?: boolean;
	autoFill?: boolean;
	"aria-label"?: string;
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
	(
		{
			children,
			direction = "left",
			speed = "normal",
			pauseOnHover = true,
			repeat = 4,
			gap = "1rem",
			fade = true,
			className,
			style,
			vertical = false,
			autoFill = false,
			"aria-label": ariaLabel,
			...props
		},
		ref,
	) => {
		const containerRef = React.useRef<HTMLDivElement>(null);
		const [isClient, setIsClient] = React.useState(false);
		const [containerWidth, setContainerWidth] = React.useState(0);
		const [contentWidth, setContentWidth] = React.useState(0);

		React.useEffect(() => {
			setIsClient(true);
		}, []);

		React.useEffect(() => {
			const container = containerRef.current;
			if (!(container && isClient)) return;

			const resizeObserver = new ResizeObserver(() => {
				setContainerWidth(container.offsetWidth);
				const firstChild = container.firstElementChild as HTMLElement;
				if (firstChild) {
					setContentWidth(firstChild.scrollWidth);
				}
			});

			resizeObserver.observe(container);
			return () => resizeObserver.disconnect();
		}, [isClient, children]);

		const getSpeed = (): string => {
			if (typeof speed === "number") {
				return `${speed}s`;
			}

			const speeds = {
				slow: "60s",
				normal: "30s",
				fast: "15s",
			};
			return speeds[speed];
		};

		const getAnimationName = (): string => {
			if (vertical || direction === "up" || direction === "down") {
				return "marqueeY";
			}
			return "marquee";
		};

		const getAnimationDirection = (): string => {
			if (direction === "right" || direction === "down") {
				return "reverse";
			}
			return "normal";
		};

		const calculateRepeat = (): number => {
			if (!(autoFill && isClient)) return repeat;

			if (containerWidth && contentWidth) {
				return Math.ceil(containerWidth / contentWidth) + 1;
			}
			return repeat;
		};

		const gapValue = typeof gap === "number" ? `${gap}px` : gap;

		const containerStyles: React.CSSProperties = {
			"--gap": gapValue,
			"--duration": getSpeed(),
			...style,
		} as React.CSSProperties;

		const animationStyles: React.CSSProperties = {
			animationName: getAnimationName(),
			animationDuration: getSpeed(),
			animationTimingFunction: "linear",
			animationIterationCount: "infinite",
			animationDirection: getAnimationDirection(),
			animationPlayState: "running",
		};

		const fadeStyles = fade
			? vertical
				? {
						maskImage:
							"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0))",
						WebkitMaskImage:
							"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0))",
					}
				: {
						maskImage:
							"linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0))",
						WebkitMaskImage:
							"linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, rgba(0,0,0,0))",
					}
			: {};

		const content = Array.from({ length: calculateRepeat() }, (_, i) => (
			<div
				aria-hidden={i > 0 ? "true" : undefined}
				className={cn(
					"flex shrink-0",
					vertical ? "flex-col" : "flex-row",
					"[gap:var(--gap)]",
				)}
				key={i}
				style={animationStyles}
			>
				{children}
			</div>
		));

		return (
			<div
				aria-label={ariaLabel || "Scrolling content"}
				aria-live="off"
				className={cn(
					"group flex overflow-hidden",
					vertical ? "flex-col" : "flex-row",
					pauseOnHover && "hover:[&>*]:pause-animation",
					"motion-reduce:hover:[&>*]:pause-animation",
					className,
				)}
				ref={ref}
				role="marquee"
				style={{
					...containerStyles,
					...fadeStyles,
				}}
				{...props}
			>
				<div
					className={cn(
						"flex",
						vertical ? "flex-col" : "flex-row",
						"[gap:var(--gap)]",
					)}
					ref={containerRef}
				>
					{content}
				</div>
			</div>
		);
	},
);

Marquee.displayName = "Marquee";

export const MarqueeItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		className={cn("flex shrink-0 items-center justify-center", className)}
		ref={ref}
		{...props}
	/>
));

MarqueeItem.displayName = "MarqueeItem";

export const MarqueeContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		className={cn("flex items-center gap-4", className)}
		ref={ref}
		{...props}
	/>
));

MarqueeContent.displayName = "MarqueeContent";
