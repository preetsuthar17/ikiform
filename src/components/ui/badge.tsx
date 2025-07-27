'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'flex items-center justify-center gap-1.5 rounded-[calc(var(--radius)-4px)] border font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm/2 hover:bg-primary/80 focus-visible:ring-ring',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm/2 hover:bg-destructive/80 focus-visible:ring-destructive',
        outline:
          'border-border text-foreground shadow-sm/2 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        ghost:
          'border-transparent text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
      },
      size: {
        sm: 'h-5 px-2',
        default: 'h-6 px-2.5',
        lg: 'h-7 px-3 text-sm',
        icon: 'h-6 w-6 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

function Badge({
  className,
  variant,
  size,
  icon: Icon,
  iconPosition = 'left',
  children,
  ...props
}: BadgeProps) {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 14 : 12;

  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className="shrink-0" size={iconSize} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className="shrink-0" size={iconSize} />
      )}
    </span>
  );
}

export { Badge, badgeVariants };
