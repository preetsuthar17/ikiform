import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import type { BaseFieldProps } from "../types";

const VARIANT_STYLES: Record<
  string,
  { bg: string; border: string; title: string; dot: string; text: string }
> = {
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "text-amber-900",
    dot: "bg-amber-500",
    text: "text-amber-900",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    title: "text-red-900",
    dot: "bg-red-500",
    text: "text-red-900",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "text-blue-900",
    dot: "bg-blue-500",
    text: "text-blue-900",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "text-emerald-900",
    dot: "bg-emerald-500",
    text: "text-emerald-900",
  },
};

const VARIANT_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  success: CheckCircle2,
};

export function BannerField({ field }: BaseFieldProps) {
  const variant = (field.settings?.bannerVariant as string) || "info";
  const title = field.settings?.bannerTitle || "";
  const description =
    field.settings?.bannerDescription || field.description || "";
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const text = styles.text;
  const Icon = VARIANT_ICON[variant] || VARIANT_ICON.info;

  return (
    <div className={cn("rounded-xl border p-4", styles.bg, styles.border)}>
      <div
        className={`flex ${description ? "items-start" : "items-center"} gap-3`}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1",
            styles.dot
          )}
        >
          <Icon className="h-3.5 w-3.5 text-white" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          {title && <div className={cn("font-medium", text)}>{title}</div>}
          {description && (
            <div
              className={cn(
                "whitespace-pre-line text-muted-foreground text-sm",
                text
              )}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
