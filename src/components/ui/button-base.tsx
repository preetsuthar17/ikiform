'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from './loader';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-ele font-medium text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-muted-foreground/10 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm/2 hover:bg-primary/90 focus-visible:ring-ring',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm/2 hover:bg-destructive/90 focus-visible:ring-destructive',
        outline:
          'border border-border text-foreground shadow-sm/2 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        link: 'text-secondary-foreground underline-offset-4 hover:underline focus-visible:ring-ring',
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

export type CustomButtonProps = Omit<
  ButtonProps,
  keyof React.ComponentProps<'button'>
>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const content = (
      <>
        {loading && <Loader className="animate-spin" />}
        {leftIcon && !loading && leftIcon}
        {children}
        {rightIcon && !loading && rightIcon}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {asChild ? children : content}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
