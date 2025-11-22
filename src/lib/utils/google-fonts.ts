export function loadGoogleFont(
	fontFamily: string,
	weights: string[] = ["400", "500", "600", "700"],
) {
	const existingLink = document.querySelector(
		`link[href*="family=${fontFamily.replace(/\s+/g, "+")}"]`,
	);
	if (existingLink) {
		return Promise.resolve();
	}

	return new Promise<void>((resolve, reject) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@${weights.join(";")}&display=swap`;

		link.onload = () => resolve();
		link.onerror = () =>
			reject(new Error(`Failed to load font: ${fontFamily}`));

		document.head.appendChild(link);
	});
}

export function preloadGoogleFonts(fonts: string[]) {
	return Promise.all(fonts.map((font) => loadGoogleFont(font)));
}

export function generateFontPreviewStyles(fontFamily: string) {
	return {
		fontFamily: `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
	};
}

export function getWebSafeFallback(fontFamily: string): string {
	const serifFonts = ["Merriweather", "Playfair Display", "Lora", "PT Serif"];
	const monoFonts = ["Fira Code", "JetBrains Mono", "Source Code Pro"];

	if (serifFonts.includes(fontFamily)) {
		return `"${fontFamily}", Georgia, "Times New Roman", Times, serif`;
	}

	if (monoFonts.includes(fontFamily)) {
		return `"${fontFamily}", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`;
	}

	return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
}
