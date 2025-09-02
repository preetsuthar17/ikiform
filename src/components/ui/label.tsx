import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive",
        muted: "text-muted-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    { className, variant, size, required, optional, children, ...props },
    ref
  ) => {
    return (
      <label
        className={cn(labelVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {required && (
          <span aria-label="required" className="ml-1 text-destructive">
            *
          </span>
        )}
        {optional && !required && (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label, labelVariants };
