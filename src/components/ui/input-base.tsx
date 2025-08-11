"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-ele border border-border bg-input px-3 py-2 text-sm shadow-sm/2 ring-offset-background transition-all file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive focus-visible:ring-destructive",
        ghost:
          "border-transparent bg-accent focus-visible:border-border focus-visible:bg-input",
      },
      size: {
        default: "h-9 px-3 py-2",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-10 px-4 py-2",
        xl: "h-12 px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = "text",
      leftIcon,
      rightIcon,
      error,
      clearable,
      onClear,
      value,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      props.defaultValue || "",
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const inputVariant = error ? "destructive" : variant;
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;
    const showClearButton =
      clearable && inputValue && String(inputValue).length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onClear?.();

      if (inputRef.current) {
        const input = inputRef.current;

        input.value = "";

        const syntheticEvent = {
          target: input,
          currentTarget: input,
          nativeEvent: new Event("input", { bubbles: true }),
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {},
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          type: "change",
        } as React.ChangeEvent<HTMLInputElement>;

        props.onChange?.(syntheticEvent);

        input.focus();
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="-translate-y-1/2 absolute top-1/2 left-3 z-10 text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {leftIcon}
          </div>
        )}{" "}
        <input
          className={cn(
            inputVariants({ variant: inputVariant, size, className }),
            leftIcon && "pl-10",
            rightIcon || isPassword || showClearButton,
          )}
          ref={inputRef}
          type={actualType}
          {...(isControlled
            ? { value: inputValue }
            : { defaultValue: props.defaultValue })}
          onChange={handleInputChange}
          {...(({ defaultValue, ...rest }) => rest)(props)}
        />
        {}
        {(rightIcon || isPassword || showClearButton) && (
          <div className="-translate-y-1/2 absolute top-1/2 right-3 z-10 flex items-center gap-1">
            {}
            {rightIcon && (
              <div className="text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                {rightIcon}
              </div>
            )}

            {}
            {showClearButton && (
              <button
                className="text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0"
                onClick={handleClear}
                tabIndex={-1}
                type="button"
              >
                <X />
              </button>
            )}

            {}
            {isPassword && (
              <button
                className="text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                type="button"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants };
