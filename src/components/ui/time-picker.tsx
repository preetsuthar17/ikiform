"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    } else if (
      typeof value === "string" &&
      value.match(/^\d{1,2}:\d{2} (AM|PM)$/)
    ) {
      const [hm, ap] = value.split(" ");
      const [h, m] = hm.split(":");
      setHour(h);
      setMinute(m);
      setAmPm(ap);
    }
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
    [onChange, value]
  );

  return (
    <div
      className={
        className ??
        "flex w-full flex-col items-center gap-2" +
          (error ? "rounded border border-red-500 p-2" : "")
      }
    >
      <div className="flex w-full items-center gap-2">
        <div className="w-16">
          <Select
            disabled={disabled}
            onValueChange={React.useCallback(
              (val: string) => handleChange(val, minute, amPm),
              [minute, amPm, handleChange]
            )}
            value={hour}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) =>
                String(i + 1).padStart(2, "0")
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
            disabled={disabled}
            onValueChange={React.useCallback(
              (val: string) => handleChange(hour, val, amPm),
              [hour, amPm, handleChange]
            )}
            value={minute}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) =>
                String(i).padStart(2, "0")
              ).map((m) => (
                <SelectItem disableCheckAnimation key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-16">
          <Select
            disabled={disabled}
            onValueChange={React.useCallback(
              (val: string) => handleChange(hour, minute, val),
              [hour, minute, handleChange]
            )}
            value={amPm}
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
          className="mt-2 rounded border border-border bg-muted px-3 py-1 text-xs transition hover:bg-accent"
          disabled={disabled}
          onClick={handleSetCurrentTime}
          type="button"
        >
          Set Current Time
        </button>
      )}
    </div>
  );
};
