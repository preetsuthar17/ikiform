import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
	title: {
		default: "Form Builder",
		template: "Ikiform: %s",
	},
	description:
		"Create and customize forms easily with Ikiform Form Builder. Drag and drop fields, configure settings, and launch powerful forms in minutes.",
	applicationName: "Ikiform",
	authors: [{ name: "Preet Suthar", url: "https://preetsuthar.me" }],
	creator: "Ikiform",
	publisher: "Ikiform",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://www.ikiform.com/form-builder"),
	alternates: {
		canonical: "/form-builder",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.ikiform.com/form-builder",
		siteName: "Ikiform",
		title: "Form Builder | Ikiform",
		description:
			"Build forms visually with Ikiform Form Builder. Drag, drop, and configure fields to create forms for any use case.",
		images: [
			{
				url: "https://av5on64jc4.ufs.sh/f/4Qw2vQ4pXjF8b6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
				width: 1200,
				height: 630,
				alt: "Ikiform Form Builder Dashboard",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@Ikiform",
		creator: "@Ikiform",
		title: "Form Builder | Ikiform",
		description:
			"Design and launch forms quickly with Ikiform Form Builder. Drag and drop interface for effortless form creation.",
		images: [
			"https://av5on64jc4.ufs.sh/f/4Qw2vQ4pXjF8b6CclqBuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
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
		"form builder",
		"drag and drop forms",
		"custom forms",
		"Ikiform form builder",
		"form creation",
		"survey builder",
		"online forms",
		"form customization",
		"no code forms",
		"form design",
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
