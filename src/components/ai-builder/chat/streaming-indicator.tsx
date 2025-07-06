import { forwardRef, memo } from "react";
import { motion } from "motion/react";

interface StreamingIndicatorProps {
  streamedContent: string;
  streamError: string | null;
}

export const StreamingIndicator = memo(
  forwardRef<HTMLDivElement, StreamingIndicatorProps>(
    ({ streamedContent, streamError }, ref) => {
      if (streamError) {
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-2 p-3 rounded-lg bg-destructive/10 border border-destructive text-sm"
          >
            {streamError}
          </motion.div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-2 p-3 rounded-lg bg-muted/50 border border-border text-sm font-mono"
        >
          <div
            className="text-xs text-muted-foreground flex flex-col gap-2 h-[90px] overflow-auto scrollbar-none"
            ref={ref}
            style={{ scrollBehavior: "smooth" }}
          >
            Generating form...
            <pre className="whitespace-pre-wrap break-words">
              {streamedContent}
            </pre>
          </div>
        </motion.div>
      );
    },
  ),
);

StreamingIndicator.displayName = "StreamingIndicator";
