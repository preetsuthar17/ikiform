import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse rounded-ele bg-accent", {
  variants: {
    variant: {
      default: "bg-accent",
      secondary: "bg-accent/20",
      text: "rounded-ele bg-accent",
      circle: "rounded-card",
      avatar: "rounded-card bg-accent",
    },
    size: {
      sm: "h-4",
      default: "h-6",
      lg: "h-8",
      xl: "h-10",
      "2xl": "h-12",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Custom width for the skeleton
   */
  width?: string | number;
  /**
   * Custom height for the skeleton
   */
  height?: string | number;
  /**
   * Animation speed in seconds
   */
  duration?: number;
  /**
   * Whether to show shimmer effect
   */
  shimmer?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant,
      size,
      width,
      height,
      duration = 2,
      shimmer = true,
      style,
      ...props
    },
    ref,
  ) => {
    const customStyle = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      animationDuration: `${duration}s`,
      ...style,
    };

    return (
      <div
        className={cn(
          skeletonVariants({ variant, size }),
          shimmer && "relative overflow-hidden",
          shimmer &&
            "before:-translate-x-full before:absolute before:inset-0 before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          className,
        )}
        ref={ref}
        style={customStyle}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

const SkeletonText = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>(({ className, ...props }, ref) => (
  <Skeleton
    className={cn("w-full", className)}
    ref={ref}
    variant="text"
    {...props}
  />
));
SkeletonText.displayName = "SkeletonText";

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>(({ className, size = "default", ...props }, ref) => {
  const avatarSizeMap = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };
  const avatarSize =
    avatarSizeMap[size as keyof typeof avatarSizeMap] || "w-10 h-10";

  return (
    <Skeleton
      className={cn(avatarSize, className)}
      ref={ref}
      variant="avatar"
      {...props}
    />
  );
});
SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant">
>(({ className, size = "default", ...props }, ref) => {
  const buttonHeight: Record<string, string> = {
    sm: "h-8",
    default: "h-10",
    lg: "h-11",
    xl: "h-12",
    "2xl": "h-14",
  };
  const selectedHeight = buttonHeight[size as string] || "h-10";

  return (
    <Skeleton
      className={cn(selectedHeight, "w-20 rounded-ele", className)}
      ref={ref}
      {...props}
    />
  );
});
SkeletonButton.displayName = "SkeletonButton";

const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, "variant"> & {
    showImage?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
  }
>(
  (
    {
      className,
      showImage = true,
      showHeader = true,
      showFooter = true,
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        "overflow-hidden rounded-ele border bg-card p-0",
        className,
      )}
      ref={ref}
      {...props}
    >
      {showImage && (
        <Skeleton className="h-48 w-full rounded-none rounded-t-xl" />
      )}
      <div className="flex flex-col gap-4 p-6">
        {showHeader && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
        {showFooter && (
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        )}
      </div>
    </div>
  ),
);
SkeletonCard.displayName = "SkeletonCard";

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  skeletonVariants,
};
