import type { AppLocale } from "@/i18n/routing";
import { withLocalePath } from "@/lib/i18n/pathname";
import { SITE_NAME, SITE_URL } from "./constants";

function getLocalizedText(
	locale: AppLocale,
	text: { en: string; es: string }
): string {
	return locale === "es" ? text.es : text.en;
}

export function getOrganizationJsonLd(locale: AppLocale) {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: SITE_NAME,
		url: SITE_URL,
		logo: `${SITE_URL}/favicon.ico`,
		sameAs: [
			"https://x.com/preetsuthar17",
			"https://github.com/preetsuthar17/ikiform",
		],
		description: getLocalizedText(locale, {
			en: "Build forms, collect responses and analyze data effortlessly.",
			es: "Crea formularios, recopila respuestas y analiza datos sin esfuerzo.",
		}),
	};
}

export function getWebsiteJsonLd(locale: AppLocale) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_NAME,
		url: `${SITE_URL}${withLocalePath("/", locale)}`,
		inLanguage: locale,
		potentialAction: {
			"@type": "SearchAction",
			target: `${SITE_URL}${withLocalePath("/", locale)}?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	};
}

export function getSoftwareApplicationJsonLd(locale: AppLocale) {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: SITE_NAME,
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		url: `${SITE_URL}${withLocalePath("/", locale)}`,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		description: getLocalizedText(locale, {
			en: "AI-powered form builder and analytics platform.",
			es: "Plataforma de creación de formularios y analítica impulsada por IA.",
		}),
	};
}

export function getFaqJsonLd(locale: AppLocale) {
	const qas =
		locale === "es"
			? [
					{
						question: "¿Qué es Ikiform?",
						answer:
							"Ikiform es un creador de formularios de código abierto para recopilar respuestas y analizar datos.",
					},
					{
						question: "¿Puedo incrustar formularios en mi sitio?",
						answer:
							"Sí, puedes incrustar formularios de Ikiform y personalizar su apariencia.",
					},
				]
			: [
					{
						question: "What is Ikiform?",
						answer:
							"Ikiform is an open-source form builder for collecting responses and analyzing data.",
					},
					{
						question: "Can I embed forms on my website?",
						answer:
							"Yes, you can embed Ikiform forms and customize their appearance.",
					},
				];

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: qas.map((qa) => ({
			"@type": "Question",
			name: qa.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: qa.answer,
			},
		})),
	};
}

export function getBreadcrumbJsonLd(
	locale: AppLocale,
	items: Array<{ name: string; path: string }>
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${SITE_URL}${withLocalePath(item.path, locale)}`,
		})),
	};
}
