import type { FormField } from "@/lib/database";

export type SliderMode = "single" | "range";

export interface SliderRangeValue {
	max: number;
	min: number;
}

interface SliderBounds {
	max: number;
	min: number;
	step: number;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const DEFAULT_SINGLE_VALUE = 50;

const toFiniteNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return null;
};

const clampToBounds = (value: number, bounds: SliderBounds): number =>
	Math.min(bounds.max, Math.max(bounds.min, value));

const orderRange = (min: number, max: number): SliderRangeValue =>
	min <= max ? { min, max } : { min: max, max: min };

export function isRangeSliderMode(
	settings?: FormField["settings"]
): settings is FormField["settings"] & { sliderMode: "range" } {
	return settings?.sliderMode === "range";
}

export function normalizeSliderBounds(
	settings?: FormField["settings"]
): SliderBounds {
	let min = toFiniteNumber(settings?.min) ?? DEFAULT_MIN;
	let max = toFiniteNumber(settings?.max) ?? DEFAULT_MAX;

	if (min > max) {
		[min, max] = [max, min];
	}

	const rawStep = toFiniteNumber(settings?.step) ?? DEFAULT_STEP;
	const step = rawStep > 0 ? rawStep : DEFAULT_STEP;

	return { min, max, step };
}

export function normalizeSingleSliderValue(
	settings?: FormField["settings"],
	rawValue?: unknown
): number {
	const bounds = normalizeSliderBounds(settings);
	const fallbackValue = clampToBounds(
		toFiniteNumber(settings?.defaultValue) ?? DEFAULT_SINGLE_VALUE,
		bounds
	);
	const parsedValue = toFiniteNumber(rawValue);

	return clampToBounds(parsedValue ?? fallbackValue, bounds);
}

export function isSliderRangeValue(value: unknown): value is SliderRangeValue {
	if (!(value && typeof value === "object") || Array.isArray(value)) {
		return false;
	}

	const candidate = value as { min?: unknown; max?: unknown };
	return (
		toFiniteNumber(candidate.min) !== null && toFiniteNumber(candidate.max) !== null
	);
}

export function normalizeRangeSliderValue(
	settings?: FormField["settings"],
	rawValue?: unknown
): SliderRangeValue {
	const bounds = normalizeSliderBounds(settings);
	const defaultRange = orderRange(
		clampToBounds(toFiniteNumber(settings?.defaultRangeMin) ?? bounds.min, bounds),
		clampToBounds(toFiniteNumber(settings?.defaultRangeMax) ?? bounds.max, bounds)
	);

	if (isSliderRangeValue(rawValue)) {
		return orderRange(
			clampToBounds(toFiniteNumber(rawValue.min) ?? defaultRange.min, bounds),
			clampToBounds(toFiniteNumber(rawValue.max) ?? defaultRange.max, bounds)
		);
	}

	if (Array.isArray(rawValue)) {
		const first = toFiniteNumber(rawValue[0]);
		const second = toFiniteNumber(rawValue[1]);
		if (first !== null && second !== null) {
			return orderRange(clampToBounds(first, bounds), clampToBounds(second, bounds));
		}
	}

	const scalarValue = toFiniteNumber(rawValue);
	if (scalarValue !== null) {
		const clamped = clampToBounds(scalarValue, bounds);
		return { min: clamped, max: clamped };
	}

	return defaultRange;
}

export function normalizeSliderSettings(
	settings?: FormField["settings"]
): {
	sliderMode: SliderMode;
	min: number;
	max: number;
	step: number;
	defaultValue: number;
	defaultRangeMin: number;
	defaultRangeMax: number;
} {
	const bounds = normalizeSliderBounds(settings);
	const rangeValue = normalizeRangeSliderValue(settings);
	const singleValue = normalizeSingleSliderValue(settings);

	return {
		sliderMode: isRangeSliderMode(settings) ? "range" : "single",
		min: bounds.min,
		max: bounds.max,
		step: bounds.step,
		defaultValue: singleValue,
		defaultRangeMin: rangeValue.min,
		defaultRangeMax: rangeValue.max,
	};
}
