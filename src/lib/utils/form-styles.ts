import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";

export interface FormStyleConfig {
	colors?: {
		background?: string;
		text?: string;
		primary?: string;
		border?: string;
		websiteBackground?: string;
	};
	typography?: {
		fontFamily?: string;
		fontSize?: string;
		fontWeight?: string;
	};
	layout?: {
		maxWidth?: string;
		customWidth?: string;
		padding?: string;
		margin?: string;
		borderRadius?: string;
	};
}

export function generateFormStyles(settings: LocalSettings): FormStyleConfig {
	return {
		colors: settings.colors,
		typography: settings.typography,
		layout: {
			...settings.layout,
			maxWidth:
				settings.layout?.maxWidth === "custom"
					? settings.layout.customWidth || "600px"
					: getMaxWidthValue(settings.layout?.maxWidth),
		},
	};
}

export function getMaxWidthValue(size?: string): string {
	const widthMap = {
		sm: "400px",
		md: "600px",
		lg: "800px",
		xl: "1000px",
		full: "100%",
	};
	return widthMap[size as keyof typeof widthMap] || "600px";
}

export function getPaddingValue(size?: string): string {
	const paddingMap = {
		none: "0",
		sm: "16px",
		md: "24px",
		lg: "32px",
	};
	return paddingMap[size as keyof typeof paddingMap] || "24px";
}

export function getMarginValue(size?: string): string {
	const marginMap = {
		none: "0",
		sm: "8px",
		md: "16px",
		lg: "32px",
	};
	return marginMap[size as keyof typeof marginMap] || "16px";
}

export function getBorderRadiusValue(size?: string): string {
	const radiusMap = {
		none: "0",
		sm: "4px",
		md: "8px",
		lg: "16px",
		xl: "24px",
	};
	return radiusMap[size as keyof typeof radiusMap] || "8px";
}

export function getFontSizeValue(size?: string): string {
	const sizeMap = {
		xs: "12px",
		sm: "14px",
		base: "16px",
		lg: "18px",
		xl: "20px",
	};
	return sizeMap[size as keyof typeof sizeMap] || "14px";
}

export function getFontWeightValue(weight?: string): string {
	const weightMap = {
		light: "300",
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	};
	return weightMap[weight as keyof typeof weightMap] || "400";
}

export function injectFormStyles(
	styleConfig: FormStyleConfig,
	formId: string,
): void {
	const existingStyle = document.getElementById(`form-styles-${formId}`);
	if (existingStyle) {
		existingStyle.remove();
	}

	const css = `
    .form-container-${formId} {
      ${styleConfig.colors?.background ? `background-color: ${styleConfig.colors.background};` : ""}
      ${styleConfig.colors?.text ? `color: ${styleConfig.colors.text};` : ""}
      ${styleConfig.typography?.fontFamily ? `font-family: "${styleConfig.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` : ""}
      ${styleConfig.layout?.maxWidth ? `max-width: ${styleConfig.layout.maxWidth};` : ""}
      ${styleConfig.layout?.padding ? `padding: ${getPaddingValue(styleConfig.layout.padding)};` : ""}
      ${styleConfig.layout?.margin ? `margin: ${getMarginValue(styleConfig.layout.margin)} auto;` : ""}
      ${styleConfig.layout?.borderRadius ? `border-radius: ${getBorderRadiusValue(styleConfig.layout.borderRadius)};` : ""}
    }
    
    .form-container-${formId} h1,
    .form-container-${formId} h2,
    .form-container-${formId} h3,
    .form-container-${formId} h4,
    .form-container-${formId} h5,
    .form-container-${formId} h6 {
      ${styleConfig.typography?.fontFamily ? `font-family: "${styleConfig.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` : ""}
      font-size: 1.875rem;
      line-height: 2.25rem;
      font-weight: 600;
    }
    
    .form-container-${formId} p,
    .form-container-${formId} div,
    .form-container-${formId} span,
    .form-container-${formId} input,
    .form-container-${formId} textarea,
    .form-container-${formId} select,
    .form-container-${formId} button,
    .form-container-${formId} label {
      ${styleConfig.colors?.border ? `border-color: ${styleConfig.colors.border};` : ""}
      ${styleConfig.typography?.fontFamily ? `font-family: "${styleConfig.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;` : ""}
      ${styleConfig.typography?.fontSize ? `font-size: ${getFontSizeValue(styleConfig.typography.fontSize)};` : ""}
      ${styleConfig.typography?.fontWeight ? `font-weight: ${getFontWeightValue(styleConfig.typography.fontWeight)};` : ""}
    }
    
    .form-container-${formId} .form-button-primary {
      ${styleConfig.colors?.primary ? `background-color: ${styleConfig.colors.primary};` : ""}
      ${styleConfig.colors?.primary ? `border-color: ${styleConfig.colors.primary};` : ""}
    }
    
    .form-container-${formId} .form-button-primary:hover {
      ${styleConfig.colors?.primary ? `background-color: color-mix(in srgb, ${styleConfig.colors.primary} 90%, black);` : ""}
    }
  `;

	const style = document.createElement("style");
	style.id = `form-styles-${formId}`;
	style.textContent = css;
	document.head.appendChild(style);
}

export function removeFormStyles(formId: string): void {
	const existingStyle = document.getElementById(`form-styles-${formId}`);
	if (existingStyle) {
		existingStyle.remove();
	}
}

export function generateCSSSelectorStyles(settings: LocalSettings): string {
	const config = generateFormStyles(settings);

	return `
    .ikiform-customized {
      ${config.colors?.background ? `background-color: ${config.colors.background} !important;` : ""}
      ${config.colors?.text ? `color: ${config.colors.text} !important;` : ""}
      ${config.typography?.fontFamily ? `font-family: "${config.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;` : ""}
      ${config.layout?.maxWidth ? `max-width: ${config.layout.maxWidth} !important;` : ""}
      ${config.layout?.padding ? `padding: ${getPaddingValue(config.layout.padding)} !important;` : ""}
      ${config.layout?.margin ? `margin: ${getMarginValue(config.layout.margin)} auto !important;` : ""}
      ${config.layout?.borderRadius ? `border-radius: ${getBorderRadiusValue(config.layout.borderRadius)} !important;` : ""}
    }
    
    .ikiform-customized h1,
    .ikiform-customized h2,
    .ikiform-customized h3,
    .ikiform-customized h4,
    .ikiform-customized h5,
    .ikiform-customized h6 {
      ${config.typography?.fontFamily ? `font-family: "${config.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;` : ""}
      font-size: 1.875rem !important;
      line-height: 2.25rem !important;
      font-weight: 600 !important;
    }
    
    .ikiform-customized p,
    .ikiform-customized div,
    .ikiform-customized span,
    .ikiform-customized input,
    .ikiform-customized textarea,
    .ikiform-customized select,
    .ikiform-customized button,
    .ikiform-customized label {
      ${config.colors?.border ? `border-color: ${config.colors.border} !important;` : ""}
      ${config.typography?.fontFamily ? `font-family: "${config.typography.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;` : ""}
      ${config.typography?.fontSize ? `font-size: ${getFontSizeValue(config.typography.fontSize)} !important;` : ""}
      ${config.typography?.fontWeight ? `font-weight: ${getFontWeightValue(config.typography.fontWeight)} !important;` : ""}
    }
    
    .ikiform-customized .primary-button,
    .ikiform-customized button[type="submit"] {
      ${config.colors?.primary ? `background-color: ${config.colors.primary} !important;` : ""}
      ${config.colors?.primary ? `border-color: ${config.colors.primary} !important;` : ""}
    }
  `;
}
