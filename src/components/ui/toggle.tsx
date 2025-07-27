'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ele text-sm shadow-sm/2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
        outline:
          'border border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(
  (
    { className, variant, size, leftIcon, rightIcon, children, ...props },
    ref
  ) => (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </TogglePrimitive.Root>
  )
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
