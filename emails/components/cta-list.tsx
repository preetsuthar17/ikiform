import { Button, Link, Section, Text } from "@react-email/components";
import type * as React from "react";

export interface CtaItem {
	label: string;
	url: string;
}

interface CtaListProps {
	primary?: CtaItem;
	secondary?: CtaItem[];
}

export function CtaList(props: CtaListProps) {
	const hasPrimary = Boolean(props.primary);
	const hasSecondary = props.secondary && props.secondary.length > 0;
	if (!(hasPrimary || hasSecondary)) return null;
	return (
		<Section style={sectionStyle}>
			{hasPrimary ? (
				<Button href={props.primary!.url} style={primaryButtonStyle}>
					{props.primary!.label}
				</Button>
			) : null}
			{hasSecondary
				? props.secondary!.map((item) => (
						<Text key={item.url} style={secondaryStyle}>
							<Link href={item.url} style={secondaryLinkStyle}>
								{item.label}
							</Link>
						</Text>
					))
				: null}
		</Section>
	);
}

const sectionStyle: React.CSSProperties = { marginTop: 12 };

const primaryButtonStyle: React.CSSProperties = {
	backgroundColor: "#000000",
	color: "#ffffff",
	borderRadius: 100,
	padding: "10px 14px",
	textDecoration: "none",
	fontSize: 14,
	fontWeight: 500,
	display: "inline-block",
	cursor: "pointer",
};

const secondaryStyle: React.CSSProperties = {
	margin: "6px 0 0",
	fontSize: 14,
};

const secondaryLinkStyle: React.CSSProperties = {
	color: "#0ea5e9",
	textDecoration: "underline",
};
