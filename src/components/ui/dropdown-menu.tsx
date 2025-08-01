'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronRight, Circle, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const MotionContent = React.forwardRef<
  React.ElementRef<typeof motion.div>,
  React.ComponentPropsWithoutRef<typeof motion.div> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  }
>(({ children, side = 'bottom', ...props }, ref) => {
  const getInitialPosition = () => {
    switch (side) {
      case 'top':
        return { y: 8 };
      case 'right':
        return { x: -8 };
      case 'left':
        return { x: 8 };
      default:
        return { y: -8 };
    }
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        ...getInitialPosition(),
      }}
      initial={{
        opacity: 0,
        scale: 0.95,
        ...getInitialPosition(),
      }}
      ref={ref}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.2,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionContent.displayName = 'MotionContent';

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    icon?: LucideIcon;
  }
>(({ className, inset, children, icon: Icon, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      'flex cursor-default touch-manipulation select-none items-center gap-2 rounded-ele px-3 py-2.5 text-sm outline-none transition-colors sm:py-2',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      'active:bg-accent active:text-accent-foreground',
      inset && 'pl-8',
      className
    )}
    ref={ref}
    {...props}
  >
    <motion.div
      className="flex w-full items-center gap-2 text-sm"
      transition={{ duration: 0.1 }}
      whileHover={{ x: 2 }}
    >
      {Icon && <Icon className="shrink-0" size={16} />}
      <span className="flex-1">{children}</span>
      <ChevronRight className="ml-auto h-4 w-4" />
    </motion.div>
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    asChild
    className={cn(
      'z-50 min-w-[8rem] max-w-[95vw] overflow-hidden rounded-ele border border-border bg-background p-1 text-foreground shadow-lg sm:max-w-[280px]',
      className
    )}
    ref={ref}
    {...props}
  >
    <motion.div
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -8 }}
      initial={{ opacity: 0, scale: 0.95, x: -8 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        duration: 0.15,
      }}
    >
      {children}
    </motion.div>
  </DropdownMenuPrimitive.SubContent>
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <AnimatePresence>
      <DropdownMenuPrimitive.Content
        asChild
        className={cn(
          'z-50 min-w-[8rem] max-w-[95vw] overflow-hidden rounded-ele border border-border bg-background p-1 text-foreground shadow-xl sm:max-w-[350px]',
          className
        )}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      >
        <MotionContent>{children}</MotionContent>
      </DropdownMenuPrimitive.Content>
    </AnimatePresence>
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const dropdownMenuItemVariants = cva(
  'relative flex cursor-default touch-manipulation select-none items-center gap-2 rounded-[calc(var(--radius)-4px)] px-3 py-2.5 text-sm outline-none transition-colors sm:py-2',
  {
    variants: {
      variant: {
        default:
          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground active:bg-accent active:text-accent-foreground',
        destructive:
          'text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground active:bg-destructive active:text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    icon?: LucideIcon;
    shortcut?: string;
  } & VariantProps<typeof dropdownMenuItemVariants>
>(
  (
    { className, variant, inset, icon: Icon, shortcut, children, ...props },
    ref
  ) => (
    <DropdownMenuPrimitive.Item
      className={cn(
        dropdownMenuItemVariants({ variant }),
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        inset && 'pl-8',
        className
      )}
      ref={ref}
      {...props}
    >
      <motion.div
        className="flex w-full items-center gap-2 text-sm"
        transition={{ duration: 0.1 }}
        whileHover={{ x: 2 }}
      >
        {Icon && <Icon className="shrink-0" size={16} />}
        <span className="flex-1 text-sm">{children}</span>
        {shortcut && (
          <Kbd className="ml-auto text-xs tracking-widest opacity-60" size="xs">
            {shortcut}
          </Kbd>
        )}
      </motion.div>
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    icon?: LucideIcon;
  }
>(({ className, children, checked, icon: Icon, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    checked={checked}
    className={cn(
      'relative flex cursor-default touch-manipulation select-none items-center rounded-[calc(var(--radius)-4px)] py-2.5 pr-3 pl-8 text-sm outline-none transition-colors sm:py-2',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'active:bg-accent active:text-accent-foreground',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Check className="h-4 w-4" />
        </motion.div>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <motion.div
      className="flex w-full items-center gap-2 text-sm"
      transition={{ duration: 0.1 }}
      whileHover={{ x: 2 }}
    >
      {Icon && <Icon className="shrink-0" size={16} />}
      {children}
    </motion.div>
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    icon?: LucideIcon;
  }
>(({ className, children, icon: Icon, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      'relative flex cursor-default touch-manipulation select-none items-center rounded-[calc(var(--radius)-4px)] py-2.5 pr-3 pl-8 text-sm outline-none transition-colors sm:py-2',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:bg-accent focus:text-accent-foreground',
      'active:bg-accent active:text-accent-foreground',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Circle className="h-2 w-2 fill-current" />
        </motion.div>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    <motion.div
      className="flex w-full items-center gap-2 text-sm"
      transition={{ duration: 0.1 }}
      whileHover={{ x: 2 }}
    >
      {Icon && <Icon className="shrink-0" size={16} />}
      {children}
    </motion.div>
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
    icon?: LucideIcon;
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    className={cn(
      'flex items-center gap-2 px-3 py-1.5 font-semibold text-muted-foreground text-sm',
      inset && 'pl-8',
      className
    )}
    ref={ref}
    {...props}
  >
    {Icon && <Icon className="shrink-0" size={16} />}
    {children}
  </DropdownMenuPrimitive.Label>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    ref={ref}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  dropdownMenuItemVariants,
};
