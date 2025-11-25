import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";

import type { UnsavedChangesIndicatorProps } from "../types";

export const UnsavedChangesIndicator: React.FC<
	UnsavedChangesIndicatorProps
> = ({ hasUnsavedChanges, autoSaving }) => (
	<AnimatePresence>
		{hasUnsavedChanges && !autoSaving && (
			<motion.div
				animate={{ opacity: 1, y: 0, scale: 1 }}
				className="-translate-x-1/2 fixed bottom-4 left-1/2 z-50 flex transform items-center justify-center"
				exit={{ opacity: 0, y: 20, scale: 0.95 }}
				initial={{ opacity: 0, y: 20, scale: 0.95 }}
				transition={{
					type: "spring",
					stiffness: 300,
					damping: 25,
				}}
			>
				<div className="flex items-center gap-2 rounded-xl border border-border bg-accent p-2 text-accent-foreground">
					<AlertTriangle className="size-4 text-accent-foreground/80" />
					<span className="whitespace-nowrap text-center font-medium text-sm">
						You have unsaved changes
					</span>
				</div>
			</motion.div>
		)}
	</AnimatePresence>
);
