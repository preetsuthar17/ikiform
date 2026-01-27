"use client";

import { type MotionProps, motion } from "motion/react";
import * as React from "react";
import { sanitizeVariants, useMotionSafeColors } from "@/lib/utils/motion-safe";

interface MotionSafeDivProps
	extends Omit<
		MotionProps,
		"initial" | "animate" | "exit" | "whileHover" | "whileTap" | "whileFocus"
	> {
	children?: React.ReactNode;
	initial?: Record<string, any>;
	animate?: Record<string, any>;
	exit?: Record<string, any>;
	whileHover?: Record<string, any>;
	whileTap?: Record<string, any>;
	whileFocus?: Record<string, any>;
}

export const MotionSafeDiv = React.forwardRef<
	HTMLDivElement,
	MotionSafeDivProps
>(
	(
		{ initial, animate, exit, whileHover, whileTap, whileFocus, ...props },
		ref
	) => {
		const variants = React.useMemo(() => {
			const safeVariants: any = {};
			if (initial) safeVariants.initial = initial;
			if (animate) safeVariants.animate = animate;
			if (exit) safeVariants.exit = exit;
			if (whileHover) safeVariants.whileHover = whileHover;
			if (whileTap) safeVariants.whileTap = whileTap;
			if (whileFocus) safeVariants.whileFocus = whileFocus;
			return sanitizeVariants(safeVariants);
		}, [initial, animate, exit, whileHover, whileTap, whileFocus]);

		return <motion.div ref={ref} {...variants} {...props} />;
	}
);

MotionSafeDiv.displayName = "MotionSafeDiv";

interface MotionSafeButtonProps extends MotionSafeDivProps {
	variant?: "default" | "ghost" | "outline";
	disabled?: boolean;
	onClick?: () => void;
	className?: string;
}

export const MotionSafeButton = React.forwardRef<
	HTMLButtonElement,
	MotionSafeButtonProps
>(
	(
		{
			variant = "default",
			disabled,
			children,
			className,
			onClick,
			...motionProps
		},
		ref
	) => {
		const { safeBackgroundColor, safeBorderColor } = useMotionSafeColors();

		const getHoverColors = () => {
			switch (variant) {
				case "ghost":
					return {
						backgroundColor: safeBackgroundColor("accent"),
					};
				case "outline":
					return {
						backgroundColor: safeBackgroundColor("accent"),
						borderColor: safeBorderColor("border"),
					};
				default:
					return {
						backgroundColor: safeBackgroundColor("primary"),
					};
			}
		};

		const hoverColors = getHoverColors();

		return (
			<motion.button
				className={className}
				disabled={disabled}
				onClick={onClick}
				ref={ref}
				transition={{ duration: 0.2 }}
				whileHover={disabled ? undefined : hoverColors}
				whileTap={disabled ? undefined : { scale: 0.98 }}
				{...motionProps}
			>
				{children}
			</motion.button>
		);
	}
);

MotionSafeButton.displayName = "MotionSafeButton";

export const FadeIn = ({
	children,
	...props
}: Omit<MotionSafeDivProps, "initial" | "animate">) => (
	<MotionSafeDiv animate={{ opacity: 1 }} initial={{ opacity: 0 }} {...props}>
		{children}
	</MotionSafeDiv>
);

export const SlideUp = ({
	children,
	...props
}: Omit<MotionSafeDivProps, "initial" | "animate">) => (
	<MotionSafeDiv
		animate={{ opacity: 1, y: 0 }}
		initial={{ opacity: 0, y: 20 }}
		{...props}
	>
		{children}
	</MotionSafeDiv>
);

export const Scale = ({
	children,
	...props
}: Omit<MotionSafeDivProps, "initial" | "animate">) => (
	<MotionSafeDiv
		animate={{ opacity: 1, scale: 1 }}
		initial={{ opacity: 0, scale: 0.9 }}
		{...props}
	>
		{children}
	</MotionSafeDiv>
);

export { motion };
export type { MotionSafeDivProps, MotionSafeButtonProps };
