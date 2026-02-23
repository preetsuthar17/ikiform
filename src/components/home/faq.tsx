"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
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

function FaqSectionHeader() {
	const t = useTranslations("home.faq");

	return (
		<div className="flex flex-col gap-4 border-t border-r px-8 py-16 text-left md:px-12">
			<h2
				className="text-left font-medium text-3xl leading-tight tracking-[-2px] md:text-4xl"
				id="faq-title"
			>
				{t("title")}
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
	const t = useTranslations("home.faq");

	const faqs = React.useMemo<Faq[]>(
		() => [
			{
				question: t("q1.question"),
				answer: t("q1.answer"),
			},
			{
				question: t("q2.question"),
				answer: t("q2.answer"),
			},
			{
				question: t("q3.question"),
				answer: t("q3.answer"),
			},
			{
				question: t("q4.question"),
				answer: t("q4.answer"),
			},
			{
				question: t("q5.question"),
				answer: t("q5.answer"),
			},
			{
				question: t("q6.question"),
				answer: t("q6.answer"),
			},
			{
				question: t("q7.question"),
				answer: t("q7.answer"),
			},
			{
				question: t("q8.question"),
				answer: t("q8.answer"),
			},
			{
				question: t("q9.question"),
				answer: (
					<p>
						{t("q9.answerPrefix")}{" "}
						<Link
							className="underline"
							href="https://insigh.to/b/ikiform"
							rel="noopener noreferrer"
							target="_blank"
						>
							{t("featureBoardLabel")}
						</Link>
					</p>
				),
			},
			{
				question: t("q10.question"),
				answer: t("q10.answer"),
			},
			{
				question: t("q11.question"),
				answer: t("q11.answer"),
			},
			{
				question: t("q12.question"),
				answer: t("q12.answer"),
			},
			{
				question: t("q13.question"),
				answer: t("q13.answer"),
			},
			{
				question: t("q14.question"),
				answer: t("q14.answer"),
			},
			{
				question: t("q15.question"),
				answer: (
					<p>
						{t("q15.answerPrefix")}{" "}
						<Link
							className="underline"
							href="https://github.com/preetsuthar17/Ikiform"
							rel="noopener noreferrer"
							target="_blank"
						>
							{t("githubLabel")}
						</Link>
					</p>
				),
			},
		],
		[t]
	);

	const [firstHalf, secondHalf] = React.useMemo(() => {
		const midpoint = Math.ceil(faqs.length / 2);
		return [faqs.slice(0, midpoint), faqs.slice(midpoint)];
	}, [faqs]);

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
