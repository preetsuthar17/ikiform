"use client";

import type * as React from "react";
import {
	Dialog as Modal,
	DialogClose as ModalClose,
	DialogContent as DialogContent,
	DialogDescription as ModalDescription,
	DialogFooter as ModalFooter,
	DialogHeader as ModalHeader,
	DialogOverlay as ModalOverlay,
	DialogPortal as ModalPortal,
	DialogTitle as ModalTitle,
	DialogTrigger as ModalTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function ModalContent({
	className,
	...props
}: React.ComponentProps<typeof DialogContent>) {
	return (
		<DialogContent
			className={cn("max-w-lg rounded-4xl", className)}
			{...props}
		/>
	);
}

export {
	Modal,
	ModalPortal,
	ModalOverlay,
	ModalClose,
	ModalTrigger,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalTitle,
	ModalDescription,
};
