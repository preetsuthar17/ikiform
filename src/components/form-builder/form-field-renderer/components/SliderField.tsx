import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

import type { BaseFieldProps } from "../types";

import { getErrorRingClasses } from "../utils";

export function SliderField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);

  const getSliderMinValue = () => field.settings?.min || 0;

  const getSliderMaxValue = () => field.settings?.max || 100;

  const getSliderStepValue = () => field.settings?.step || 1;

  const getSliderDefaultValue = () => field.settings?.defaultValue || 0;

  const getCurrentSliderValue = () => value || getSliderDefaultValue();

  const handleSliderValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="flex flex-col gap-3">
      <Card className="border-0 p-0 shadow-none">
        <CardContent className="p-0">
          <Slider
            aria-valuemax={getSliderMaxValue()}
            aria-valuemin={getSliderMinValue()}
            aria-valuenow={getCurrentSliderValue()}
            className={errorRingClasses}
            disabled={disabled}
            max={getSliderMaxValue()}
            min={getSliderMinValue()}
            onValueChange={handleSliderValueChange}
            step={getSliderStepValue()}
            value={[getCurrentSliderValue()]}
          />
          <p className="text-muted-foreground text-sm">
            {getCurrentSliderValue()}
          </p>
        </CardContent>
      </Card>
      {error && (
        <div
          aria-live="polite"
          className="rounded-md bg-destructive/10 p-3 text-destructive text-sm"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
