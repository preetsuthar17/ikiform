"use client";

import { cva } from "class-variance-authority";
import * as React from "react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar";

const menubarVariants = cva("bg-background h-9 gap-1 rounded-md border p-1 shadow-xs flex items-center");
const menubarTriggerVariants = cva("hover:bg-muted aria-expanded:bg-muted rounded-sm px-2 py-1 text-sm font-medium flex items-center outline-hidden select-none");
const menubarContentVariants = cva("bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 min-w-36 rounded-md p-1 shadow-md ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2");
const menubarItemVariants = cva("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2 rounded-sm px-2 py-1.5 text-sm data-disabled:opacity-50 data-inset:pl-8 [&_svg:not([class*='size-'])]:size-4 group/menubar-item");

const MenuBar = Menubar;
const MenuBarMenu = MenubarMenu;
const MenuBarTrigger = MenubarTrigger;
const MenuBarContent = MenubarContent;
const MenuBarItem = MenubarItem;
const MenuBarSeparator = MenubarSeparator;
const MenuBarSub = MenubarSub;
const MenuBarSubTrigger = MenubarSubTrigger;
const MenuBarSubContent = MenubarSubContent;

const AnimatedMenuContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
	<div ref={ref} {...props}>
		{children}
	</div>
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
