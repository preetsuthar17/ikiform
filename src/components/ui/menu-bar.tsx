"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const menubarVariants = cva(
  "scrollbar-hide flex w-full max-w-full items-center overflow-x-auto rounded-2xl border border-border bg-background transition-all",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        outline: "border-2 border-border bg-background",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        sm: "gap-1 p-1.5 sm:gap-1 sm:p-2",
        default: "gap-1.5 p-1.5 sm:gap-2 sm:p-2",
        lg: "gap-2 p-2 sm:gap-3 sm:p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const menubarTriggerVariants = cva(
  "flex cursor-default touch-manipulation select-none items-center whitespace-nowrap rounded-[calc(var(--card-radius)-5px)] outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground active:bg-accent active:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        ghost:
          "text-foreground hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground",
      },
      size: {
        sm: "min-h-[2rem] gap-1 px-2.5 py-1.5 text-xs sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm [&_svg]:size-3 sm:[&_svg]:size-4",
        default:
          "min-h-[2.5rem] gap-1.5 px-3 py-2 text-sm sm:gap-2 sm:px-4 sm:py-2.5 [&_svg]:size-4",
        lg: "min-h-[3rem] gap-2 px-4 py-2.5 text-sm sm:gap-2.5 sm:px-5 sm:py-3 sm:text-base [&_svg]:size-4 sm:[&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const menubarContentVariants = cva(
  "z-50 mt-2 min-w-[12rem] max-w-[95vw] overflow-hidden rounded-2xl border border-border bg-background p-1.5 text-foreground sm:max-w-[350px] sm:p-2",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        accent: "border-accent bg-accent text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const menubarItemVariants = cva(
  "relative flex min-h-[44px] cursor-default touch-manipulation select-none items-center gap-2 rounded-[calc(var(--card-radius)-5px)] px-2.5 py-2 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:min-h-auto sm:px-3 sm:py-2.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground active:bg-accent active:text-accent-foreground",
        destructive:
          "text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground active:bg-destructive active:text-destructive-foreground",
      },
      inset: {
        true: "pl-6 sm:pl-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  }
);

interface MenuBarProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>,
    VariantProps<typeof menubarVariants> {
  responsive?: boolean;
}

interface MenuBarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>,
    VariantProps<typeof menubarTriggerVariants> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

interface MenuBarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>,
    VariantProps<typeof menubarContentVariants> {}

interface MenuBarItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>,
    VariantProps<typeof menubarItemVariants> {
  icon?: LucideIcon;
  shortcut?: string;
}

