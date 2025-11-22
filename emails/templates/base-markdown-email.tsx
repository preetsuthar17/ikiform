import { Markdown, Section, Text } from "@react-email/components";
import type * as React from "react";
import { type CtaItem, CtaList } from "../components/cta-list";
import EmailLayout from "../components/email-layout";

interface BaseMarkdownEmailProps {
	heading?: string;
	previewText?: string;
	markdown?: string;
	primaryCta?: CtaItem;
	secondaryCtas?: CtaItem[];
}

export default function BaseMarkdownEmail(props: BaseMarkdownEmailProps) {
	return (
		<EmailLayout heading={props.heading} previewText={props.previewText}>
			{props.markdown ? (
				<Markdown markdownCustomStyles={markdownStyles}>
					{props.markdown}
				</Markdown>
			) : (
				<Section>
					<Text>No content provided.</Text>
				</Section>
			)}
			<CtaList primary={props.primaryCta} secondary={props.secondaryCtas} />
		</EmailLayout>
	);
}

const markdownStyles = {
	h1: { fontSize: 24, margin: "0 0 8px" },
	h2: { fontSize: 20, margin: "16px 0 8px" },
	h3: { fontSize: 18, margin: "16px 0 8px" },
	p: { margin: "0 0 12px", color: "#0f172a" },
	ul: { margin: "0 0 12px 16px" },
	li: { margin: "4px 0" },
	a: { color: "#0ea5e9", textDecoration: "underline" },
} as const satisfies Record<string, React.CSSProperties>;
