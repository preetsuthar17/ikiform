"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-card border p-4 text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive bg-destructive/10 text-destructive [&>svg]:text-destructive",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600",
        success:
          "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: LucideIcon;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      icon: Icon,
      title,
      dismissible,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.();
      }, 150);
    };

    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      onTransitionEnd,
      ...motionProps
    } = props;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(alertVariants({ variant }), className)}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            ref={ref}
            role="alert"
            transition={{ duration: 0.15, ease: "easeOut" }}
            {...motionProps}
          >
            <div className="flex">
              {Icon && (
                <div className="flex-shrink-0">
                  <Icon className="mt-0.5 h-4 w-4" />
                </div>
              )}
              <div className={cn("flex flex-1 items-center", Icon && "ml-3")}>
                {title && <h3 className="font-medium text-sm">{title}</h3>}
                <div
                  className={cn("text-sm", title && "text-muted-foreground")}
                >
                  {children}
                </div>
              </div>
              {dismissible && (
                <div className="ml-3 flex-shrink-0">
                  <button
                    aria-label="Dismiss alert"
                    className="inline-flex rounded-ele p-1.5 transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={handleDismiss}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };
