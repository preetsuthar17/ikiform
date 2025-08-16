'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const accordionVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'overflow-hidden rounded-card border border-border',
      ghost: '',
      outline: 'rounded-card border border-border',
    },
    size: {
      sm: 'max-w-lg text-sm',
      default: '',
      lg: 'max-w-4xl text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const accordionItemVariants = cva('border-border border-b last:border-b-0', {
  variants: {
    variant: {
      default: '',
      ghost: 'mb-2 border-border border-b last:mb-0 last:border-b-0',
      outline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionTriggerVariants = cva(
  'group flex flex-1 items-center justify-between px-6 py-4 text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        ghost: 'px-0',
        outline: '',
      },
      size: {
        sm: 'px-4 py-3 text-sm',
        default: 'px-6 py-4',
        lg: 'px-6 py-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const accordionContentVariants = cva('px-6 pt-0 pb-4 text-muted-foreground', {
  variants: {
    variant: {
      default: '',
      ghost: 'px-0',
      outline: '',
    },
    size: {
      sm: 'px-4 pb-3 text-sm',
      default: 'px-6 pb-4',
      lg: 'px-6 pb-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface AccordionProps extends VariantProps<typeof accordionVariants> {
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionSingleProps extends AccordionProps {
  type: 'single';
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface AccordionMultipleProps extends AccordionProps {
  type: 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionCombinedProps =
  | AccordionSingleProps
  | AccordionMultipleProps;

export interface AccordionItemProps
  extends VariantProps<typeof accordionItemVariants> {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionTriggerProps
  extends VariantProps<typeof accordionTriggerVariants> {
  icon?: React.ReactNode;
  hideChevron?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export interface AccordionContentProps
  extends VariantProps<typeof accordionContentVariants> {
  className?: string;
  children?: React.ReactNode;
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionCombinedProps
>(({ className, variant, size, children, ...props }, ref) => (
  <AccordionPrimitive.Root
    className={cn(accordionVariants({ variant, size }), className)}
    ref={ref}
    {...props}
  >
    {children}
  </AccordionPrimitive.Root>
));
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    className={cn(accordionItemVariants({ variant }), className)}
    ref={ref}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    { className, children, variant, size, icon, hideChevron = false, ...props },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(accordionTriggerVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="text-left transition-all duration-200 group-hover:underline">
            {children}
          </span>
        </div>
        {!hideChevron && (
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant, size, ...props }, ref) => (
  <AccordionPrimitive.Content
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    ref={ref}
    {...props}
  >
    <div className={cn(accordionContentVariants({ variant, size }), className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