const MenuBar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  MenuBarProps
>(({ className, variant, size, responsive = false, ...props }, ref) => (
  <div className={responsive ? "scrollbar-hide w-full overflow-x-auto" : ""}>
    <MenubarPrimitive.Root
      className={cn(
        menubarVariants({ variant, size }),
        responsive && "min-w-max",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
MenuBar.displayName = "MenuBar";

const MenuBarMenu = MenubarPrimitive.Menu;

const MenuBarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  MenuBarTriggerProps
>(
  (
    {
      className,
      variant,
      size,
      icon: Icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;
    const mobileIconSize = size === "sm" ? 12 : size === "lg" ? 16 : 14;

    return (
      <MenubarPrimitive.Trigger
        asChild
        className={cn(menubarTriggerVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <motion.button
          className="flex items-center gap-1.5 sm:gap-2"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.1,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {Icon && iconPosition === "left" && (
            <motion.div
              transition={{ duration: 0.15 }}
              whileHover={{ rotate: 5 }}
            >
              <Icon className="hidden shrink-0 sm:block" size={iconSize} />
              <Icon
                className="block shrink-0 sm:hidden"
                size={mobileIconSize}
              />
            </motion.div>
          )}
          <span className="truncate">{children}</span>
          {Icon && iconPosition === "right" && (
            <motion.div
              transition={{ duration: 0.15 }}
              whileHover={{ rotate: -5 }}
            >
              <Icon className="hidden shrink-0 sm:block" size={iconSize} />
              <Icon
                className="block shrink-0 sm:hidden"
                size={mobileIconSize}
              />
            </motion.div>
          )}
        </motion.button>
      </MenubarPrimitive.Trigger>
    );
  }
);
MenuBarTrigger.displayName = "MenuBarTrigger";

const MenuBarSub = MenubarPrimitive.Sub;

const MenuBarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
    icon?: LucideIcon;
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    className={cn(
      "flex min-h-[44px] cursor-default touch-manipulation select-none items-center gap-2 rounded-xl px-2.5 py-2 text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-accent active:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground sm:min-h-auto sm:px-3 sm:py-2.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-6 sm:pl-8",
      className
    )}
    ref={ref}
    {...props}
  >
    <motion.div
      className="flex w-full items-center gap-1.5 text-sm sm:gap-2"
      transition={{ duration: 0.1 }}
      whileHover={{ x: 2 }}
    >
      {Icon && (
        <>
          <Icon className="block shrink-0 sm:hidden" size={14} />
          <Icon className="hidden shrink-0 sm:block" size={16} />
        </>
      )}
      <span className="flex-1 truncate">{children}</span>
      <svg
        className="ml-auto h-3.5 w-3.5 sm:h-4 sm:w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 5l7 7-7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </motion.div>
  </MenubarPrimitive.SubTrigger>
));
MenuBarSubTrigger.displayName = "MenuBarSubTrigger";

const MenuBarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    asChild
    className={cn(
      "z-50 min-w-[10rem] max-w-[95vw] overflow-hidden rounded-xl border border-border bg-background p-1.5 text-foreground sm:max-w-[280px] sm:p-2",
      className
    )}
    ref={ref}
    {...props}
  >
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        x: -8,
      }}
      initial={{
        opacity: 0,
        scale: 0.95,
        x: -8,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8,
        duration: 0.15,
      }}
    >
      {props.children}
    </motion.div>
  </MenubarPrimitive.SubContent>
));
MenuBarSubContent.displayName = "MenuBarSubContent";

const MenuBarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  MenuBarContentProps
>(
  (
    {
      className,
      variant,
      align = "start",
      alignOffset = -4,
      sideOffset = 8,
      ...props
    },
    ref
  ) => (
    <AnimatePresence>
      <MenubarPrimitive.Portal>
        <MenubarPrimitive.Content
          align={align}
          alignOffset={alignOffset}
          asChild
          className={cn(menubarContentVariants({ variant }), className)}
          ref={ref}
          sideOffset={sideOffset}
          {...props}
        >
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -8,
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: -8,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
              duration: 0.2,
            }}
          >
            {props.children}
          </motion.div>
        </MenubarPrimitive.Content>
      </MenubarPrimitive.Portal>
    </AnimatePresence>
  )
);
MenuBarContent.displayName = "MenuBarContent";

const MenuBarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  MenuBarItemProps
>(
  (
    { className, variant, inset, icon: Icon, shortcut, children, ...props },
    ref
  ) => (
    <MenubarPrimitive.Item
      asChild
      className={cn(menubarItemVariants({ variant, inset }), className)}
      ref={ref}
      {...props}
    >
      <motion.div
        className="flex w-full items-center gap-1.5 sm:gap-2"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.1,
        }}
        whileHover={{
          scale: 1.02,
          x: 2,
        }}
        whileTap={{
          scale: 0.98,
        }}
      >
        {Icon && (
          <>
            <Icon className="block shrink-0 sm:hidden" size={14} />
            <Icon className="hidden shrink-0 sm:block" size={16} />
          </>
        )}
        <span className="flex-1 truncate">{children}</span>
        {shortcut && (
          <motion.span
            className="ml-auto hidden font-mono text-muted-foreground text-xs tracking-widest sm:inline"
            initial={{ opacity: 0.6 }}
            transition={{ duration: 0.15 }}
            whileHover={{ opacity: 1 }}
          >
            {shortcut}
          </motion.span>
        )}
      </motion.div>
    </MenubarPrimitive.Item>
  )
);
MenuBarItem.displayName = "MenuBarItem";

const MenuBarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    className={cn("mx-1 my-2 h-px bg-border", className)}
    ref={ref}
    {...props}
  />
));
MenuBarSeparator.displayName = "MenuBarSeparator";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const AnimatedMenuContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <motion.div
    animate="visible"
    className={className}
    initial="hidden"
    ref={ref}
    style={props.style}
    variants={containerVariants}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div key={index} variants={itemVariants}>
        {child}
      </motion.div>
    ))}
  </motion.div>
));
AnimatedMenuContainer.displayName = "AnimatedMenuContainer";

export {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
  menubarVariants,
  menubarTriggerVariants,
  menubarContentVariants,
  menubarItemVariants,
  AnimatedMenuContainer,
};
