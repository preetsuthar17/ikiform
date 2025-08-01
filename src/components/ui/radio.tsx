'use client';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const radioGroupVariants = cva('grid gap-2', {
  variants: {
    orientation: {
      vertical: 'grid-cols-1',
      horizontal: 'auto-cols-max grid-flow-col',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const radioVariants = cva(
  'aspect-square rounded-card border border-border text-primary shadow-sm/2 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface RadioGroupProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
      'orientation'
    >,
    VariantProps<typeof radioGroupVariants> {
  label?: string;
  description?: string;
  error?: string;
}

interface RadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    { className, orientation, label, description, error, id, ...props },
    ref
  ) => {
    const groupId = id || React.useId();

    return (
      <div className="flex flex-col gap-4">
        {(label || description) && (
          <div className="grid gap-1.5">
            {label && (
              <label className="text-sm leading-none" htmlFor={groupId}>
                {label}
              </label>
            )}
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
          </div>
        )}

        <RadioGroupPrimitive.Root
          className={cn(radioGroupVariants({ orientation }), className)}
          id={groupId}
          ref={ref}
          {...props}
        />

        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(({ className, size, label, description, id, ...props }, ref) => {
  const itemId = id || React.useId();
  const dotSize = size === 'sm' ? 5 : size === 'lg' ? 8 : 6;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <RadioGroupPrimitive.Item
          className={cn(radioVariants({ size }), className)}
          id={itemId}
          ref={ref}
          {...props}
        >
          <RadioGroupPrimitive.Indicator asChild>
            <div className="flex h-full w-full items-center justify-center">
              <AnimatePresence>
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-card bg-primary"
                  exit={{ scale: 0, opacity: 0 }}
                  initial={{ scale: 0, opacity: 0 }}
                  key="dot"
                  style={{
                    width: dotSize,
                    height: dotSize,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                  }}
                />
              </AnimatePresence>
            </div>
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={itemId}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-muted-foreground text-xs peer-disabled:opacity-70">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

RadioItem.displayName = 'RadioItem';

export {
  RadioGroup,
  RadioItem,
  radioGroupVariants,
  radioVariants,
  type RadioGroupProps,
  type RadioItemProps,
};
