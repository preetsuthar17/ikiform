"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from "react";

import { cn } from "@/lib/utils";

interface SliderProps
	extends Omit<
		SliderPrimitive.Root.Props,
		"value" | "defaultValue" | "onValueChange" | "onValueCommitted"
	> {
	defaultValue?: number[];
	enableRangeDrag?: boolean;
	onValueCommitted?: (value: number[]) => void;
	onValueChange?: (value: number[]) => void;
	value?: number[];
}

function Slider({
	className,
	defaultValue,
	enableRangeDrag = false,
	value,
	onValueChange,
	onValueCommitted,
	min = 0,
	max = 100,
	orientation = "horizontal",
	step = 1,
	...props
}: SliderProps) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const rangeDragStateRef = useRef<{
		pointerId: number;
		span: number;
		startCoordinate: number;
		startValues: [number, number];
	} | null>(null);

	const _values = useMemo(() => {
		if (Array.isArray(value)) {
			return value;
		}
		if (Array.isArray(defaultValue)) {
			return defaultValue;
		}
		return [min];
	}, [value, defaultValue, min]);

	const thumbEntries = useMemo(() => {
		const occurrences = new Map<number, number>();
		return _values.map((sliderValue) => {
			const seenCount = (occurrences.get(sliderValue) ?? 0) + 1;
			occurrences.set(sliderValue, seenCount);
			return {
				key: `thumb-${sliderValue}-${seenCount}`,
			};
		});
	}, [_values]);

	const canDragRange =
		enableRangeDrag && _values.length === 2 && typeof onValueChange === "function";

	const getPointerCoordinate = useCallback(
		(event: PointerEvent | ReactPointerEvent<Element>) => {
			if (orientation === "vertical") {
				return -event.clientY;
			}
			return event.clientX;
		},
		[orientation]
	);

	useEffect(() => {
		if (!canDragRange) {
			rangeDragStateRef.current = null;
			return;
		}

		const handleRangeDragMove = (event: PointerEvent) => {
			if (!onValueChange) {
				return;
			}

			const dragState = rangeDragStateRef.current;
			if (!dragState || dragState.pointerId !== event.pointerId) {
				return;
			}

			if ((event.buttons & 1) !== 1) {
				rangeDragStateRef.current = null;
				return;
			}

			const bounds = rootRef.current?.getBoundingClientRect();
			if (!bounds) {
				return;
			}

			const axisSize =
				orientation === "vertical" ? bounds.height : bounds.width;
			if (axisSize <= 0) {
				return;
			}

			const valueRange = max - min;
			if (valueRange <= 0) {
				return;
			}

			const normalizedStep = step > 0 ? step : 1;
			const deltaCoordinate =
				getPointerCoordinate(event) - dragState.startCoordinate;
			const rawDelta = (deltaCoordinate / axisSize) * valueRange;
			const snappedDelta =
				Math.round(rawDelta / normalizedStep) * normalizedStep;

			const maxStart = Math.max(min, max - dragState.span);
			const nextMin = Math.max(
				min,
				Math.min(maxStart, dragState.startValues[0] + snappedDelta)
			);
			const nextMax = Math.min(max, nextMin + dragState.span);

			onValueChange([nextMin, nextMax]);
		};

		const stopRangeDrag = (event: PointerEvent) => {
			if (rangeDragStateRef.current?.pointerId === event.pointerId) {
				rangeDragStateRef.current = null;
			}
		};
		const clearRangeDrag = () => {
			rangeDragStateRef.current = null;
		};

		window.addEventListener("pointermove", handleRangeDragMove);
		window.addEventListener("pointerup", stopRangeDrag);
		window.addEventListener("pointercancel", stopRangeDrag);
		window.addEventListener("blur", clearRangeDrag);

		return () => {
			window.removeEventListener("pointermove", handleRangeDragMove);
			window.removeEventListener("pointerup", stopRangeDrag);
			window.removeEventListener("pointercancel", stopRangeDrag);
			window.removeEventListener("blur", clearRangeDrag);
		};
	}, [canDragRange, getPointerCoordinate, max, min, onValueChange, orientation, step]);

	const handleRangeDragStart = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (!(canDragRange && onValueChange) || event.button !== 0) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const first = _values[0];
			const second = _values[1];
			const startValues: [number, number] =
				first <= second ? [first, second] : [second, first];

			rangeDragStateRef.current = {
				pointerId: event.pointerId,
				span: startValues[1] - startValues[0],
				startCoordinate: getPointerCoordinate(event),
				startValues,
			};
		},
		[_values, canDragRange, getPointerCoordinate, onValueChange]
	);

	return (
		<SliderPrimitive.Root
			className={cn(
				"data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full",
				className
			)}
			data-slot="slider"
			defaultValue={defaultValue}
			max={max}
			min={min}
			onValueChange={
				onValueChange
					? (nextValue) => {
						onValueChange(Array.isArray(nextValue) ? [...nextValue] : [nextValue]);
					}
					: undefined
			}
			onValueCommitted={
				onValueCommitted
					? (nextValue) => {
						onValueCommitted(
							Array.isArray(nextValue) ? [...nextValue] : [nextValue]
						);
					}
					: undefined
			}
			orientation={orientation}
			ref={rootRef}
			step={step}
			thumbAlignment="edge"
			value={value}
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50">
				<SliderPrimitive.Track
					className="relative grow select-none overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"
					data-slot="slider-track"
				>
					<SliderPrimitive.Indicator
						className={cn(
							"select-none bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
							canDragRange && "cursor-grab active:cursor-grabbing"
						)}
						data-slot="slider-range"
						onPointerDown={canDragRange ? handleRangeDragStart : undefined}
					/>
				</SliderPrimitive.Track>
				{thumbEntries.map(({ key }) => (
					<SliderPrimitive.Thumb
						className="size-4 rounded-full border border-primary bg-primary shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-primary/30 focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-hidden block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50"
						data-slot="slider-thumb"
						key={key}
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
