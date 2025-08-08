'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Loader as LucideLoader } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const loaderVariants = cva('inline-block', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface LoaderProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof loaderVariants> {}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, size, variant, ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    return (
      <LucideLoader
        aria-label="Loading"
        className={cn(
          loaderVariants({ size, variant }),
          isMounted && 'animate-spin',
          className
        )}
        fill="none"
        ref={ref}
        role="status"
        suppressHydrationWarning
        {...props}
      />
    );
  }
);

Loader.displayName = 'Loader';

export { Loader, loaderVariants };
