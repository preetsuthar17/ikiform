"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative inline-block",
        size === "sm" && "h-3 w-3",
        size === "md" && "h-4 w-4",
        size === "lg" && "h-6 w-6",
        className
      )}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div className="spinner-blade" key={i} />
      ))}
    </div>
  );
}
