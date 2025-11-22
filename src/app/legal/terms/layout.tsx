import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		default: "Terms of Service",
		template: "Ikiform: %s",
	},
	description:
		"Read the Terms of Service for Ikiform. Understand your rights and responsibilities when using our form builder platform.",
	applicationName: "Ikiform",
	authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
	creator: "Ikiform",
	publisher: "Ikiform",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://www.ikiform.com"),
	alternates: {
		canonical: "/legal/terms",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.ikiform.com/legal/terms",
		siteName: "Ikiform",
		title: "Terms of Service",
		description:
			"Read the Terms of Service for Ikiform. Understand your rights and responsibilities when using our form builder platform.",
		images: [
			{
				url: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
				width: 1200,
				height: 630,
				alt: "Ikiform Terms of Service",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@Ikiform",
		creator: "@Ikiform",
		title: "Terms of Service",
		description:
			"Read the Terms of Service for Ikiform. Understand your rights and responsibilities when using our form builder platform.",
		images: [
			"https://av5on64jc4.ufs.sh/f/jYAIyA6pXigns6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: [{ url: "/favicon.ico" }],
	},
	keywords: [
		"terms of service",
		"terms",
		"Ikiform",
		"user agreement",
		"form builder",
		"user rights",
		"legal",
		"compliance",
		"platform rules",
	],
	category: "technology",
	classification: "Business Software",
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
