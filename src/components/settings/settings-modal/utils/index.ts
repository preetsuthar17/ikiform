// Internal imports
import { cn } from "@/lib/utils";

export const getModalContentStyles = (): string => {
  return "max-w-6xl h-[85vh] flex flex-col gap-4 overflow-hidden";
};

export const getSidebarStyles = (): string => {
  return "w-52 border-r border-border flex flex-col gap-2";
};

export const getDesktopLayoutStyles = (): string => {
  return "hidden md:flex h-full gap-4";
};

export const getMobileLayoutStyles = (): string => {
  return "md:hidden flex flex-col h-full gap-4";
};

export const getNavigationItemStyles = (isActive: boolean): string => {
  return cn(
    "w-full text-left items-center justify-start transition-all gap-2",
    isActive
      ? "bg-secondary text-secondary-foreground"
      : "hover:bg-accent hover:text-accent-foreground"
  );
};

export const getHeaderStyles = (): string => {
  return "flex items-center justify-between gap-4";
};

export const getContentAreaStyles = (): string => {
  return "flex-1 flex flex-col gap-4";
};
