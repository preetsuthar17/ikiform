import type { Metadata } from "next";
import { LegalMarkdownPage } from "@/components/legal/legal-markdown-page";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true,
	},
};

export default async function Dpa() {
	return <LegalMarkdownPage document="dpa" locale="en" />;
}
