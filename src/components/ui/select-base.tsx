"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const selectTriggerVariants = cva(
  "flex h-9 w-full items-center justify-between gap-3 rounded-ele border border border-border border-border bg-background bg-input px-3 py-2 text-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default: "shadow-sm/2 hover:bg-accent hover:text-accent-foreground",
        outline: "border-2 shadow-sm/2 hover:border-ring",
        ghost:
          "border-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 gap-2 p-2 text-xs",
        default: "h-9 gap-3 p-3",
        lg: "h-10 gap-4 p-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const selectContentVariants = cva(
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[300px] min-w-[8rem] overflow-hidden rounded-card border border-border bg-background text-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in",
  {
    variants: {
      position: {
        popper:
          "data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1",
        "item-aligned": "",
      },
    },
    defaultVariants: {
      position: "popper",
    },
  },
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value> & {
    placeholder?: string;
  }
>(({ className, placeholder, ...props }, ref) => (
  <SelectPrimitive.Value
    className={cn("select-none text-sm", className)}
    placeholder={
      placeholder && (
        <span className="select-none text-muted-foreground">{placeholder}</span>
      )
    }
    ref={ref}
    {...props}
  />
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  icon?: LucideIcon;
  placeholder?: string;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    { className, children, variant, size, icon: Icon, placeholder, ...props },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      className={cn(
        "group",
        selectTriggerVariants({ variant, size }),
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {Icon && <Icon className="shrink-0 text-muted-foreground" size={16} />}
        <span className="truncate">{children}</span>
      </div>{" "}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className="shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180"
          size={16}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  position?: "popper" | "item-aligned";
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(selectContentVariants({ position }), className)}
      position={position}
      ref={ref}
      {...props}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent max-h-[280px] overflow-y-auto p-2",
            position === "popper" &&
              "h-fit w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </motion.div>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    className={cn(
      "px-3 py-2 font-semibold text-muted-foreground text-xs",
      className,
    )}
    ref={ref}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: LucideIcon;
  disableCheckAnimation?: boolean;
}

const SelectItem = React.memo(
  React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    SelectItemProps
  >(
    (
      { className, children, icon: Icon, disableCheckAnimation, ...props },
      ref,
    ) => (
      <SelectPrimitive.Item
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-ele py-2 pr-8 pl-3 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        <motion.div
          className="flex w-full items-center gap-2"
          transition={{ duration: 0.1 }}
          whileHover={{ x: 2 }}
        >
          {Icon && <Icon className="shrink-0" size={16} />}
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </motion.div>
        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            {disableCheckAnimation ? (
              <Check size={16} />
            ) : (
              <motion.div
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Check size={16} />
              </motion.div>
            )}
          </SelectPrimitive.ItemIndicator>
        </span>
      </SelectPrimitive.Item>
    ),
  ),
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    ref={ref}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  selectTriggerVariants,
};

export const MemoizedSelectItem = React.memo(SelectItem);
