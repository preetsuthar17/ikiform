"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T) => {
		for (const ref of refs) {
			if (!ref) continue;
			if (typeof ref === "function") {
				ref(node);
			} else {
				(ref as React.MutableRefObject<T | null>).current = node;
			}
		}
	};
}

const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
	({ children, className, style, ...props }, forwardedRef) => {
		if (!React.isValidElement(children)) {
			return null;
		}

		const child = children as React.ReactElement<{
			className?: string;
			style?: React.CSSProperties;
		}>;

		const mergedProps = {
			...props,
			...child.props,
			className: cn(className, child.props.className),
			style: { ...style, ...child.props.style },
			ref: composeRefs(forwardedRef, (child as any).ref),
		};

		return React.cloneElement(child, mergedProps);
	}
);

Slot.displayName = "Slot";

export { Slot };
