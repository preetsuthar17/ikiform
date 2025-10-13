"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import ReactDom from "react-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const datePickerVariants = cva(
  "inline-flex h-9 w-full items-center justify-between rounded-xl border border border-border border-border bg-background bg-input px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-transparent hover:border-border",
      },
      size: {
        sm: "h-7 px-2 text-xs sm:h-8",
        default: "h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm",
        lg: "h-12 px-3 text-sm sm:h-10 sm:px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface DatePickerProps extends VariantProps<typeof datePickerVariants> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showIcon?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  locale?: string;
  formatDate?: (date: Date) => string;
}

const calculateCalendarPosition = (
  triggerRect: DOMRect,
  calendarHeight = 350,
  calendarWidth = 280,
  margin = 8
) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  let top = triggerRect.bottom + margin;
  let left = triggerRect.left;
  let placement:
    | "bottom"
    | "top"
    | "bottom-start"
    | "top-start"
    | "bottom-end"
    | "top-end" = "bottom";

  if (top + calendarHeight > viewport.height) {
    const topPlacement = triggerRect.top - calendarHeight - margin;
    if (topPlacement >= 0) {
      top = topPlacement;
      placement = "top";
    } else {
      const spaceBelow = viewport.height - triggerRect.bottom - margin;
      const spaceAbove = triggerRect.top - margin;

      if (spaceBelow > spaceAbove) {
        top = triggerRect.bottom + margin;
        placement = "bottom";
      } else {
        top = Math.max(margin, triggerRect.top - calendarHeight - margin);
        placement = "top";
      }
    }
  }

  if (left + calendarWidth > viewport.width) {
    const rightAlignedLeft = triggerRect.right - calendarWidth;
    if (rightAlignedLeft >= 0) {
      left = rightAlignedLeft;
      placement = placement.includes("top") ? "top-end" : "bottom-end";
    } else {
      left = Math.max(margin, viewport.width - calendarWidth - margin);
    }
  }

  if (left < margin) {
    left = margin;
    placement = placement.includes("top") ? "top-start" : "bottom-start";
  }

  return { top, left, placement };
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  showIcon = true,
  minDate,
  maxDate,
  disabledDates,
  locale = "en-US",
  formatDate,
  variant,
  size,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedDate, setFocusedDate] = React.useState(value || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = React.useState<
    Element | DocumentFragment | null
  >(null);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalContainer(
        document.getElementById("portal-root") || document.body
      );
    }
  }, []);

  const defaultFormatDate = (date: Date) =>
    date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateFn = formatDate || defaultFormatDate;

  const handleSelect = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggleOpen();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeof document === "undefined") return;

      const target = event.target as Node;
      const isClickInsideContainer =
        containerRef.current && containerRef.current.contains(target);

      const calendarElement = document.querySelector(
        '[data-datepicker-calendar="true"]'
      );
      const isClickInsideCalendar = calendarElement?.contains(target);

      if (!(isClickInsideContainer || isClickInsideCalendar)) {
        setIsOpen(false);
      }
    };

    if (isOpen && typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const portalRoot = document.getElementById("portal-root");
      if (!portalRoot) {
        const newPortalRoot = document.createElement("div");
        newPortalRoot.id = "portal-root";
        newPortalRoot.style.position = "relative";
        newPortalRoot.style.zIndex = "9999";
        document.body.appendChild(newPortalRoot);
      }
    }
  }, []);

  const [calendarPosition, setCalendarPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom" as
      | "bottom"
      | "top"
      | "bottom-start"
      | "top-start"
      | "bottom-end"
      | "top-end",
  });

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const position = calculateCalendarPosition(rect);

      setCalendarPosition({
        top: position.top,
        left: position.left,
        width: rect.width,
        placement: position.placement,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleReposition = () => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const position = calculateCalendarPosition(rect);

        setCalendarPosition({
          top: position.top,
          left: position.left,
          width: rect.width,
          placement: position.placement,
        });
      }
    };

    if (isOpen) {
      window.addEventListener("resize", handleReposition);
      window.addEventListener("scroll", handleReposition, true);

      return () => {
        window.removeEventListener("resize", handleReposition);
        window.removeEventListener("scroll", handleReposition, true);
      };
    }
  }, [isOpen]);

  const calendarComponent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="z-[9999] mx-auto w-fit rounded-xl"
          data-datepicker-calendar="true"
          exit={{
            opacity: 0,
            y: calendarPosition.placement.includes("top") ? 10 : -10,
            scale: 0.95,
          }}
          initial={{
            opacity: 0,
            y: calendarPosition.placement.includes("top") ? 10 : -10,
            scale: 0.95,
          }}
          ref={calendarRef}
          style={{
            position: "fixed",
            top: calendarPosition.top,
            left: calendarPosition.left,
            transformOrigin: calendarPosition.placement.includes("top")
              ? "bottom center"
              : "top center",
          }}
          transition={{ duration: 0.2 }}
        >
          <Calendar
            alwaysOnTop={true}
            className="w-full"
            disabled={disabledDates}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            onSelect={handleSelect}
            selected={value}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative" ref={containerRef} {...props}>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Choose date"
        className={cn(datePickerVariants({ variant, size }), className)}
        disabled={disabled}
        onClick={handleToggleOpen}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="flex items-center gap-2">
          {showIcon && <CalendarIcon className="h-4 w-4 opacity-50" />}
          <span className={cn(!value && "text-muted-foreground")}>
            {value ? formatDateFn(value) : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {portalContainer &&
        ReactDom.createPortal(calendarComponent, portalContainer)}
    </div>
  );
}

