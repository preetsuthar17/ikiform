"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const scrollAreaVariants = cva("relative overflow-hidden", {
  variants: {
    orientation: {
      vertical: "h-full",
      horizontal: "w-full",
      both: "h-full w-full",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const scrollBarVariants = cva("flex touch-none select-none transition-colors", {
  variants: {
    orientation: {
      vertical: "h-full w-2 border-l border-l-transparent p-[1px]",
      horizontal: "h-2 w-full border-t border-t-transparent p-[1px]",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {
  scrollHideDelay?: number;
  type?: "auto" | "always" | "scroll" | "hover";
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      orientation: propOrientation,
      scrollHideDelay = 600,
      type = "hover",
      ...props
    },
    ref
  ) => {
    const orientation = propOrientation || "vertical";
    return (
      <ScrollAreaPrimitive.Root
        className={cn(scrollAreaVariants({ orientation }), className)}
        ref={ref}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
          {children}
        </ScrollAreaPrimitive.Viewport>
        {(orientation === "vertical" || orientation === "both") && (
          <ScrollBar
            orientation="vertical"
            scrollHideDelay={scrollHideDelay}
            type={type}
          />
        )}
        {(orientation === "horizontal" || orientation === "both") && (
          <ScrollBar
            orientation="horizontal"
            scrollHideDelay={scrollHideDelay}
            type={type}
          />
        )}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  scrollHideDelay?: number;
  type?: "auto" | "always" | "scroll" | "hover";
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(
  (
    { className, orientation = "vertical", scrollHideDelay, type, ...props },
    ref
  ) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      className={cn(
        scrollBarVariants({ orientation }),
        "hover:bg-accent",
        className
      )}
      orientation={orientation}
      ref={ref}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-2xl bg-border transition-colors hover:bg-foreground/30" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar, scrollAreaVariants };
