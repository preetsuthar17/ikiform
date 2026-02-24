import type { AppLocale } from "@/i18n/routing";
import { withLocalePath } from "@/lib/i18n/pathname";
import { SITE_NAME, SITE_URL } from "./constants";

const LOCALIZED_TEXT: Record<
	string,
	Record<AppLocale, string>
> = {
	orgDescription: {
		en: "Build forms, collect responses and analyze data effortlessly.",
		es: "Crea formularios, recopila respuestas y analiza datos sin esfuerzo.",
		fr: "Créez des formulaires, collectez des réponses et analysez des données sans effort.",
		de: "Erstellen Sie Formulare, sammeln Sie Antworten und analysieren Sie Daten mühelos.",
		pt: "Crie formulários, colete respostas e analise dados sem esforço.",
		hi: "आसानी से फॉर्म बनाएं, प्रतिक्रियाएं एकत्र करें और डेटा का विश्लेषण करें।",
		ja: "フォームを作成し、回答を収集し、データを簡単に分析します。",
		zh: "轻松创建表单、收集回复并分析数据。",
		it: "Crea moduli, raccogli risposte e analizza dati senza sforzo.",
		ar: "أنشئ نماذج، واجمع الردود، وحلل البيانات بسهولة.",
		ko: "손쉽게 양식을 만들고, 응답을 수집하고, 데이터를 분석하세요.",
		ru: "Создавайте формы, собирайте ответы и анализируйте данные без усилий.",
		tr: "Formlar oluşturun, yanıtlar toplayın ve verileri zahmetsizce analiz edin.",
		nl: "Maak formulieren, verzamel antwoorden en analyseer gegevens moeiteloos.",
	},
	appDescription: {
		en: "AI-powered form builder and analytics platform.",
		es: "Plataforma de creación de formularios y analítica impulsada por IA.",
		fr: "Plateforme de création de formulaires et d'analyse alimentée par l'IA.",
		de: "KI-gestützte Formularerstellung und Analyseplattform.",
		pt: "Plataforma de criação de formulários e análise com IA.",
		hi: "AI-संचालित फॉर्म बिल्डर और एनालिटिक्स प्लेटफॉर्म।",
		ja: "AI搭載のフォームビルダーおよび分析プラットフォーム。",
		zh: "AI驱动的表单构建器和分析平台。",
		it: "Piattaforma di creazione moduli e analisi basata sull'IA.",
		ar: "منصة إنشاء نماذج وتحليلات مدعومة بالذكاء الاصطناعي.",
		ko: "AI 기반 양식 빌더 및 분석 플랫폼.",
		ru: "Платформа для создания форм и аналитики на основе ИИ.",
		tr: "Yapay zeka destekli form oluşturucu ve analiz platformu.",
		nl: "AI-aangedreven formulierenbouwer en analyseplatform.",
	},
	faqQ1: {
		en: "What is Ikiform?",
		es: "¿Qué es Ikiform?",
		fr: "Qu'est-ce qu'Ikiform ?",
		de: "Was ist Ikiform?",
		pt: "O que é o Ikiform?",
		hi: "Ikiform क्या है?",
		ja: "Ikiformとは何ですか？",
		zh: "什么是Ikiform？",
		it: "Cos'è Ikiform?",
		ar: "ما هو Ikiform؟",
		ko: "Ikiform이란 무엇인가요?",
		ru: "Что такое Ikiform?",
		tr: "Ikiform nedir?",
		nl: "Wat is Ikiform?",
	},
	faqA1: {
		en: "Ikiform is an open-source form builder for collecting responses and analyzing data.",
		es: "Ikiform es un creador de formularios de código abierto para recopilar respuestas y analizar datos.",
		fr: "Ikiform est un créateur de formulaires open source pour collecter des réponses et analyser des données.",
		de: "Ikiform ist ein Open-Source-Formularersteller zum Sammeln von Antworten und Analysieren von Daten.",
		pt: "Ikiform é um criador de formulários de código aberto para coletar respostas e analisar dados.",
		hi: "Ikiform प्रतिक्रियाएं एकत्र करने और डेटा का विश्लेषण करने के लिए एक ओपन-सोर्स फॉर्म बिल्डर है।",
		ja: "Ikiformは、回答を収集しデータを分析するためのオープンソースフォームビルダーです。",
		zh: "Ikiform是一个用于收集回复和分析数据的开源表单构建器。",
		it: "Ikiform è un creatore di moduli open source per raccogliere risposte e analizzare dati.",
		ar: "Ikiform هو أداة إنشاء نماذج مفتوحة المصدر لجمع الردود وتحليل البيانات.",
		ko: "Ikiform은 응답을 수집하고 데이터를 분석하기 위한 오픈소스 양식 빌더입니다.",
		ru: "Ikiform — это конструктор форм с открытым исходным кодом для сбора ответов и анализа данных.",
		tr: "Ikiform, yanıt toplamak ve veri analizi yapmak için açık kaynaklı bir form oluşturucudur.",
		nl: "Ikiform is een open-source formulierenbouwer voor het verzamelen van reacties en het analyseren van gegevens.",
	},
	faqQ2: {
		en: "Can I embed forms on my website?",
		es: "¿Puedo incrustar formularios en mi sitio?",
		fr: "Puis-je intégrer des formulaires sur mon site web ?",
		de: "Kann ich Formulare auf meiner Website einbetten?",
		pt: "Posso incorporar formulários no meu site?",
		hi: "क्या मैं अपनी वेबसाइट पर फॉर्म एम्बेड कर सकता हूं?",
		ja: "ウェブサイトにフォームを埋め込むことはできますか？",
		zh: "我可以在网站中嵌入表单吗？",
		it: "Posso incorporare moduli nel mio sito web?",
		ar: "هل يمكنني تضمين النماذج في موقعي الإلكتروني؟",
		ko: "웹사이트에 양식을 삽입할 수 있나요?",
		ru: "Могу ли я встроить формы на свой сайт?",
		tr: "Formları web siteme gömebilir miyim?",
		nl: "Kan ik formulieren op mijn website insluiten?",
	},
	faqA2: {
		en: "Yes, you can embed Ikiform forms and customize their appearance.",
		es: "Sí, puedes incrustar formularios de Ikiform y personalizar su apariencia.",
		fr: "Oui, vous pouvez intégrer des formulaires Ikiform et personnaliser leur apparence.",
		de: "Ja, Sie können Ikiform-Formulare einbetten und deren Aussehen anpassen.",
		pt: "Sim, você pode incorporar formulários do Ikiform e personalizar sua aparência.",
		hi: "हां, आप Ikiform फॉर्म एम्बेड कर सकते हैं और उनकी दिखावट को कस्टमाइज़ कर सकते हैं।",
		ja: "はい、Ikiformフォームを埋め込み、外観をカスタマイズできます。",
		zh: "是的，您可以嵌入Ikiform表单并自定义其外观。",
		it: "Sì, puoi incorporare moduli Ikiform e personalizzarne l'aspetto.",
		ar: "نعم، يمكنك تضمين نماذج Ikiform وتخصيص مظهرها.",
		ko: "네, Ikiform 양식을 삽입하고 외관을 커스터마이즈할 수 있습니다.",
		ru: "Да, вы можете встроить формы Ikiform и настроить их внешний вид.",
		tr: "Evet, Ikiform formlarını gömebilir ve görünümlerini özelleştirebilirsiniz.",
		nl: "Ja, u kunt Ikiform-formulieren insluiten en hun uiterlijk aanpassen.",
	},
};

function t(key: string, locale: AppLocale): string {
	return LOCALIZED_TEXT[key]?.[locale] ?? LOCALIZED_TEXT[key]?.en ?? "";
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
		description: t("orgDescription", locale),
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
		description: t("appDescription", locale),
	};
}

export function getFaqJsonLd(locale: AppLocale) {
	const qas = [
		{ question: t("faqQ1", locale), answer: t("faqA1", locale) },
		{ question: t("faqQ2", locale), answer: t("faqA2", locale) },
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
