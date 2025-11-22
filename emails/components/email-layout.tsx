import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import type * as React from "react";
import EmailHeader from "./email-header";

interface EmailLayoutProps {
	previewText?: string;
	heading?: string;
	children?: React.ReactNode;
}

export default function EmailLayout(props: EmailLayoutProps) {
	const preview = props.previewText || "";
	const heading = props.heading || "";
	return (
		<Html>
			<Head />
			{preview ? <Preview>{preview}</Preview> : null}
			<Body style={bodyStyle}>
				<Container style={containerStyle}>
					<Section style={headerSectionStyle}>
						<EmailHeader />
					</Section>
					{heading ? (
						<Section style={headingSectionStyle}>
							<Text style={headingStyle}>{heading}</Text>
						</Section>
					) : null}
					<Section style={contentSectionStyle}>{props.children}</Section>
					<Section style={footerSectionStyle}>
						<Text style={footerTextStyle}>
							Ikiform - Enterprise-level forms with sensible pricing.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

const bodyStyle: React.CSSProperties = {
	backgroundColor: "#f6f8fb",
	margin: 0,
	padding: "24px",
	fontFamily:
		'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
};

const containerStyle: React.CSSProperties = {
	margin: "0 auto",
	backgroundColor: "#ffffff",
	borderRadius: 12,
	padding: 24,
	maxWidth: 560,
	width: "100%",
	boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
};

const headerSectionStyle: React.CSSProperties = {
	marginBottom: 24,
};

const headingSectionStyle: React.CSSProperties = {
	marginBottom: 16,
};

const contentSectionStyle: React.CSSProperties = {
	marginBottom: 24,
};

const footerSectionStyle: React.CSSProperties = {
	marginTop: 12,
};

const headingStyle: React.CSSProperties = {
	fontSize: 20,
	fontWeight: 600,
	color: "#0f172a",
	margin: 0,
	paddingBottom: 0,
};

const footerTextStyle: React.CSSProperties = {
	fontSize: 12,
	color: "#475569",
	margin: 0,
	paddingTop: 0,
};
