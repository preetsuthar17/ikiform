'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const sliderVariants = cva(
  'relative flex w-full touch-none select-none items-center',
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        ghost: '',
      },
      size: {
        sm: 'h-3',
        default: 'h-4',
        lg: 'h-5',
        xl: 'h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const sliderTrackVariants = cva(
  'relative w-full grow overflow-hidden rounded-card',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        destructive: 'bg-destructive/20',
        ghost: 'bg-accent',
      },
      size: {
        sm: 'h-1.5',
        default: 'h-2',
        lg: 'h-2.5',
        xl: 'h-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const sliderRangeVariants = cva('absolute h-full rounded-card', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      ghost: 'bg-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const sliderThumbVariants = cva(
  'hover: block rounded-card border-2 bg-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary hover:border-primary/80',
        destructive: 'border-destructive hover:border-destructive/80',
        ghost: 'border-foreground hover:border-foreground/80',
      },
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      'size'
    >,
    VariantProps<typeof sliderVariants> {
  label?: string;
  description?: string;
  error?: boolean | string;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      variant,
      size,
      label,
      description,
      error,
      showValue = false,
      showMinMax = false,
      formatValue = (value) => value.toString(),
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      disabled,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue || value || [min]
    );

    const currentValue = value || internalValue;
    const effectiveVariant = error ? 'destructive' : variant;

    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        if (!value) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [value, onValueChange]
    );

    const sliderId = React.useId();
    const descriptionId = React.useId();

    const sliderElement = (
      <SliderPrimitive.Root
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          sliderVariants({ variant: effectiveVariant, size }),
          className
        )}
        disabled={disabled}
        id={sliderId}
        max={max}
        min={min}
        onValueChange={handleValueChange}
        orientation={orientation}
        ref={ref}
        step={step}
        value={currentValue}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            sliderTrackVariants({ variant: effectiveVariant, size })
          )}
        >
          <SliderPrimitive.Range
            className={cn(sliderRangeVariants({ variant: effectiveVariant }))}
          />
        </SliderPrimitive.Track>
        {currentValue.map((_, index) => (
          <SliderPrimitive.Thumb
            className={cn(
              sliderThumbVariants({ variant: effectiveVariant, size })
            )}
            key={index}
          />
        ))}
      </SliderPrimitive.Root>
    );

    if (label || description || showValue || showMinMax || error) {
      return (
        <div className="flex flex-col gap-2">
          {}
          {(label || showValue) && (
            <div className="flex items-center justify-between">
              {label && (
                <label
                  className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor={sliderId}
                >
                  {label}
                </label>
              )}
              {showValue && (
                <span className="text-muted-foreground text-sm">
                  {currentValue.length === 1
                    ? formatValue(currentValue[0])
                    : currentValue.map(formatValue).join(' - ')}
                </span>
              )}
            </div>
          )}

          {}
          <div className="flex flex-col gap-2">
            {sliderElement}

            {}
            {showMinMax && (
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>{formatValue(min)}</span>
                <span>{formatValue(max)}</span>
              </div>
            )}
          </div>

          {}
          {(description || error) && (
            <div className="flex flex-col gap-1">
              {description && (
                <p className="text-muted-foreground text-sm" id={descriptionId}>
                  {description}
                </p>
              )}
              {error && typeof error === 'string' && (
                <p className="text-destructive text-sm">{error}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    return sliderElement;
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export {
  Slider,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
};
