"use client";

import type { EmbedConfig } from "./EmbedCustomizer";

interface EmbedPreviewProps {
	config: EmbedConfig;
	embedUrl: string;
	formTitle: string;
	viewMode?: "desktop" | "mobile";
}

export default function EmbedPreview({
	config,
	embedUrl,
	formTitle,
	viewMode = "desktop",
}: EmbedPreviewProps) {
	const getIframeStyles = () => {
		const baseWidth = config.responsive ? "100%" : config.width;
		const styles: React.CSSProperties = {
			width: viewMode === "mobile" ? "375px" : baseWidth,
			height: viewMode === "mobile" ? "500px" : config.height,
			border: config.showBorder
				? `${config.borderWidth}px solid ${config.borderColor}`
				: "none",
			borderRadius: `${config.borderRadius}px`,
			backgroundColor: config.allowTransparency
				? "transparent"
				: config.backgroundColor,
			maxWidth: viewMode === "mobile" ? "375px" : "none",
		};

		return styles;
	};

	const getContainerStyles = () => {
		const styles: React.CSSProperties = {
			padding: `${config.padding}px`,
		};

		return styles;
	};

	return (
		<div
			className={`flex ${viewMode === "mobile" ? "justify-center" : "justify-start"} rounded-lg bg-accent/5 p-4`}
			style={getContainerStyles()}
		>
			<iframe
				allow="clipboard-write; camera; microphone"
				className="transition-all duration-300"
				loading={config.loadingMode}
				sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
				src={embedUrl}
				style={getIframeStyles()}
				title={formTitle}
			/>
		</div>
	);
}
