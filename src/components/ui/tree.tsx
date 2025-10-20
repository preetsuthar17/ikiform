"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TreeContextType {
  expandedIds: Set<string>;
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  handleSelection: (nodeId: string, ctrlKey?: boolean) => void;
  showLines: boolean;
  showIcons: boolean;
  selectable: boolean;
  multiSelect: boolean;
  animateExpand: boolean;
  indent: number;
  onNodeClick?: (nodeId: string, data?: any) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
}

const TreeContext = React.createContext<TreeContextType | null>(null);

const useTree = () => {
  const context = React.useContext(TreeContext);
  if (!context) {
    throw new Error("Tree components must be used within a TreeProvider");
  }
  return context;
};

const treeVariants = cva(
  "w-full rounded-xl border border-border bg-background",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const treeItemVariants = cva(
  "group relative flex cursor-pointer items-center rounded-[calc(var(--card-radius)-8px)] px-3 py-2 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ghost: "hover:bg-accent/50",
        subtle: "hover:bg-muted/50",
      },
      selected: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  }
);

export interface TreeProviderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof treeVariants> {
  defaultExpandedIds?: string[];
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onNodeClick?: (nodeId: string, data?: any) => void;
  onNodeExpand?: (nodeId: string, expanded: boolean) => void;
  showLines?: boolean;
  showIcons?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  animateExpand?: boolean;
  indent?: number;
}

const TreeProvider = React.forwardRef<HTMLDivElement, TreeProviderProps>(
  (
    {
      className,
      variant,
      size,
      children,
      defaultExpandedIds = [],
      selectedIds = [],
      onSelectionChange,
      onNodeClick,
      onNodeExpand,
      showLines = true,
      showIcons = true,
      selectable = true,
      multiSelect = false,
      animateExpand = true,
      indent = 20,
      ...props
    },
    ref
  ) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
      new Set(defaultExpandedIds)
    );
    const [internalSelectedIds, setInternalSelectedIds] =
      React.useState<string[]>(selectedIds);

    const isControlled = onSelectionChange !== undefined;
    const currentSelectedIds = isControlled ? selectedIds : internalSelectedIds;

    const toggleExpanded = React.useCallback(
      (nodeId: string) => {
        setExpandedIds((prev) => {
          const newSet = new Set(prev);
          const isExpanded = newSet.has(nodeId);
          isExpanded ? newSet.delete(nodeId) : newSet.add(nodeId);
          onNodeExpand?.(nodeId, !isExpanded);
          return newSet;
        });
      },
      [onNodeExpand]
    );

    const handleSelection = React.useCallback(
      (nodeId: string, ctrlKey = false) => {
        if (!selectable) return;

        let newSelection: string[];

        if (multiSelect && ctrlKey) {
          newSelection = currentSelectedIds.includes(nodeId)
            ? currentSelectedIds.filter((id) => id !== nodeId)
            : [...currentSelectedIds, nodeId];
        } else {
          newSelection = currentSelectedIds.includes(nodeId) ? [] : [nodeId];
        }

        isControlled
          ? onSelectionChange?.(newSelection)
          : setInternalSelectedIds(newSelection);
      },
      [
        selectable,
        multiSelect,
        currentSelectedIds,
        isControlled,
        onSelectionChange,
      ]
    );

    const contextValue: TreeContextType = {
      expandedIds,
      selectedIds: currentSelectedIds,
      toggleExpanded,
      handleSelection,
      showLines,
      showIcons,
      selectable,
      multiSelect,
      animateExpand,
      indent,
      onNodeClick,
      onNodeExpand,
    };
    return (
      <TreeContext.Provider value={contextValue}>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={cn(treeVariants({ variant, size, className }))}
          initial={{ opacity: 0, y: 10 }}
          ref={ref}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="p-2" {...props}>
            {children}
          </div>
        </motion.div>
      </TreeContext.Provider>
    );
  }
);

TreeProvider.displayName = "TreeProvider";

export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        className={cn("flex flex-col gap-1", className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Tree.displayName = "Tree";

export interface TreeItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof treeItemVariants> {
  nodeId: string;
  label: string;
  icon?: React.ReactNode;
  data?: any;
  level?: number;
  isLast?: boolean;
  parentPath?: boolean[];
  hasChildren?: boolean;
  asChild?: boolean;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      variant,
      nodeId,
      label,
      icon,
      data,
      level = 0,
      isLast = false,
      parentPath = [],
      hasChildren = false,
      asChild = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      expandedIds,
      selectedIds,
      toggleExpanded,
      handleSelection,
      showLines,
      showIcons,
      animateExpand,
      indent,
      onNodeClick,
    } = useTree();

    const isExpanded = expandedIds.has(nodeId);
    const isSelected = selectedIds.includes(nodeId);
    const currentPath = [...parentPath, isLast];

    const getDefaultIcon = () =>
      hasChildren ? (
        isExpanded ? (
          <FolderOpen className="size-4" />
        ) : (
          <Folder className="size-4" />
        )
      ) : (
        <File className="size-4" />
      );

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hasChildren) toggleExpanded(nodeId);
      handleSelection(nodeId, e.ctrlKey || e.metaKey);
      onNodeClick?.(nodeId, data);
      onClick?.(e);
    };

    const Comp = asChild ? Slot : "div";
    return (
      <div className="select-none">
        <motion.div
          className={cn(
            treeItemVariants({ variant, selected: isSelected, className })
          )}
          onClick={handleClick}
          style={{ paddingLeft: level * indent + 8 }}
          whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        >
          {}
          {showLines && level > 0 && (
            <div className="pointer-events-none absolute top-0 bottom-0 left-0">
              {currentPath.map((isLastInPath, pathIndex) => (
                <div
                  className="absolute top-0 bottom-0 border-border/40 border-l"
                  key={pathIndex}
                  style={{
                    left: pathIndex * indent + 12,
                    display:
                      pathIndex === currentPath.length - 1 && isLastInPath
                        ? "none"
                        : "block",
                  }}
                />
              ))}
              <div
                className="absolute top-1/2 border-border/40 border-t"
                style={{
                  left: (level - 1) * indent + 12,
                  width: indent - 4,
                  transform: "translateY(-1px)",
                }}
              />
              {isLast && (
                <div
                  className="absolute top-0 border-border/40 border-l"
                  style={{
                    left: (level - 1) * indent + 12,
                    height: "50%",
                  }}
                />
              )}
            </div>
          )}

          {}
          <motion.div
            animate={{ rotate: hasChildren && isExpanded ? 90 : 0 }}
            className="mr-1 flex size-4 items-center justify-center"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {hasChildren && (
              <ChevronRight className="size-3 text-muted-foreground" />
            )}
          </motion.div>

          {}
          {showIcons && (
            <motion.div
              className="mr-2 flex size-4 items-center justify-center text-muted-foreground"
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
            >
              {icon || getDefaultIcon()}
            </motion.div>
          )}

          {}
          <span className="flex-1 truncate text-foreground text-sm">
            {label}
          </span>
        </motion.div>

        {}
        <AnimatePresence>
          {hasChildren && isExpanded && children && (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={{
                duration: animateExpand ? 0.3 : 0,
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                initial={{ y: -10 }}
                transition={{
                  duration: animateExpand ? 0.2 : 0,
                  delay: animateExpand ? 0.1 : 0,
                }}
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

TreeItem.displayName = "TreeItem";

export { TreeProvider, Tree, TreeItem, treeVariants, treeItemVariants };
