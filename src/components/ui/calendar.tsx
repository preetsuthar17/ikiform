'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const calendarVariants = cva(
  'relative mx-auto inline-block flex w-full max-w-sm flex-col gap-4 rounded-card border border-border bg-background shadow-sm/2',
  {
    variants: {
      size: {
        sm: 'p-2 text-sm sm:p-3',
        default: 'p-3 sm:p-4',
        lg: 'p-4 text-base sm:p-5',
      },
      alwaysOnTop: {
        true: 'z-9999',
        false: 'z-10',
      },
    },
    defaultVariants: {
      size: 'default',
      alwaysOnTop: true,
    },
  }
);

const dayVariants = cva(
  'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-ele text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:w-9',
  {
    variants: {
      variant: {
        default:
          'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        selected:
          'bg-primary font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring',
        today:
          'bg-accent font-semibold text-accent-foreground hover:bg-accent/80 focus-visible:ring-ring',
        outside:
          'text-muted-foreground opacity-50 hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring',
        disabled: 'cursor-not-allowed text-muted-foreground opacity-30',
        'range-start':
          'rounded-r-none bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring',
        'range-end':
          'rounded-l-none bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring',
        'range-middle':
          'rounded-none bg-primary/20 text-foreground hover:bg-primary/30 focus-visible:ring-ring',
      },
      size: {
        sm: 'h-6 w-6 text-xs sm:h-7 sm:w-7',
        default: 'h-8 w-8 text-sm sm:h-9 sm:w-9',
        lg: 'h-9 w-9 text-base sm:h-10 sm:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface CalendarProps extends VariantProps<typeof calendarVariants> {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  locale?: string;
  className?: string;
  showOutsideDays?: boolean;
  minDate?: Date;
  maxDate?: Date;
  mode?: 'single' | 'multiple' | 'range';
  selectedDates?: Date[];
  selectedRange?: { from: Date; to?: Date };
  onSelectMultiple?: (dates: Date[]) => void;
  onSelectRange?: (range: { from: Date; to?: Date }) => void;
  showMonthYearPickers?: boolean;
  alwaysOnTop?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Calendar({
  selected,
  onSelect,
  disabled,
  locale = 'en-US',
  className,
  size,
  showOutsideDays = true,
  minDate,
  maxDate,
  mode = 'single',
  selectedDates = [],
  selectedRange,
  onSelectMultiple,
  onSelectRange,
  showMonthYearPickers = false,
  alwaysOnTop = true,
  ...props
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState<'left' | 'right'>('right');
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const yearRange = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => prevMonthLastDay - firstDayOfWeek + i + 1
  );

  const totalCells = 42;
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const remainingCells =
    totalCells - prevMonthDays.length - currentMonthDays.length;
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1);
  const navigateMonth = (direction: 'prev' | 'next') => {
    setIsAnimating(true);
    setDirection(direction === 'prev' ? 'left' : 'right');

    setTimeout(() => {
      const newDate = new Date(currentDate);
      if (direction === 'prev') {
        newDate.setMonth(currentMonth - 1);
      } else {
        newDate.setMonth(currentMonth + 1);
      }
      setCurrentDate(newDate);
      setIsAnimating(false);
    }, 150);
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = Number.parseInt(month, 10);
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const yearValue = Number.parseInt(year, 10);
    const newDate = new Date(currentDate);
    newDate.setFullYear(yearValue);
    setCurrentDate(newDate);
  };

  const isDateDisabled = (date: Date) => {
    if (disabled?.(date)) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };
  const isDateSelected = (date: Date) => {
    if (mode === 'single') {
      return selected && isSameDay(date, selected);
    }
    if (mode === 'multiple') {
      return selectedDates.some((d) => isSameDay(d, date));
    }
    if (mode === 'range' && selectedRange) {
      if (!selectedRange.to) {
        return isSameDay(date, selectedRange.from);
      }
      const dateTime = date.getTime();
      const fromTime = selectedRange.from.getTime();
      const toTime = selectedRange.to.getTime();
      return dateTime >= fromTime && dateTime <= toTime;
    }
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (mode === 'range' && selectedRange) {
      if (!selectedRange.to) return isSameDay(date, selectedRange.from);
      const dateTime = date.getTime();
      const fromTime = selectedRange.from.getTime();
      const toTime = selectedRange.to.getTime();
      return dateTime > fromTime && dateTime < toTime;
    }
    return false;
  };

  const isRangeStart = (date: Date) => {
    if (mode === 'range' && selectedRange) {
      return isSameDay(date, selectedRange.from);
    }
    return false;
  };

  const isRangeEnd = (date: Date) => {
    if (mode === 'range' && selectedRange && selectedRange.to) {
      return isSameDay(date, selectedRange.to);
    }
    return false;
  };

  const isToday = (date: Date) => isSameDay(date, today);

  const handleDateClick = (day: number, monthOffset = 0) => {
    const clickedDate = new Date(currentYear, currentMonth + monthOffset, day);

    if (isDateDisabled(clickedDate)) return;

    if (mode === 'single') {
      onSelect?.(clickedDate);
    } else if (mode === 'multiple') {
      const newDates = selectedDates.some((d) => isSameDay(d, clickedDate))
        ? selectedDates.filter((d) => !isSameDay(d, clickedDate))
        : [...selectedDates, clickedDate];
      onSelectMultiple?.(newDates);
    } else if (mode === 'range') {
      if (!selectedRange || (selectedRange.from && selectedRange.to)) {
        onSelectRange?.({ from: clickedDate });
      } else if (selectedRange.from && !selectedRange.to) {
        const from =
          selectedRange.from <= clickedDate ? selectedRange.from : clickedDate;
        const to =
          selectedRange.from <= clickedDate ? clickedDate : selectedRange.from;
        onSelectRange?.({ from, to });
      }
    }
  };
  const getDayVariant = (
    day: number,
    monthOffset = 0
  ):
    | 'default'
    | 'selected'
    | 'today'
    | 'outside'
    | 'disabled'
    | 'range-start'
    | 'range-end'
    | 'range-middle' => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);

    if (isDateDisabled(date)) return 'disabled';
    if (mode === 'range' && selectedRange) {
      if (isRangeStart(date)) return 'range-start';
      if (isRangeEnd(date)) return 'range-end';
      if (isDateInRange(date)) return 'range-middle';
    }
    if (isDateSelected(date)) return 'selected';
    if (isToday(date)) return 'today';
    if (monthOffset !== 0) return 'outside';
    return 'default';
  };

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
    }),
  };
  return (
    <div
      className={cn(calendarVariants({ size, alwaysOnTop }), className)}
      {...props}
    >
      {' '}
      {}
      <div className="flex items-center justify-between">
        <button
          className="inline-flex items-center justify-center rounded-ele p-1 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-1.5"
          disabled={isAnimating}
          onClick={() => navigateMonth('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-2">
          {showMonthYearPickers ? (
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <Select
                onValueChange={handleMonthChange}
                value={currentMonth.toString()}
              >
                <SelectTrigger
                  className="h-7 w-[100px] text-xs sm:h-8 sm:w-[120px] sm:text-sm"
                  size="sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      <span className="hidden sm:inline">{month}</span>
                      <span className="sm:hidden">{month.slice(0, 3)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={handleYearChange}
                value={currentYear.toString()}
              >
                <SelectTrigger
                  className="h-7 w-[70px] text-xs sm:h-8 sm:w-[80px] sm:text-sm"
                  size="sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearRange.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <motion.h2
              animate={{ opacity: 1, y: 0 }}
              className="px-2 text-center font-semibold text-base text-foreground sm:text-lg"
              initial={{ opacity: 0, y: -10 }}
              key={`${currentMonth}-${currentYear}`}
            >
              <span className="hidden sm:inline">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <span className="sm:hidden">
                {MONTHS[currentMonth].slice(0, 3)} {currentYear}
              </span>
            </motion.h2>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-ele p-1 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-1.5"
          disabled={isAnimating}
          onClick={() => navigateMonth('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            className="flex h-7 items-center justify-center text-muted-foreground text-xs sm:h-8"
            key={day}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>
      {}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            animate="center"
            className="grid grid-cols-7 gap-0.5 sm:gap-1"
            custom={direction}
            exit="exit"
            initial="enter"
            key={`${currentMonth}-${currentYear}`}
            transition={{
              x: { type: 'spring', stiffness: 500, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            variants={slideVariants}
          >
            {}
            {showOutsideDays &&
              prevMonthDays.map((day) => (
                <button
                  className={cn(
                    dayVariants({ variant: getDayVariant(day, -1), size })
                  )}
                  disabled={isDateDisabled(
                    new Date(currentYear, currentMonth - 1, day)
                  )}
                  key={`prev-${day}`}
                  onClick={() => handleDateClick(day, -1)}
                >
                  {day}
                </button>
              ))}

            {}
            {currentMonthDays.map((day) => (
              <button
                className={cn(
                  dayVariants({ variant: getDayVariant(day), size })
                )}
                disabled={isDateDisabled(
                  new Date(currentYear, currentMonth, day)
                )}
                key={`current-${day}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </button>
            ))}

            {}
            {showOutsideDays &&
              nextMonthDays.map((day) => (
                <button
                  className={cn(
                    dayVariants({ variant: getDayVariant(day, 1), size })
                  )}
                  disabled={isDateDisabled(
                    new Date(currentYear, currentMonth + 1, day)
                  )}
                  key={`next-${day}`}
                  onClick={() => handleDateClick(day, 1)}
                >
                  {day}
                </button>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export { Calendar, calendarVariants, dayVariants, type CalendarProps };
