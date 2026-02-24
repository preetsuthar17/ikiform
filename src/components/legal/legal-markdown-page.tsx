import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { AppLocale } from "@/i18n/routing";
import {
	getLegalDocument,
	type LegalDocumentKey,
} from "@/lib/legal/content";

const markdownComponents = {
	h1: ({ children, ...props }: any) => (
		<h1 className="font-bold text-4xl" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }: any) => (
		<h2 className="font-semibold text-2xl" {...props}>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: any) => (
		<h3 className="font-semibold text-lg" {...props}>
			{children}
		</h3>
	),
	p: ({ children, ...props }: any) => (
		<p className="leading-relaxed" {...props}>
			{children}
		</p>
	),
	ul: ({ children, ...props }: any) => (
		<ul className="flex list-disc flex-col gap-1 pl-6" {...props}>
			{children}
		</ul>
	),
	ol: ({ children, ...props }: any) => (
		<ol className="flex list-decimal flex-col gap-1 pl-6" {...props}>
			{children}
		</ol>
	),
	a: ({ children, href, ...props }: any) => (
		<a className="text-blue-500 underline" href={href} {...props}>
			{children}
		</a>
	),
};

export async function LegalMarkdownPage({
	locale,
	document,
}: {
	locale: AppLocale;
	document: LegalDocumentKey;
}) {
	const content = await getLegalDocument(locale, document);

	return (
		<article className="legal mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10">
			<section className="flex flex-col gap-4">
				<h1 className="font-bold text-4xl">{content.title}</h1>
				{content.lastUpdated ? (
					<div className="text-muted-foreground text-sm">
						Last updated: {content.lastUpdated}
					</div>
				) : null}
			</section>
			<div className="prose prose-sm dark:prose-invert flex max-w-none flex-col gap-8 text-sm sm:prose-base">
				<ReactMarkdown
					components={markdownComponents}
					rehypePlugins={[rehypeSanitize]}
					remarkPlugins={[remarkGfm]}
				>
					{content.content}
				</ReactMarkdown>
			</div>
		</article>
	);
}
