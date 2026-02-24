import type { AppLocale } from "@/i18n/routing";

export const SITE_URL =
	process.env.SITE_URL?.replace(/\/+$/, "") || "https://www.ikiform.com";

export const SITE_NAME = "Ikiform";

export const DEFAULT_OG_IMAGE =
	"https://av5on64jc4.ufs.sh/f/jYAIyA6pXignXLo3C0Y9Qowsp7KUqeRL5mnCNlb0zEZuj1F8";

export const OPEN_GRAPH_LOCALE: Record<AppLocale, string> = {
	en: "en_US",
	es: "es_ES",
	fr: "fr_FR",
	de: "de_DE",
	pt: "pt_BR",
	hi: "hi_IN",
	ja: "ja_JP",
	zh: "zh_CN",
	it: "it_IT",
	ar: "ar_SA",
	ko: "ko_KR",
	ru: "ru_RU",
	tr: "tr_TR",
	nl: "nl_NL",
};

const ALL_OG_LOCALES = Object.values(OPEN_GRAPH_LOCALE);

export const OPEN_GRAPH_ALTERNATE_LOCALES: Record<AppLocale, string[]> =
	Object.fromEntries(
		Object.entries(OPEN_GRAPH_LOCALE).map(([locale, ogLocale]) => [
			locale,
			ALL_OG_LOCALES.filter((l) => l !== ogLocale),
		])
	) as Record<AppLocale, string[]>;
