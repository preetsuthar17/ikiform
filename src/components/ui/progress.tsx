'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const progressVariants = cva(
  'relative overflow-hidden rounded-card bg-secondary',
  {
    variants: {
      variant: {
        default: 'bg-secondary',
        primary: 'bg-primary/10',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive/10',
        outline: 'border border-border bg-accent',
      },
      size: {
        sm: 'h-1.5',
        default: 'h-2.5',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 rounded-card transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        primary: 'bg-primary',
        secondary: 'bg-foreground',
        destructive: 'bg-destructive',
        outline: 'bg-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const circularProgressVariants = cva(
  'relative flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'h-12 w-12',
        default: 'h-16 w-16',
        lg: 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  value?: number;
  showValue?: boolean;
  animated?: boolean;
  type?: 'linear' | 'circular';
  strokeWidth?: number;
  label?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      variant,
      size,
      showValue = false,
      animated = true,
      type = 'linear',
      strokeWidth,
      label,
      ...props
    },
    ref
  ) => {
    const progress = Math.min(Math.max(value, 0), 100);
    if (type === 'circular') {
      const circleSize = size === 'sm' ? 48 : size === 'lg' ? 80 : 64;
      const radius = (circleSize - (strokeWidth || 8)) / 2;
      const circumference = 2 * Math.PI * radius;
      const strokeDashoffset = circumference - (progress / 100) * circumference;

      return (
        <div className="flex w-full flex-col items-center gap-2">
          {label && <div className="text-foreground text-sm">{label}</div>}
          <div className={cn(circularProgressVariants({ size }), className)}>
            <svg
              className="-rotate-90 transform"
              height={circleSize}
              width={circleSize}
            >
              {/* Background circle */}
              <circle
                className="opacity-20"
                cx={circleSize / 2}
                cy={circleSize / 2}
                fill="transparent"
                r={radius}
                stroke="hsl(var(--hu-secondary))"
                strokeWidth={strokeWidth || 8}
              />
              {/* Progress circle */}
              <motion.circle
                animate={{
                  strokeDashoffset: animated
                    ? strokeDashoffset
                    : strokeDashoffset,
                }}
                cx={circleSize / 2}
                cy={circleSize / 2}
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                r={radius}
                stroke={
                  variant === 'destructive'
                    ? 'hsl(var(--hu-destructive))'
                    : variant === 'secondary'
                      ? 'hsl(var(--hu-secondary-foreground))'
                      : variant === 'outline'
                        ? 'hsl(var(--hu-foreground))'
                        : 'hsl(var(--hu-primary))'
                }
                strokeDasharray={circumference}
                strokeLinecap="round"
                strokeWidth={strokeWidth || 8}
                transition={{
                  duration: animated ? 1.5 : 0,
                  ease: 'easeInOut',
                }}
              />
            </svg>
            {showValue && (
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center font-semibold text-sm tabular-nums"
                initial={{ opacity: 0 }}
                transition={{ delay: animated ? 0.5 : 0, duration: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.div>
            )}
          </div>
          {showValue && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-muted-foreground text-xs tabular-nums"
              initial={{ opacity: 0, y: -5 }}
              transition={{ delay: animated ? 0.3 : 0, duration: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.div>
          )}
        </div>
      );
    }
    return (
      <div className="flex w-full flex-col items-center gap-2">
        {label && <div className="text-foreground text-sm">{label}</div>}
        <ProgressPrimitive.Root
          className={cn(progressVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        >
          <ProgressPrimitive.Indicator
            asChild
            className={cn(progressIndicatorVariants({ variant }))}
          >
            <motion.div
              animate={{ transform: `translateX(-${100 - progress}%)` }}
              initial={{ transform: 'translateX(-100%)' }}
              transition={{
                duration: animated ? 1.2 : 0,
                ease: 'easeInOut',
              }}
            />
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>
        {showValue && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-right font-semibold text-muted-foreground text-xs tabular-nums"
            initial={{ opacity: 0, y: -5 }}
            transition={{ delay: animated ? 0.3 : 0, duration: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.div>
        )}
      </div>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };
