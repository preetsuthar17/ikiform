"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Pipette } from "lucide-react";
import * as React from "react";

declare global {
  interface Window {
    EyeDropper?: {
      new (): {
        open(): Promise<{ sRGBHex: string }>;
      };
    };
  }
}

import {
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorField as AriaColorField,
  type ColorFieldProps as AriaColorFieldProps,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
  ColorSlider as AriaColorSlider,
  type ColorSliderProps as AriaColorSliderProps,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  type ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
  type ColorSwatchPickerProps as AriaColorSwatchPickerProps,
  type ColorSwatchProps as AriaColorSwatchProps,
  ColorThumb as AriaColorThumb,
  type ColorThumbProps as AriaColorThumbProps,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
  ColorPickerStateContext,
  composeRenderProps,
  FieldError,
  Group,
  Input,
  Label,
  parseColor,
} from "react-aria-components";
import { cn } from "@/lib/utils";

const colorPickerVariants = cva(
  "flex flex-col gap-2 rounded-2xl border border-border bg-background p-4",
  {
    variants: {
      size: {
        sm: "max-w-xs",
        default: "max-w-sm",
        lg: "max-w-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface ColorPickerProps
  extends AriaColorPickerProps,
    VariantProps<typeof colorPickerVariants> {
  className?: string;
}

function ColorPicker({
  className,
  size,
  children,
  ...props
}: ColorPickerProps) {
  return (
    <div className={cn(colorPickerVariants({ size }), className)}>
      <AriaColorPicker {...props}>{children}</AriaColorPicker>
    </div>
  );
}

function ColorField({ className, ...props }: AriaColorFieldProps) {
  return (
    <AriaColorField
      className={composeRenderProps(className, (className) =>
        cn("flex flex-col gap-2", className)
      )}
      {...props}
    />
  );
}

function ColorInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={composeRenderProps(className, (className) =>
        cn(
          "flex h-9 w-full rounded-xl border border-border bg-background px-3 py-1 text-foreground text-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

function ColorArea({ className, ...props }: AriaColorAreaProps) {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        cn(
          "h-[200px] w-full rounded-2xl border border-border bg-gradient-to-br from-white to-black",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorSlider({ className, ...props }: AriaColorSliderProps) {
  return (
    <AriaColorSlider
      className={composeRenderProps(className, (className) =>
        cn(
          "flex h-8 w-full flex-col items-center justify-center gap-2",
          className
        )
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, style, ...props }: AriaSliderTrackProps) {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (className) =>
        cn("relative h-3 w-full rounded-2xl border border-border", className)
      )}
      style={({ defaultStyle }) => ({
        ...style,
        background: `${defaultStyle.background},
          repeating-conic-gradient(
            #ccc 0 90deg,
            #fff 0 180deg) 
          0% 0%/8px 8px`,
      })}
      {...props}
    />
  );
}

function ColorThumb({ className, ...props }: AriaColorThumbProps) {
  return (
    <AriaColorThumb
      className={composeRenderProps(className, (className) =>
        cn(
          "z-10 size-4 rounded-2xl border-2 border-white ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorSwatchPicker({
  className,
  ...props
}: AriaColorSwatchPickerProps) {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        cn("flex flex-wrap gap-2", className)
      )}
      {...props}
    />
  );
}

function ColorSwatchPickerItem({
  className,
  ...props
}: AriaColorSwatchPickerItemProps) {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        cn(
          "group/swatch-item cursor-pointer rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )
      )}
      {...props}
    />
  );
}

function ColorSwatch({ className, style, ...props }: AriaColorSwatchProps) {
  return (
    <AriaColorSwatch
      className={composeRenderProps(className, (className) =>
        cn(
          "size-8 rounded-xl border border-border group-data-[selected]/swatch-item:ring-2 group-data-[selected]/swatch-item:ring-ring group-data-[selected]/swatch-item:ring-offset-2",
          className
        )
      )}
      style={({ defaultStyle }) => ({
        ...style,
        background: `${defaultStyle.background},
        repeating-conic-gradient(
          #ccc 0 90deg,
          #fff 0 180deg) 
        0% 0%/8px 8px`,
      })}
      {...props}
    />
  );
}

const EyeDropperButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const state = React.useContext(ColorPickerStateContext);

  if (!state || typeof window === "undefined" || !("EyeDropper" in window)) {
    return null;
  }

  const handleEyeDropper = async () => {
    try {
      if (!window.EyeDropper) {
        console.warn("EyeDropper API not supported");
        return;
      }
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      state.setColor(parseColor(result.sRGBHex));
    } catch (error) {
      console.warn("EyeDropper operation cancelled or failed:", error);
    }
  };

  return (
    <button
      aria-label="Pick color from screen"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleEyeDropper}
      ref={ref}
      type="button"
      {...props}
    >
      <Pipette className="size-4" />
    </button>
  );
});
EyeDropperButton.displayName = "EyeDropperButton";

function ColorError({
  className,
  ...props
}: React.ComponentProps<typeof FieldError>) {
  return (
    <FieldError
      className={composeRenderProps(className, (className) =>
        cn("font-medium text-destructive text-sm", className)
      )}
      {...props}
    />
  );
}

export {
  ColorPicker,
  ColorField,
  ColorInput,
  ColorLabel,
  ColorArea,
  ColorSlider,
  SliderTrack,
  ColorThumb,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorSwatch,
  EyeDropperButton,
  ColorError,
  Group as ColorGroup,
};
