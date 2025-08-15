'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex items-center justify-center rounded-card border font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
        sm: 'h-6 gap-1 px-2 text-sm',
        default: 'h-7 gap-1.5 px-3 text-sm',
        lg: 'h-8 gap-2 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      iconPosition = 'left',
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 14 : 12;
    const closeIconSize = size === 'sm' ? 10 : size === 'lg' ? 12 : 10;

    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };

    return (
      <div
        className={cn(chipVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <Icon className="shrink-0" size={iconSize} />
        )}
        {children}
        {Icon && iconPosition === 'right' && !dismissible && (
          <Icon className="shrink-0" size={iconSize} />
        )}
        {dismissible && (
          <button
            aria-label="Remove"
            className="shrink-0 rounded-card p-0.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            onClick={handleDismiss}
            type="button"
          >
            <X size={closeIconSize} />
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = 'Chip';

export { Chip, chipVariants };
