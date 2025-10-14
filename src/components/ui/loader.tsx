"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md", ...props }: SpinnerProps) {
  const wrapperSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";

  const delays = [
    -1.667, -1.583, -1.5, -1.417, -1.333, -1.25, -1.167, -1.083, -1, -0.917,
    -0.833, -0.75,
  ];

  return (
    <div
      aria-live="polite"
      className={cn(
        "relative inline-block text-foreground",
        wrapperSize,
        className
      )}
      role="status"
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        const style: React.CSSProperties = {
          position: "absolute",
          height: "25%",
          width: "8%",
          background: "currentColor",
          borderRadius: 1,
          top: "37%",
          left: "44%",
          transform: `rotate(${angle}deg) translateY(-130%)`,
          animation: "bladeFade 1s linear infinite",
          animationDelay: `${delays[i]}s`,
          willChange: "opacity",
        };
        return <div key={i} style={style} />;
      })}
      <span className="sr-only">Loading</span>
      <style jsx>{`
        @keyframes bladeFade {
          0% { opacity: 0.85; }
          50% { opacity: 0.25; }
          100% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
