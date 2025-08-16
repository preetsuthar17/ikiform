import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button-base';

const paginationVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: 'gap-1',
      compact: 'gap-0.5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const paginationItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-9 w-9 rounded-ele text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        outline:
          'h-9 w-9 rounded-ele border border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        ghost:
          'h-9 w-9 rounded-ele text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
      },
      size: {
        default: 'h-9 w-9',
        sm: 'h-8 w-8 text-xs',
        lg: 'h-10 w-10',
      },
      state: {
        default: '',
        active:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus-visible:ring-ring',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const paginationNavVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-ele px-3 text-foreground text-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 max-sm:grow',
  {
    variants: {
      size: {
        default: 'h-9',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-10 px-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {}

export interface PaginationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationItemVariants> {
  isActive?: boolean;
}

export interface PaginationNavProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationNavVariants> {}

export interface PaginationEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, variant, ...props }, ref) => (
    <nav
      aria-label="pagination"
      className={cn(paginationVariants({ variant, className }))}
      ref={ref}
      role="navigation"
      {...props}
    />
  )
);
Pagination.displayName = 'Pagination';

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ className, variant, size, state, isActive, ...props }, ref) => (
    <button
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        paginationItemVariants({
          variant,
          size,
          state: isActive ? 'active' : state,
          className,
        })
      )}
      ref={ref}
      {...props}
    />
  )
);
PaginationItem.displayName = 'PaginationItem';

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationNavProps
>(({ className, size, children, ...props }, ref) => (
  <Button
    className={cn(paginationNavVariants({ size, className }))}
    ref={ref}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    {children || 'Previous'}
  </Button>
));
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNavProps>(
  ({ className, size, children, ...props }, ref) => (
    <Button
      className={cn(paginationNavVariants({ size, className }))}
      ref={ref}
      {...props}
    >
      {children || 'Next'}
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, ...props }, ref) => (
  <span
    className={cn(
      'inline-flex h-9 w-9 items-center justify-center text-muted-foreground',
      className
    )}
    ref={ref}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  paginationVariants,
  paginationItemVariants,
  paginationNavVariants,
};
