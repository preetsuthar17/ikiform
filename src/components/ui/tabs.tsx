"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const tabsVariants = cva(
  "relative inline-flex w-full items-center justify-center rounded-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-border bg-background",
        ghost: "bg-transparent",
        underline: "rounded-none border-border border-b bg-transparent",
      },
      size: {
        sm: "h-9 p-1",
        default: "h-10 p-1.5",
        lg: "h-12 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const tabTriggerVariants = cva(
  "relative inline-flex flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:text-foreground data-[state=active]:text-primary-foreground",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground",
        underline:
          "rounded-none text-muted-foreground hover:text-foreground data-[state=active]:text-accent-foreground",
      },
      size: {
        sm: "px-2.5 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TabItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
}

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  indicatorColor?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      variant,
      size,
      items,
      defaultValue,
      value,
      onValueChange,
      indicatorColor = "hsl(var(--hu-accent))",
      ...props
    },
    ref
  ) => {
    const [activeValue, setActiveValue] = React.useState(
      value || defaultValue || items[0]?.id
    );
    const [activeTabBounds, setActiveTabBounds] = React.useState({
      left: 0,
      width: 0,
    });

    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    React.useEffect(() => {
      if (value !== undefined) {
        setActiveValue(value);
      }
    }, [value]);

    React.useEffect(() => {
      const activeIndex = items.findIndex(
        (item: TabItem) => item.id === activeValue
      );
      const activeTab = tabRefs.current[activeIndex];

      if (activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentElement?.getBoundingClientRect();

        if (containerRect) {
          setActiveTabBounds({
            left: tabRect.left - containerRect.left,
            width: tabRect.width,
          });
        }
      }
    }, [activeValue, items]);

    const handleTabClick = (tabId: string) => {
      setActiveValue(tabId);
      onValueChange?.(tabId);
    };

    return (
      <div
        className={cn(tabsVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {" "}
        {/* Animated indicator */}
        <motion.div
          animate={{
            left: activeTabBounds.left,
            width: activeTabBounds.width,
          }}
          className={cn(
            "absolute z-10",
            variant === "underline"
              ? "bottom-0 h-0.5 rounded-none"
              : "top-1 bottom-1 rounded-md"
          )}
          initial={false}
          style={{
            backgroundColor:
              variant === "underline"
                ? "hsl(var(--hu-foreground))"
                : indicatorColor,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
        {/* Tab triggers */}
        {items.map((item: TabItem, index: number) => {
          const isActive = activeValue === item.id;

          return (
            <button
              className={cn(
                tabTriggerVariants({ variant, size }),
                "relative z-20 gap-2 text-muted-foreground data-[state=active]:text-accent-foreground"
              )}
              data-state={isActive ? "active" : "inactive"}
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
            >
              {item.icon && <span className="[&_svg]:size-4">{item.icon}</span>}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

// Content component for tab panels
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeValue?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, activeValue, children, ...props }, ref) => {
    const isActive = value === activeValue;

    if (!isActive) return null;

    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onTransitionEnd,
      ...divProps
    } = props;

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        exit={{ opacity: 0, y: 4 }}
        initial={{ opacity: 0, y: 4 }}
        ref={ref}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...divProps}
      >
        {children}
      </motion.div>
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsContent, tabsVariants };
