"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sidebarVariants = cva(
  "z-40 flex flex-col border-border border-r bg-background",
  {
    variants: {
      variant: {
        default: "bg-background",
        elevated: "bg-card",
        ghost: "bg-background/95 backdrop-blur-sm",
      },
      size: {
        sm: "w-12",
        default: "w-64",
        lg: "w-72",
        xl: "w-80",
      },
      position: {
        fixed: "fixed top-0 left-0 h-screen",
        relative: "relative h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "fixed",
    },
  }
);

const sidebarHeaderVariants = cva(
  "flex min-h-[3.5rem] items-center border-border border-b",
  {
    variants: {
      collapsed: {
        true: "justify-center px-2",
        false: "justify-between px-4",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

const sidebarItemVariants = cva(
  "group relative flex cursor-pointer items-center rounded-ele font-medium text-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:bg-accent hover:text-foreground",
        active: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      },
      collapsed: {
        true: "h-10 w-10 justify-center px-0 py-0",
        false: "px-3 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  overlay?: boolean;
  onOverlayClick?: () => void;
  position?: "fixed" | "relative";
  children: React.ReactNode;
}

const SidebarContext = React.createContext<{
  collapsed: boolean;
  activeItem?: string;
  onItemClick?: (item: { id: string; label: string; href?: string }) => void;
  sidebarId: string;
}>({
  collapsed: false,
  sidebarId: "",
});

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar");
  }
  return context;
};

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      position = "fixed",
      collapsed: controlledCollapsed,
      onCollapsedChange,
      collapsible = true,
      overlay = false,
      onOverlayClick,
      children,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(false);
    const [activeItem, setActiveItem] = React.useState<string>();
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const sidebarId = React.useId();

    const collapsed = controlledCollapsed ?? internalCollapsed;

    React.useImperativeHandle(ref, () => sidebarRef.current!);

    const handleToggleCollapse = () => {
      const newCollapsed = !collapsed;
      if (onCollapsedChange) {
        onCollapsedChange(newCollapsed);
      } else {
        setInternalCollapsed(newCollapsed);
      }
    };

    const handleItemClick = (item: {
      id: string;
      label: string;
      href?: string;
    }) => {
      setActiveItem(item.id);
    };

    React.useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768 && !collapsed) {
          handleToggleCollapse();
        }
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, [collapsed]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && overlay && !collapsed) {
          onOverlayClick?.();
        }
      };

      if (overlay) {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
      }
    }, [overlay, collapsed, onOverlayClick]);

    const focusableElementsRef = React.useRef<HTMLElement[]>([]);

    React.useEffect(() => {
      const updateFocusableElements = () => {
        if (sidebarRef.current) {
          const elements = sidebarRef.current.querySelectorAll(
            'button, a, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;
          focusableElementsRef.current = Array.from(elements);
        }
      };

      updateFocusableElements();

      const timeoutId = setTimeout(updateFocusableElements, 300);
      return () => clearTimeout(timeoutId);
    }, [collapsed]);

    const headerChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === SidebarHeader
    );
    const bodyChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === SidebarBody
    );
    const footerChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === SidebarFooter
    );

    const sidebarContent = (
      <SidebarContext.Provider
        value={{
          collapsed,
          activeItem,
          onItemClick: handleItemClick,
          sidebarId,
        }}
      >
        {" "}
        <motion.aside
          animate={{
            width: collapsed
              ? 57
              : size === "lg"
                ? 288
                : size === "xl"
                  ? 320
                  : 256,
          }}
          aria-expanded={!collapsed}
          aria-hidden={overlay && collapsed}
          aria-label={
            collapsed ? "Collapsed navigation sidebar" : "Navigation sidebar"
          }
          className={cn(
            sidebarVariants({
              variant,
              size: collapsed ? "sm" : size,
              position,
            }),
            className
          )}
          id={props.id || sidebarId}
          initial={false}
          ref={(node) => {
            const divNode = node as HTMLDivElement | null;
            if (typeof ref === "function") {
              ref(divNode);
            } else if (ref) {
              ref.current = divNode;
            }
            sidebarRef.current = divNode;
          }}
          role="complementary"
          style={props.style}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {}
          {(headerChild || collapsible) && (
            <div className={cn(sidebarHeaderVariants({ collapsed }))}>
              {collapsed ? (
                collapsible && (
                  <Button
                    aria-controls={sidebarId}
                    aria-expanded={false}
                    aria-label="Expand sidebar"
                    className="h-8 w-8 shrink-0"
                    onClick={handleToggleCollapse}
                    size="icon"
                    variant="ghost"
                  >
                    <ChevronRight size={16} />
                  </Button>
                )
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    {headerChild && (
                      <motion.div
                        animate={{ opacity: 1 }}
                        className="flex-1"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {headerChild}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {collapsible && (
                    <Button
                      aria-controls={sidebarId}
                      aria-expanded={true}
                      aria-label="Collapse sidebar"
                      className="h-8 w-8 shrink-0"
                      onClick={handleToggleCollapse}
                      size="icon"
                      variant="ghost"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {}
          {bodyChild}

          {}
          {footerChild && (
            <div
              className={cn(
                "border-border border-t",
                collapsed ? "p-2" : "p-3"
              )}
            >
              {footerChild}
            </div>
          )}
        </motion.aside>
      </SidebarContext.Provider>
    );
    if (overlay) {
      return (
        <>
          {}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                animate={{ opacity: 1 }}
                aria-hidden="true"
                className="fixed inset-0 z-30 bg-black/50 md:hidden"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                onClick={onOverlayClick}
                role="presentation"
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
          {sidebarContent}
        </>
      );
    }

    return sidebarContent;
  }
);

Sidebar.displayName = "Sidebar";

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

const SidebarBody: React.FC<SidebarBodyProps> = ({ children, className }) => {
  const { collapsed } = useSidebar();

  return (
    <ScrollArea
      className={cn("flex-1 py-2", collapsed ? "px-2" : "px-2", className)}
    >
      <nav aria-label="Main navigation" role="navigation">
        <ul className="flex list-none flex-col gap-1" role="list">
          {children}
        </ul>
      </nav>
    </ScrollArea>
  );
};

interface SidebarItemProps {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  level?: number;
  onClick?: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  icon: Icon,
  href,
  badge,
  children,
  level = 0,
  onClick,
  className,
}) => {
  const { collapsed, activeItem, onItemClick } = useSidebar();
  const [expanded, setExpanded] = React.useState(false);
  const isActive = activeItem === id;
  const hasChildren = React.Children.count(children) > 0;
  const itemId = React.useId();

  const handleClick = () => {
    if (hasChildren && !collapsed) {
      setExpanded(!expanded);
    }
    onItemClick?.({ id, label, href });
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    } else if (
      e.key === "ArrowRight" &&
      hasChildren &&
      !expanded &&
      !collapsed
    ) {
      e.preventDefault();
      setExpanded(true);
    } else if (e.key === "ArrowLeft" && hasChildren && expanded && !collapsed) {
      e.preventDefault();
      setExpanded(false);
    }
  };

  const ItemContent = (
    <>
      {}
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center",
          collapsed ? "h-10 w-10" : "ml-0 h-4 w-4"
        )}
      >
        {Icon && <Icon size={16} />}
      </div>

      {}
      {!collapsed && <span className="ml-3 flex-1 truncate">{label}</span>}

      {}
      {!collapsed && (badge || hasChildren) && (
        <div className="ml-2 flex items-center gap-2">
          {badge}
          {hasChildren && (
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "shrink-0 transition-transform duration-200",
                expanded && "rotate-90"
              )}
              size={14}
            />
          )}
        </div>
      )}

      {}
      {collapsed && (
        <div
          className="invisible absolute left-full z-50 ml-2 whitespace-nowrap rounded-ele border border-border bg-[hsl(var(--hu-popover))] px-2 py-1 text-[hsl(var(--hu-popover-foreground))] text-xs opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
          id={`${itemId}-tooltip`}
          role="tooltip"
        >
          {label}
        </div>
      )}
    </>
  );

  return (
    <li role="none">
      {href ? (
        <a
          aria-current={isActive ? "page" : undefined}
          aria-describedby={collapsed ? `${itemId}-tooltip` : undefined}
          className={cn(
            sidebarItemVariants({
              variant: isActive ? "active" : "default",
              collapsed,
            }),
            level > 0 &&
              !collapsed &&
              "before:-translate-y-1/2 relative ml-0 border-border pl-3 before:absolute before:top-1/2 before:left-[-2px] before:h-[1px] before:w-3 before:bg-border",
            "group relative no-underline",
            className
          )}
          href={href}
          onClick={onClick}
          role="menuitem"
        >
          {ItemContent}
        </a>
      ) : (
        <button
          aria-current={isActive ? "page" : undefined}
          aria-describedby={collapsed ? `${itemId}-tooltip` : undefined}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-haspopup={hasChildren ? "menu" : undefined}
          className={cn(
            sidebarItemVariants({
              variant: isActive ? "active" : "default",
              collapsed,
            }),
            level > 0 &&
              !collapsed &&
              "before:-translate-y-1/2 relative ml-0 border-border pl-3 before:absolute before:top-1/2 before:left-[-2px] before:h-[1px] before:w-3 before:bg-border",
            "group relative w-full border-none text-left",
            !isActive && "bg-transparent",
            className
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="menuitem"
          type="button"
        >
          {ItemContent}
        </button>
      )}

      {}
      <AnimatePresence>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ul
              aria-label={`${label} submenu`}
              className="ml-2 flex list-none flex-col gap-1 border-border/50 border-l py-1 pl-2"
              role="menu"
            >
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SidebarItem) {
                  return React.cloneElement(
                    child as React.ReactElement<SidebarItemProps>,
                    {
                      level: level + 1,
                      ...(child.props as SidebarItemProps),
                    }
                  );
                }
                return child;
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export interface SidebarContentProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  className?: string;
  position?: "fixed" | "relative";
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  sidebarCollapsed = false,
  className,
  position = "fixed",
}) => {
  if (position === "relative") {
    return (
      <main className={cn("flex-1", className)} role="main">
        {children}
      </main>
    );
  }
  return (
    <motion.main
      animate={{
        marginLeft: sidebarCollapsed ? 48 : 256,
      }}
      className={cn("flex-1", className)}
      initial={false}
      role="main"
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="md:hidden">
        <motion.div
          animate={{
            marginLeft: 0,
          }}
        >
          {children}
        </motion.div>
      </div>
      <div className="hidden md:block">{children}</div>
    </motion.main>
  );
};

const SidebarHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
};

const SidebarFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
};

const SidebarSeparator: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const { collapsed } = useSidebar();

  if (collapsed && children) {
    return (
      <div className={cn("my-2", className)}>
        <Separator className="mx-2" />
      </div>
    );
  }

  return (
    <div className={cn("my-2", className)}>
      <Separator className="mx-2">{children}</Separator>
    </div>
  );
};

const SidebarText: React.FC<{
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
}> = ({ children, className, animation = true }) => {
  const { collapsed } = useSidebar();

  if (!animation) {
    return collapsed ? null : <span className={className}>{children}</span>;
  }

  return (
    <AnimatePresence mode="wait">
      {!collapsed && (
        <motion.span
          animate={{ opacity: 1, width: "auto" }}
          className={cn("truncate", className)}
          exit={{ opacity: 0, width: 0 }}
          initial={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
  sidebarVariants,
  sidebarItemVariants,
  SidebarText,
};
