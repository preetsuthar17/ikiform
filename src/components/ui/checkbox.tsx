'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer shrink-0 rounded-ele border border-border bg-accent text-foreground shadow-sm/2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground',
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

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
}

const CheckboxRoot = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, label, description, error, id, ...props }, ref) => {
  const checkboxId = id || React.useId();
  const iconSize = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;

  // Custom SVG check path for drawing animation
  const checkPath = 'M3 6l3 3 6-6';
  const minusPath = 'M3 6h8';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <CheckboxPrimitive.Root
          className={cn(checkboxVariants({ size }), className)}
          id={checkboxId}
          ref={ref}
          {...props}
        >
          <CheckboxPrimitive.Indicator asChild>
            <div className="flex items-center justify-center text-current">
              <AnimatePresence mode="wait">
                {props.checked === 'indeterminate' ? (
                  <motion.svg
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    fill="none"
                    height={iconSize}
                    initial={{ opacity: 0 }}
                    key="indeterminate"
                    transition={{ duration: 0.1 }}
                    viewBox="0 0 14 14"
                    width={iconSize}
                  >
                    <motion.path
                      animate={{ pathLength: 1 }}
                      d={minusPath}
                      initial={{ pathLength: 0 }}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={2}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    fill="none"
                    height={iconSize}
                    initial={{ opacity: 0 }}
                    key="check"
                    transition={{ duration: 0.1 }}
                    viewBox="0 0 14 14"
                    width={iconSize}
                  >
                    <motion.path
                      animate={{ pathLength: 1 }}
                      d={checkPath}
                      initial={{ pathLength: 0 }}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                        delay: 0.1,
                      }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description) && (
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                className={cn(
                  'cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                )}
                htmlFor={checkboxId}
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

      {error && <p className="ml-6 text-destructive text-xs">{error}</p>}
    </div>
  );
});

CheckboxRoot.displayName = 'Checkbox';

// Simple wrapper that maintains the same API
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>((props, ref) => <CheckboxRoot ref={ref} {...props} />);

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants, type CheckboxProps };
