export type SettingsSearchItem = {
	label: string;
	section: string;
	anchorId: string;
	keywords?: string[];
};

export const SETTINGS_SEARCH_INDEX: SettingsSearchItem[] = [
	{
		label: "Basic Information",
		section: "basic",
		anchorId: "basic-info-title",
		keywords: ["title", "description", "submit", "success"],
	},
	{
		label: "Form Behavior",
		section: "basic",
		anchorId: "behavior-title",
		keywords: ["rtl", "auto focus", "hide header"],
	},

	{
		label: "Rate Limiting",
		section: "limits",
		anchorId: "rate-limit-title",
		keywords: ["rate", "spam", "throttle"],
	},
	{
		label: "Response Limit",
		section: "limits",
		anchorId: "response-limit-title",
		keywords: ["max responses", "cap", "limit"],
	},

	{
		label: "Password Protection",
		section: "security",
		anchorId: "password-protection-title",
		keywords: ["password", "protect"],
	},
	{
		label: "Duplicate Prevention",
		section: "security",
		anchorId: "duplicate-prevention-title",
		keywords: ["duplicate", "repeat", "once"],
	},
	{
		label: "Profanity Filter",
		section: "security",
		anchorId: "profanity-filter-title",
		keywords: ["profanity", "bad words", "filter"],
	},
	{
		label: "Bot Protection",
		section: "security",
		anchorId: "bot-protection-title",
		keywords: ["bot", "captcha", "spam"],
	},

	{
		label: "Branding",
		section: "branding",
		anchorId: "branding-title",
		keywords: ["branding", "icons", "social"],
	},
	{
		label: "Social Media Links",
		section: "branding",
		anchorId: "social-media-links-title",
		keywords: ["social", "media", "links"],
	},

	{
		label: "Quiz & Scoring",
		section: "quiz",
		anchorId: "quiz-title",
		keywords: ["quiz", "score", "answers"],
	},

	{
		label: "Notifications",
		section: "notifications",
		anchorId: "notifications-title",
		keywords: ["notifications", "email", "notify"],
	},

	{
		label: "API Access",
		section: "api",
		anchorId: "api-access-title",
		keywords: ["api", "key", "endpoint"],
	},

	{
		label: "Webhooks",
		section: "webhooks",
		anchorId: "webhooks-title",
		keywords: ["webhook", "events"],
	},

	{
		label: "Design",
		section: "design",
		anchorId: "design-title",
		keywords: ["theme", "styles", "colors"],
	},

	{
		label: "SEO",
		section: "metadata",
		anchorId: "metadata-title",
		keywords: ["seo", "meta", "og"],
	},
	{
		label: "Social Metadata",
		section: "metadata",
		anchorId: "social-metadata-title",
		keywords: ["social", "meta", "og"],
	},
	{
		label: "Search Engine Indexing",
		section: "metadata",
		anchorId: "search-engine-indexing-title",
		keywords: ["search", "engine", "index"],
	},
];
