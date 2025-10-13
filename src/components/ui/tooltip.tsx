"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-2xl border border-border bg-card px-3 py-1.5 text-card-foreground text-xs",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        light: "border-border bg-background text-foreground",
        destructive:
          "border-destructive bg-destructive text-primary-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Tooltip: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
> = ({ delayDuration = 10, ...props }) => (
  <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />
);

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipProvider: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
> = ({ delayDuration = 100, skipDelayDuration = 50, ...props }) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
);

const QuickTooltipProvider: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
> = ({ delayDuration = 100, skipDelayDuration = 50, ...props }) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
);

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <AnimatePresence>
      <TooltipPrimitive.Content
        asChild
        className={cn("relative", className)}
        onAnimationEnd={() => setIsVisible(false)}
        onAnimationStart={() => setIsVisible(true)}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(tooltipVariants({ variant, size }), className)}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.1,
          }}
        >
          {props.children}
        </motion.div>
      </TooltipPrimitive.Content>
    </AnimatePresence>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  QuickTooltipProvider,
  tooltipVariants,
  type TooltipContentProps,
};
