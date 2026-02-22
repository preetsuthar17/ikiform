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

const menubarVariants = cva("");
const menubarTriggerVariants = cva("");
const menubarContentVariants = cva("");
const menubarItemVariants = cva("");

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
