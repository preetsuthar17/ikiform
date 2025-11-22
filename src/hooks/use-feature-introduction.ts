import { useEffect, useState } from "react";

interface UseFeatureIntroductionOptions {
	id: string;
	delay?: number;
	enabled?: boolean;
}

export function useFeatureIntroduction({
	id,
	delay = 2000,
	enabled = true,
}: UseFeatureIntroductionOptions) {
	const [shouldShow, setShouldShow] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const storageKey = `feature-intro-dismissed-${id}`;

	useEffect(() => {
		if (!enabled) {
			setIsLoaded(true);
			return;
		}

		const hasBeenDismissed = localStorage.getItem(storageKey) === "true";

		if (hasBeenDismissed) {
			setIsLoaded(true);
		} else {
			const timer = setTimeout(() => {
				setShouldShow(true);
				setIsLoaded(true);
			}, delay);

			return () => clearTimeout(timer);
		}
	}, [delay, storageKey, enabled]);

	const dismiss = () => {
		setShouldShow(false);
		localStorage.setItem(storageKey, "true");
	};

	const reset = () => {
		localStorage.removeItem(storageKey);
		setShouldShow(false);
		setIsLoaded(false);
	};

	return {
		shouldShow,
		isLoaded,
		dismiss,
		reset,
	};
}
