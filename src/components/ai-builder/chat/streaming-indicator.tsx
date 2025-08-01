import { motion } from 'motion/react';
import { forwardRef, memo } from 'react';

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
            animate={{ opacity: 1, y: 0 }}
            className="my-2 rounded-card border border-destructive bg-destructive/10 p-3 text-sm"
            initial={{ opacity: 0, y: 20 }}
          >
            {streamError}
          </motion.div>
        );
      }

      return (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="my-2 rounded-card border border-border bg-muted/50 p-3 font-mono text-sm"
          initial={{ opacity: 0, y: 20 }}
        >
          <div
            className="scrollbar-none flex h-[90px] flex-col gap-2 overflow-auto text-muted-foreground text-xs"
            ref={ref}
            style={{ scrollBehavior: 'smooth' }}
          >
            <motion.p
              animate={{ backgroundPosition: '-200% 0' }}
              className="bg-[length:200%_100%] bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-clip-text font-geist-mono text-sm text-transparent"
              initial={{ backgroundPosition: '200% 0' }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: 'linear',
              }}
            >
              Generating form...
            </motion.p>
            <motion.pre
              animate={{ backgroundPosition: '-200% 0' }}
              className="whitespace-pre-wrap break-words bg-[length:200%_100%] bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-clip-text font-mono text-sm text-transparent"
              initial={{ backgroundPosition: '200% 0' }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: 'linear',
              }}
            >
              {streamedContent}
            </motion.pre>
          </div>
        </motion.div>
      );
    }
  )
);

StreamingIndicator.displayName = 'StreamingIndicator';
