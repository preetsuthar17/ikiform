import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export function useThrottledStreamContent(
	content: string,
	delay = 100,
): string {
	const [throttledContent, setThrottledContent] = useState(content);
	const lastUpdateTime = useRef(Date.now());

	useEffect(() => {
		const now = Date.now();
		const timeSinceLastUpdate = now - lastUpdateTime.current;

		if (timeSinceLastUpdate >= delay) {
			setThrottledContent(content);
			lastUpdateTime.current = now;
		} else {
			const timer = setTimeout(() => {
				setThrottledContent(content);
				lastUpdateTime.current = Date.now();
			}, delay - timeSinceLastUpdate);

			return () => clearTimeout(timer);
		}
	}, [content, delay]);

	return throttledContent;
}
