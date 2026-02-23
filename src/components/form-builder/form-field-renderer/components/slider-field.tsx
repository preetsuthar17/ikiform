import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui";
import {
	isRangeSliderMode,
	normalizeRangeSliderValue,
	normalizeSingleSliderValue,
	normalizeSliderBounds,
} from "@/lib/fields/slider-utils";

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
	const isRangeMode = isRangeSliderMode(field.settings);
	const bounds = normalizeSliderBounds(field.settings);
	const incomingSingleValue = normalizeSingleSliderValue(field.settings, value);
	const incomingRangeValue = normalizeRangeSliderValue(field.settings, value);

	const incomingUiValue = useMemo(
		() =>
			isRangeMode
				? [incomingRangeValue.min, incomingRangeValue.max]
				: [incomingSingleValue],
		[isRangeMode, incomingRangeValue.min, incomingRangeValue.max, incomingSingleValue]
	);
	const [uiValue, setUiValue] = useState<number[]>(incomingUiValue);

	useEffect(() => {
		setUiValue((previousValue) => {
			if (
				previousValue.length === incomingUiValue.length &&
				previousValue.every((current, index) => current === incomingUiValue[index])
			) {
				return previousValue;
			}
			return incomingUiValue;
		});
	}, [incomingUiValue]);

	const normalizedUiSingleValue = normalizeSingleSliderValue(
		field.settings,
		uiValue[0]
	);
	const normalizedUiRangeValue = normalizeRangeSliderValue(field.settings, uiValue);

	const handleSliderValueChange = (values: number[]) => {
		if (isRangeMode) {
			const nextRangeValue = normalizeRangeSliderValue(field.settings, values);
			setUiValue([nextRangeValue.min, nextRangeValue.max]);
			onChange(nextRangeValue);
			return;
		}

		const nextSingleValue = normalizeSingleSliderValue(field.settings, values[0]);
		setUiValue([nextSingleValue]);
		onChange(nextSingleValue);
	};

	return (
		<div className="flex flex-col gap-3">
			<Card className="border-0 bg-transparent p-0 shadow-none">
				<CardContent className="flex flex-col gap-2 p-0">
					<Slider
						aria-valuemax={bounds.max}
						aria-valuemin={bounds.min}
						aria-valuenow={isRangeMode ? undefined : normalizedUiSingleValue}
						aria-valuetext={
							isRangeMode
								? `${normalizedUiRangeValue.min} - ${normalizedUiRangeValue.max}`
								: undefined
						}
						className={errorRingClasses}
						disabled={disabled}
						enableRangeDrag={isRangeMode}
						max={bounds.max}
						min={bounds.min}
						onValueChange={handleSliderValueChange}
						step={bounds.step}
						value={
							isRangeMode
								? [normalizedUiRangeValue.min, normalizedUiRangeValue.max]
								: [normalizedUiSingleValue]
						}
					/>
					<div className="flex items-center justify-between text-muted-foreground">
						<span>{bounds.min}</span>
						<span>{bounds.max}</span>
					</div>
					<div className="flex items-center justify-start">
						<Badge variant={"outline"}>
							{isRangeMode
								? `${normalizedUiRangeValue.min} - ${normalizedUiRangeValue.max}`
								: `${normalizedUiSingleValue}`}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
