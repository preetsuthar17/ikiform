import type { AppLocale } from "@/i18n/routing";

export const SITE_URL =
	process.env.SITE_URL?.replace(/\/+$/, "") || "https://www.ikiform.com";

export const SITE_NAME = "Ikiform";

export const DEFAULT_OG_IMAGE =
	"https://av5on64jc4.ufs.sh/f/jYAIyA6pXignXLo3C0Y9Qowsp7KUqeRL5mnCNlb0zEZuj1F8";

export const OPEN_GRAPH_LOCALE: Record<AppLocale, string> = {
	en: "en_US",
	es: "es_ES",
};

export const OPEN_GRAPH_ALTERNATE_LOCALES: Record<AppLocale, string[]> = {
	en: ["es_ES"],
	es: ["en_US"],
};
