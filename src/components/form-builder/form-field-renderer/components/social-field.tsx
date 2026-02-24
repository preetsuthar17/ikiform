import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialMediaIcons } from "@/components/ui/social-media-icons";

import type { BaseFieldProps } from "../types";

import { getBaseClasses } from "../utils";

interface SocialPlatformConfig {
	platform: string;
	labelKey: string;
	placeholder: string;
	icon: string;
}

const AVAILABLE_SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
	{
		platform: "linkedin",
		labelKey: "linkedin",
		placeholder: "https://linkedin.com/in/username",
		icon: "linkedin",
	},
	{
		platform: "twitter",
		labelKey: "twitter",
		placeholder: "https://x.com/username",
		icon: "twitter",
	},
	{
		platform: "youtube",
		labelKey: "youtube",
		placeholder: "https://youtube.com/@channel",
		icon: "youtube",
	},
	{
		platform: "instagram",
		labelKey: "instagram",
		placeholder: "https://instagram.com/username",
		icon: "instagram",
	},
	{
		platform: "facebook",
		labelKey: "facebook",
		placeholder: "https://facebook.com/username",
		icon: "facebook",
	},
	{
		platform: "github",
		labelKey: "github",
		placeholder: "https://github.com/username",
		icon: "github",
	},
	{
		platform: "website",
		labelKey: "website",
		placeholder: "https://example.com",
		icon: "website",
	},
];

export function SocialField({ field, value, onChange, error }: BaseFieldProps) {
	const t = useTranslations("product.formBuilder.fieldRenderer.social");
	const baseClasses = getBaseClasses(field, error);
	const socialData = value || {};

	const handlePlatformUrlChange = (platform: string, url: string) => {
		const trimmedUrl = url.trim();
		const updatedData = { ...socialData, [platform]: trimmedUrl };
		onChange(updatedData);
	};

	const handleCustomLinkChange = (index: number, url: string) => {
		const trimmedUrl = url.trim();
		const updatedData = {
			...socialData,
			[`custom_${index}`]: trimmedUrl,
		};
		onChange(updatedData);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			e.currentTarget.blur();
		}
	};

	const getEnabledPlatforms = () => {
		const enabledPlatforms =
			field.settings?.socialPlatforms ||
			AVAILABLE_SOCIAL_PLATFORMS.map((p) => p.platform);

		return AVAILABLE_SOCIAL_PLATFORMS.filter((platform) =>
			enabledPlatforms.includes(platform.platform)
		);
	};

	const getCustomLinks = () => field.settings?.customLinks || [];

	const shouldShowPreview = field.settings?.showIcons;
	const previewIconSize = field.settings?.iconSize || "md";

	const renderSocialInputs = () => (
		<Card className="border-0 p-0 shadow-none">
			<CardContent className="p-0">
				<div className="flex flex-col gap-4">
					{getEnabledPlatforms().map((platform) => (
						<div className="flex flex-col gap-2" key={platform.platform}>
							<Label
								className="font-medium text-sm"
								htmlFor={`${field.id}-${platform.platform}`}
							>
								{t(`platforms.${platform.labelKey}`)}
							</Label>
							<Input
								autoComplete="url"
								className={baseClasses}
								id={`${field.id}-${platform.platform}`}
								name={`${field.id}-${platform.platform}`}
								onChange={(e) =>
									handlePlatformUrlChange(platform.platform, e.target.value)
								}
								onKeyDown={handleInputKeyDown}
								placeholder={platform.placeholder}
								type="url"
								value={socialData[platform.platform] || ""}
							/>
						</div>
					))}

					{getCustomLinks().map((link, index) => (
						<div className="flex flex-col gap-2" key={`custom-${index}`}>
							<Label
								className="font-medium text-sm"
								htmlFor={`${field.id}-custom-${index}`}
							>
								{link.label || t("customLink", { index: index + 1 })}
							</Label>
							<Input
								autoComplete="url"
								className={baseClasses}
								id={`${field.id}-custom-${index}`}
								name={`${field.id}-custom-${index}`}
								onChange={(e) => handleCustomLinkChange(index, e.target.value)}
								onKeyDown={handleInputKeyDown}
								placeholder={link.placeholder || t("customLinkPlaceholder")}
								type="url"
								value={socialData[`custom_${index}`] || ""}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);

	const renderPreview = () => {
		if (!shouldShowPreview) return null;

		return (
			<Card className="border-0 bg-muted/30 shadow-none">
				<CardContent className="p-4">
					<Label className="mb-3 block font-semibold text-sm">
						{t("preview")}
					</Label>
					<SocialMediaIcons
						className="justify-center"
						iconSize={previewIconSize}
						platforms={socialData}
					/>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="flex flex-col gap-3">
			{renderSocialInputs()}
			{renderPreview()}
		</div>
	);
}