interface DateRangePickerProps
  extends Omit<DatePickerProps, "value" | "onChange"> {
  value?: { from: Date; to?: Date };
  onChange?: (range: { from: Date; to?: Date } | undefined) => void;
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  showIcon = true,
  minDate,
  maxDate,
  disabledDates,
  locale = "en-US",
  formatDate,
  variant,
  size,
  ...props
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [calendarPosition, setCalendarPosition] = React.useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom" as
      | "bottom"
      | "top"
      | "bottom-start"
      | "top-start"
      | "bottom-end"
      | "top-end",
  });

  const defaultFormatDate = (date: Date) =>
    date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateFn = formatDate || defaultFormatDate;

  const handleSelect = (range: { from: Date; to?: Date }) => {
    onChange?.(range);
    if (range.from && range.to) {
      setIsOpen(false);
    }
  };

  const formatRange = (range: { from: Date; to?: Date }) => {
    if (!range.from) return "";
    if (!range.to) return formatDateFn(range.from);
    return `${formatDateFn(range.from)} - ${formatDateFn(range.to)}`;
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggleOpen();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeof document === "undefined") return;

      const target = event.target as Node;
      const isClickInsideContainer =
        containerRef.current && containerRef.current.contains(target);

      const calendarElement = document.querySelector(
        '[data-datepicker-calendar="true"]'
      );
      const isClickInsideCalendar = calendarElement?.contains(target);

      if (!(isClickInsideContainer || isClickInsideCalendar)) {
        setIsOpen(false);
      }
    };

    if (isOpen && typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      const portalRoot = document.getElementById("portal-root");
      if (!portalRoot) {
        const newPortalRoot = document.createElement("div");
        newPortalRoot.id = "portal-root";
        newPortalRoot.style.position = "relative";
        newPortalRoot.style.zIndex = "9999";
        document.body.appendChild(newPortalRoot);
      }
    }
  }, []);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const position = calculateCalendarPosition(rect);

      setCalendarPosition({
        top: position.top,
        left: position.left,
        width: rect.width,
        placement: position.placement,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleReposition = () => {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const position = calculateCalendarPosition(rect);

        setCalendarPosition({
          top: position.top,
          left: position.left,
          width: rect.width,
          placement: position.placement,
        });
      }
    };

    if (isOpen) {
      window.addEventListener("resize", handleReposition);
      window.addEventListener("scroll", handleReposition, true);

      return () => {
        window.removeEventListener("resize", handleReposition);
        window.removeEventListener("scroll", handleReposition, true);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef} {...props}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Choose date range"
        className={cn(datePickerVariants({ variant, size }), className)}
        disabled={disabled}
        onClick={handleToggleOpen}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className="flex items-center gap-2">
          {showIcon && <CalendarIcon className="h-4 w-4 opacity-50" />}
          <span className={cn(!value && "text-muted-foreground")}>
            {value ? formatRange(value) : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {typeof document !== "undefined" &&
        ReactDom.createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="z-[9999] mx-auto w-fit rounded-xl"
                data-datepicker-calendar="true"
                exit={{
                  opacity: 0,
                  y: calendarPosition.placement.includes("top") ? 10 : -10,
                  scale: 0.95,
                }}
                initial={{
                  opacity: 0,
                  y: calendarPosition.placement.includes("top") ? 10 : -10,
                  scale: 0.95,
                }}
                ref={calendarRef}
                style={{
                  position: "fixed",
                  top: calendarPosition.top,
                  left: calendarPosition.left,
                  transformOrigin: calendarPosition.placement.includes("top")
                    ? "bottom center"
                    : "top center",
                }}
                transition={{ duration: 0.2 }}
              >
                <Calendar
                  alwaysOnTop={true}
                  disabled={disabledDates}
                  locale={locale}
                  maxDate={maxDate}
                  minDate={minDate}
                  mode="range"
                  onSelectRange={handleSelect}
                  selectedRange={value}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.getElementById("portal-root") || document.body
        )}
    </div>
  );
}

export { datePickerVariants, type DatePickerProps, type DateRangePickerProps };
