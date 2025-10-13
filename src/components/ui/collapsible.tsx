"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const collapsibleVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      outline: "rounded-2xl border border-border",
      ghost: "",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const collapsibleTriggerVariants = cva(
  "mb-2 flex w-full items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded hover:bg-accent hover:text-accent-foreground",
        outline:
          "rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground",
        ghost: "rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        default: "px-3 py-2",
        lg: "px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const collapsibleContentVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      default: "",
      outline: "px-3 pb-3",
      ghost: "px-2 pb-2",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface CollapsibleProps
  extends VariantProps<typeof collapsibleVariants> {
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export interface CollapsibleTriggerProps
  extends VariantProps<typeof collapsibleTriggerVariants> {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export interface CollapsibleContentProps
  extends VariantProps<typeof collapsibleContentVariants> {
  className?: string;
  children?: React.ReactNode;
}

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(({ className, variant, size, children, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    className={cn(collapsibleVariants({ variant, size }), className)}
    ref={ref}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Root>
));
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ className, variant, size, children, asChild = false, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    asChild={asChild}
    className={cn(collapsibleTriggerVariants({ variant, size }), className)}
    ref={ref}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(({ className, children, variant, size, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
    ref={ref}
    {...props}
  >
    <div
      className={cn(collapsibleContentVariants({ variant, size }), className)}
    >
      {children}
    </div>
  </CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
