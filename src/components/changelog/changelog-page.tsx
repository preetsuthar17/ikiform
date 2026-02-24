import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { getChangelogEntries } from "@/lib/utils/changelog";

const CHANGELOG_DATE_LOCALE: Record<AppLocale, string> = {
	en: "en-US",
	es: "es-ES",
};

function formatChangelogDate(dateString: string, locale: AppLocale): string {
	try {
		const date = new Date(`${dateString}T00:00:00Z`);
		if (!isNaN(date.getTime())) {
			return new Intl.DateTimeFormat(CHANGELOG_DATE_LOCALE[locale], {
				year: "numeric",
				month: "long",
				day: "numeric",
				timeZone: "UTC",
			}).format(date);
		}
		return dateString;
	} catch {
		return dateString;
	}
}

const markdownComponents = {
	code: ({ inline, className, children, ...props }: any) => {
		const match = /language-(\w+)/.exec(className || "");
		return !inline && match ? (
			<code
				className="block rounded-lg bg-muted p-4 font-mono text-sm"
				{...props}
			>
				{String(children).replace(/\n$/, "")}
			</code>
		) : (
			<code
				className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
				{...props}
			>
				{children}
			</code>
		);
	},
	p: ({ children, ...props }: any) => (
		<p className="mb-4 leading-relaxed last:mb-0" {...props}>
			{children}
		</p>
	),
	h1: ({ children, ...props }: any) => (
		<h1 className="my-4 font-bold text-3xl first:mt-0" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }: any) => (
		<h2 className="my-3 font-semibold text-2xl" {...props}>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: any) => (
		<h3 className="my-0 font-medium text-lg" {...props}>
			{children}
		</h3>
	),
	ul: ({ children, ...props }: any) => (
		<ul className="my-4 flex list-inside list-disc flex-col gap-2" {...props}>
			{children}
		</ul>
	),
	ol: ({ children, ...props }: any) => (
		<ol
			className="my-4 flex list-inside list-decimal flex-col gap-2"
			{...props}
		>
			{children}
		</ol>
	),
	li: ({ children, ...props }: any) => (
		<li className="pl-4" {...props}>
			{children}
		</li>
	),
	blockquote: ({ children, ...props }: any) => (
		<blockquote
			className="mb-4 border-primary border-l-4 pl-4 italic"
			{...props}
		>
			{children}
		</blockquote>
	),
	strong: ({ children, ...props }: any) => (
		<strong className="font-semibold" {...props}>
			{children}
		</strong>
	),
	a: ({ children, href, ...props }: any) => (
		<a
			className="text-primary underline-offset-4 hover:underline"
			href={href}
			{...props}
		>
			{children}
		</a>
	),
};

const CHANGELOG_LABEL: Record<AppLocale, string> = {
	en: "CHANGELOG",
	es: "NOVEDADES",
};

const UNRELEASED_LABEL: Record<AppLocale, string> = {
	en: "Unreleased",
	es: "Sin publicar",
};

export async function ChangelogPage({ locale }: { locale: AppLocale }) {
	const entries = await getChangelogEntries(locale);

	return (
		<main className="mx-auto flex w-full max-w-4xl flex-col px-4 py-12 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-2" />

			<div className="flex flex-col gap-16">
				{entries.map((entry, index) => (
					<article className="relative flex gap-8 lg:gap-12" key={index}>
						<div className="sticky top-8 hidden h-fit shrink-0 self-start lg:block">
							{entry.release_date && entry.release_date.trim() !== "" ? (
								<Badge variant="outline">
									<time dateTime={entry.release_date}>
										{formatChangelogDate(entry.release_date, locale)}
									</time>
								</Badge>
							) : (
								<Badge variant="outline">{UNRELEASED_LABEL[locale]}</Badge>
							)}
						</div>

						<div className="flex min-w-0 flex-1 flex-col gap-6">
							{index === 0 && (
								<h1 className="font-semibold text-muted-foreground text-sm tracking-tight">
									{CHANGELOG_LABEL[locale]}
								</h1>
							)}
							<div className="flex flex-col gap-4">
								<div className="lg:hidden">
									{entry.release_date && entry.release_date.trim() !== "" ? (
										<Badge variant="outline">
											<time dateTime={entry.release_date}>
												{formatChangelogDate(entry.release_date, locale)}
											</time>
										</Badge>
									) : (
										<Badge variant="outline">{UNRELEASED_LABEL[locale]}</Badge>
									)}
								</div>
								<h2 className="font-semibold text-2xl tracking-tight">
									{entry.title}
								</h2>
								{entry.description && (
									<p className="text-muted-foreground text-sm">
										{entry.description}
									</p>
								)}
							</div>

							<div className="prose prose-sm dark:prose-invert flex max-w-none flex-col gap-0 text-sm">
								<ReactMarkdown
									components={markdownComponents}
									rehypePlugins={[rehypeSanitize]}
									remarkPlugins={[remarkGfm]}
								>
									{entry.content}
								</ReactMarkdown>
							</div>
						</div>

						{index < entries.length - 1 && (
							<Separator className="absolute right-0 -bottom-8 left-0" />
						)}
					</article>
				))}
			</div>
		</main>
	);
}
