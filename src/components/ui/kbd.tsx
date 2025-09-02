"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const kbdVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center rounded-ele border border-border border-b-3 bg-muted font-mono text-muted-foreground text-xs transition-all duration-75 hover:bg-muted/80 active:translate-y-[1px] active:border-b-[1px]",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-foreground hover:bg-accent",
        solid:
          "border-foreground bg-foreground text-background hover:bg-foreground/90",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        xs: "h-5 min-w-[1.25rem] px-1.5 text-[10px]",
        sm: "h-6 min-w-[1.5rem] px-2 text-xs",
        md: "h-7 min-w-[1.75rem] px-2.5 text-sm",
        lg: "h-8 min-w-[2rem] px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  keys?: string[];
  onClick?: () => void;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, keys, children, onClick, ...props }, ref) => {
    if (keys && keys.length > 0) {
      return (
        <span
          className="inline-flex items-center gap-1"
          onClick={onClick}
          ref={ref as React.Ref<HTMLSpanElement>}
        >
          {keys.map((key, index) => (
            <React.Fragment key={index}>
              <kbd
                className={cn(kbdVariants({ variant, size }), className)}
                {...props}
              >
                {key}
              </kbd>
              {index < keys.length - 1 && (
                <span className="px-1 text-muted-foreground text-xs">+</span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return (
      <kbd
        className={cn(kbdVariants({ variant, size }), className)}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
