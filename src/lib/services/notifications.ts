import { render } from "@react-email/render";
import { marked } from "marked";
import * as React from "react";
import { Resend } from "resend";
import BaseMarkdownEmail from "../../../emails/templates/base-markdown-email";
import NewLoginEmail from "../../../emails/templates/new-login";
import PremiumThanksEmail from "../../../emails/templates/premium-thanks";
import WelcomeEmail from "../../../emails/templates/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotificationLink {
	label: string;
	url: string;
}

export interface SendNotificationOptions {
	to: string;
	subject: string;
	message: string;
	from?: string;
	analyticsUrl?: string;
	customLinks?: NotificationLink[];
}

function renderLinks(analyticsUrl?: string, customLinks?: NotificationLink[]) {
	let linksHtml = "";
	if (analyticsUrl) {
		linksHtml += `<li><a href="${analyticsUrl}">View Form Analytics</a></li>`;
	}
	if (customLinks && customLinks.length > 0) {
		for (const link of customLinks) {
			linksHtml += `<li><a href="${link.url}">${link.label}</a></li>`;
		}
	}
	if (linksHtml) {
		return `<ul>${linksHtml}</ul>`;
	}
	return "";
}

export async function sendFormNotification({
	to,
	subject,
	message,
	from,
	analyticsUrl,
	customLinks,
}: SendNotificationOptions) {
	if (!process.env.RESEND_API_KEY) {
		throw new Error("Resend API key not configured");
	}
	try {
		const htmlMessage = await marked.parse(message || "");
		const primary = analyticsUrl
			? { label: "View Form Analytics", url: analyticsUrl }
			: undefined;
		const secondary =
			customLinks && customLinks.length > 0 ? customLinks : undefined;
		const email = React.createElement(BaseMarkdownEmail, {
			heading: subject,
			previewText: subject,
			markdown: htmlMessage,
			primaryCta: primary,
			secondaryCtas: secondary,
		});
		const html = await render(email, { pretty: true });
		const result = await resend.emails.send({
			from: from || "Ikiform <no-reply@ikiform.com>",
			to,
			subject,
			html,
		});
		return result;
	} catch (error) {
		throw error;
	}
}

export async function sendWelcomeEmail({
	to,
	name,
}: {
	to: string;
	name?: string;
	customLinks?: NotificationLink[];
}) {
	const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ikiform.com"}/dashboard`;
	const email = React.createElement(WelcomeEmail, { name, dashboardUrl });
	const html = await render(email, { pretty: true });
	return resend.emails.send({
		from: "Ikiform <no-reply@ikiform.com>",
		to,
		subject: "Welcome to Ikiform! 🎉",
		html,
	});
}

export async function sendNewLoginEmail({
	to,
	name,
}: {
	to: string;
	name?: string;
	customLinks?: NotificationLink[];
}) {
	const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ikiform.com"}/dashboard`;
	const email = React.createElement(NewLoginEmail, { name, dashboardUrl });
	const html = await render(email, { pretty: true });
	return resend.emails.send({
		from: "Ikiform <no-reply@ikiform.com>",
		to,
		subject: "New Login to Your Ikiform Account",
		html,
	});
}

export async function sendPremiumThankYouEmail({
	to,
	name,
	customLinks,
}: {
	to: string;
	name?: string;
	customLinks?: NotificationLink[];
}) {
	const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.ikiform.com"}/dashboard`;
	const email = React.createElement(PremiumThanksEmail, { name, dashboardUrl });
	const html = await render(email, { pretty: true });
	return resend.emails.send({
		from: "Ikiform <no-reply@ikiform.com>",
		to,
		subject: "Thank you for your purchase! 🎉",
		html,
	});
}
