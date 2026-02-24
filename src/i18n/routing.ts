import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "es", "fr", "de", "pt", "hi", "ja", "zh", "it", "ar", "ko", "ru", "tr", "nl"],
	defaultLocale: "en",
	localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
