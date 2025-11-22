"use client";

import { useEffect } from "react";

export function LightThemeEnforcer() {
	useEffect(() => {
		document.documentElement.classList.remove("dark");
		document.documentElement.classList.add("light");

		document.body.classList.remove("dark");
		document.body.classList.add("light");

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					const element = mutation.target as HTMLElement;
					if (element.classList.contains("dark")) {
						element.classList.remove("dark");
						element.classList.add("light");
					}
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return null;
}
