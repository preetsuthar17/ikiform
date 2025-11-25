"use client";

import Link from "next/link";
import React from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
	question: string;
	answer: React.ReactNode;
}

const faqs = [
	{
		question: "What is Ikiform?",
		answer:
			"Ikiform is an open-source alternative to Google Forms. It helps you create beautiful, interactive forms easily.",
	},
	{
		question: "Is there a free trial?",
		answer:
			"Yes, there is a 14-day free trial without any credit card required. You can cancel anytime.",
	},
	{
		question: "Why use Ikiform instead of google form or typeform?",
		answer:
			"Ikiform is open source and gives you full control over your data and branding. There are no hidden costs, and you can self-host for extra privacy and flexibility.",
	},
	{
		question: "What types of forms can I create?",
		answer:
			"You can create single-page forms and multi-step forms with progress tracking.",
	},
	{
		question: "What fields are supported?",
		answer:
			"Supported fields include Text, Email, Number, Phone Number, Textarea, Date, Time, Address, Link, Select Dropdown, Radio Buttons, Checkboxes, Slider, Tags, Social Fields, File Upload, Signature, Statement, Banner, Field Group, Tag Input, Social Media, Scheduler, Poll, Rating, Quiz, and more.",
	},
	{
		question: "How is my data protected?",
		answer:
			"Forms can have password protection, rate limiting, profanity filters, spam protection, bot protection, and are GDPR compliant.",
	},
	{
		question: "Is the data I submit shared with anyone?",
		answer:
			"No, your data is not sold or shared with third parties except trusted providers needed to run Ikiform.",
	},
	{
		question: "Can I customize my forms?",
		answer:
			"You can change colors, fonts, layout, add your logo, and control the look of each field.",
	},
	{
		question: "Where can I suggest new features?",
		answer: (
			<>
				<p>
					You can suggest any features at{" "}
					<Link
						className="underline"
						href="https://insigh.to/b/ikiform"
						rel="noopener noreferrer"
						target="_blank"
					>
						Feature Board
					</Link>
				</p>
			</>
		),
	},
	{
		question: "Where is my data stored?",
		answer:
			"Your data is encrypted and securely stored in the EU using Supabase.",
	},
	{
		question: "How is my data kept safe?",
		answer:
			"We use strong security measures and only authorized staff can access your data.",
	},
	{
		question: "Will my data be deleted if I cancel my account?",
		answer:
			"Yes. You can delete your data anytime. Deleted data is removed from backups within 30 days.",
	},
	{
		question: "Can I delete my data?",
		answer:
			"Yes. You can request access or deletion of your data at any time by emailing hi@ikiform.com.",
	},
	{
		question: "Who owns my form submission data?",
		answer: "You own all data you collect. Ikiform just stores it for you.",
	},
	{
		question: "Is Ikiform open-source?",
		answer: (
			<>
				<p>
					Ikiform is completely open-source and available on{" "}
					<Link
						className="underline"
						href="https://github.com/preetsuthar17/Ikiform"
						rel="noopener noreferrer"
						target="_blank"
					>
						GitHub
					</Link>
				</p>
			</>
		),
	},
];

function FaqSectionHeader() {
	return (
		<div className="flex flex-col gap-4 border-t border-r px-8 py-16 text-left md:px-12">
			<h2
				className="text-left font-medium text-3xl leading-tight tracking-[-2px] md:text-4xl"
				id="faq-title"
			>
				Frequently Asked Questions
			</h2>
		</div>
	);
}

const FaqList = React.memo(function FaqList({ faqs }: { faqs: Faq[] }) {
	return (
		<div className="flex flex-col gap-0">
			<Accordion className="w-full" collapsible type="single">
				{faqs.map((faq, i) => (
					<AccordionItem
						className="w-full border-t border-b-0 py-2"
						key={i}
						value={String(i)}
					>
						<AccordionTrigger className="px-4 text-left font-medium hover:no-underline md:px-6">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent className="px-4 text-muted-foreground md:px-6">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
});

export default function FAQSection() {
	const [firstHalf, secondHalf] = React.useMemo(() => {
		const midpoint = Math.ceil(faqs.length / 2);
		return [faqs.slice(0, midpoint), faqs.slice(midpoint)];
	}, []);

	return (
		<section aria-labelledby="faq-title" className="mx-auto w-full max-w-7xl">
			<div className="mx-auto flex w-full flex-col">
				<div className="mx-auto flex w-full border border-t-0 max-md:flex-col">
					<FaqSectionHeader />
					<div className="grid w-full grid-cols-1">
						<FaqList faqs={firstHalf} />
						<FaqList faqs={secondHalf} />
					</div>
				</div>
			</div>
		</section>
	);
}
