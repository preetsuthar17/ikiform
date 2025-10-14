import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const breadcrumbVariants = cva("", {
  variants: {},
  defaultVariants: {},
});

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center gap-1.5 break-words text-muted-foreground text-sm",
  {
    variants: {
      size: {
        sm: "gap-1 text-xs",
        default: "gap-1.5 text-sm",
        lg: "gap-2 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const breadcrumbItemVariants = cva("inline-flex items-center gap-1.5", {
  variants: {},
  defaultVariants: {},
});

const breadcrumbLinkVariants = cva(
  "flex items-center gap-1 rounded-xl transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {},
    defaultVariants: {},
  }
);

const breadcrumbPageVariants = cva("font-normal text-foreground", {
  variants: {
    variant: {
      default: "",
      highlighted: "font-medium",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
}

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListVariants> {}

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<"li"> {}

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

export interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof breadcrumbPageVariants> {}

export interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {
  children?: React.ReactNode;
}

export interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav
      aria-label="breadcrumb"
      className={cn(breadcrumbVariants({}), className)}
      ref={ref}
      {...props}
    />
  )
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, ...props }, ref) => (
    <ol
      className={cn(breadcrumbListVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li
      className={cn(breadcrumbItemVariants({}), className)}
      ref={ref}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        className={cn(breadcrumbLinkVariants({}), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn(breadcrumbPageVariants({ variant }), className)}
      ref={ref}
      role="link"
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({
  children,
  className,
  ...props
}) => (
  <li
    aria-hidden="true"
    className={cn(
      "flex items-center [&>svg]:size-3.5 [&>svg]:shrink-0",
      className
    )}
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({
  className,
  ...props
}) => (
  <span
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    role="presentation"
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbPageVariants,
};
