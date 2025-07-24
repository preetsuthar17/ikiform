// TimePicker.tsx
"use client";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./button";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  showCurrentTimeButton?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  disabled,
  error,
  className,
  showCurrentTimeButton = true,
}) => {
  const getDefaultTime = React.useCallback(() => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return {
      hour: String(h).padStart(2, "0"),
      minute: String(m).padStart(2, "0"),
      amPm: ap,
    };
  }, []);

  const [hour, setHour] = React.useState<string>("");
  const [minute, setMinute] = React.useState<string>("");
  const [amPm, setAmPm] = React.useState<string>("AM");

  // Handler to set current time
  const handleSetCurrentTime = React.useCallback(() => {
    const def = getDefaultTime();
    setHour(def.hour);
    setMinute(def.minute);
    setAmPm(def.amPm);
    if (onChange) {
      const newValue = `${def.hour}:${def.minute} ${def.amPm}`;
      onChange(newValue);
    }
  }, [getDefaultTime, onChange]);

  // Set initial value only once on mount if no value is provided
  React.useEffect(() => {
    if (!value) {
      const def = getDefaultTime();
      setHour(def.hour);
      setMinute(def.minute);
      setAmPm(def.amPm);
      if (onChange) {
        const newValue = `${def.hour}:${def.minute} ${def.amPm}`;
        onChange(newValue);
      }
    }
    // If value is provided, parse it once on mount
    else if (
      typeof value === "string" &&
      value.match(/^\d{1,2}:\d{2} (AM|PM)$/)
    ) {
      const [hm, ap] = value.split(" ");
      const [h, m] = hm.split(":");
      setHour(h);
      setMinute(m);
      setAmPm(ap);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = React.useCallback(
    (h: string, m: string, ap: string) => {
      setHour(h);
      setMinute(m);
      setAmPm(ap);
      if (h && m && ap && onChange) {
        const newValue = `${h}:${m} ${ap}`;
        if (newValue !== value) {
          onChange(newValue);
        }
      }
    },
    [onChange, value],
  );

  return (
    <div
      className={
        className ??
        "flex gap-2 items-center w-full flex-col" +
          (error ? " border border-red-500 p-2 rounded" : "")
      }
    >
      <div className="flex gap-2 items-center w-full">
        <div className="w-16">
          <Select
            value={hour}
            onValueChange={React.useCallback(
              (val: string) => handleChange(val, minute, amPm),
              [minute, amPm, handleChange],
            )}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0"),
              ).map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span>:</span>
        <div className="w-16">
          <Select
            value={minute}
            onValueChange={React.useCallback(
              (val: string) => handleChange(hour, val, amPm),
              [hour, amPm, handleChange],
            )}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) =>
                String(i).padStart(2, "0"),
              ).map((m) => (
                <SelectItem key={m} value={m} disableCheckAnimation>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-16">
          <Select
            value={amPm}
            onValueChange={React.useCallback(
              (val: string) => handleChange(hour, minute, val),
              [hour, minute, handleChange],
            )}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {showCurrentTimeButton && (
        <button
          type="button"
          className="mt-2 px-3 py-1 rounded bg-muted text-xs border border-border hover:bg-accent transition"
          onClick={handleSetCurrentTime}
          disabled={disabled}
        >
          Set Current Time
        </button>
      )}
    </div>
  );
};
