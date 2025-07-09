// External imports
import React from "react";
import { motion, AnimatePresence } from "motion/react";

// Icons
import { AlertTriangle } from "lucide-react";

// Types
import type { UnsavedChangesIndicatorProps } from "../types";

export const UnsavedChangesIndicator: React.FC<
  UnsavedChangesIndicatorProps
> = ({ hasUnsavedChanges, autoSaving }) => {
  return (
    <AnimatePresence>
      {hasUnsavedChanges && !autoSaving && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center"
        >
          <div className="bg-accent border border-border text-accent-foreground shadow-lg flex items-center gap-2 rounded-ele p-2">
            <AlertTriangle className="w-4 h-4 text-accent-foreground/80" />
            <span className="text-sm font-medium text-center">
              You have unsaved changes
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
