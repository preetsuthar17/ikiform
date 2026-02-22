"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import * as React from "react"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
	asChild = false,
	children,
	...props
}: CollapsiblePrimitive.Trigger.Props & { asChild?: boolean }) {
	if (asChild && React.isValidElement(children)) {
		const child = children as React.ReactElement;
		return (
			<CollapsiblePrimitive.Trigger
				data-slot="collapsible-trigger"
				render={child}
				{...props}
			/>
		);
	}

	return (
		<CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props}>
			{children}
		</CollapsiblePrimitive.Trigger>
	);
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
