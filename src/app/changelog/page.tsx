import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui";
import { Separator } from "@/components/ui/separator";
import { getChangelogEntries } from "@/lib/utils/changelog";

function formatChangelogDate(dateString: string): string {
	try {
		const date = new Date(dateString);
		if (!isNaN(date.getTime())) {
			return format(date, "MMMM d, yyyy");
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
		<p className="mb-4 last:mb-0 leading-relaxed" {...props}>
			{children}
		</p>
	),
	h1: ({ children, ...props }: any) => (
		<h1 className="my-4 text-3xl font-bold first:mt-0" {...props}>
			{children}
		</h1>
	),
	h2: ({ children, ...props }: any) => (
		<h2 className="my-3 text-2xl font-semibold" {...props}>
			{children}
		</h2>
	),
	h3: ({ children, ...props }: any) => (
		<h3 className="my-0 text-lg font-medium" {...props}>
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
			className="mb-4 border-l-4 border-primary pl-4 italic"
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

export default async function Changelog() {
	const entries = await getChangelogEntries();

	return (
		<main className="mx-auto flex max-w-4xl w-full flex-col px-4 py-12 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-2"></div>

			<div className="flex flex-col gap-16">
				{entries.map((entry, index) => (
					<article key={index} className="relative flex gap-8 lg:gap-12">
						<div className="hidden lg:block sticky top-8 h-fit shrink-0 self-start">
							{entry.release_date && entry.release_date.trim() !== "" ? (
								<Badge variant="outline">
									<time dateTime={entry.release_date}>
										{formatChangelogDate(entry.release_date)}
									</time>
								</Badge>
							) : (
								<Badge variant="outline">Unreleased</Badge>
							)}
						</div>

						<div className="min-w-0 flex-1 flex flex-col gap-6">
							{index === 0 && (
								<h1 className="text-sm tracking-tight text-muted-foreground font-semibold">
									CHANGELOG
								</h1>
							)}
							<div className="flex flex-col gap-4">
								<div className="lg:hidden">
									{entry.release_date && entry.release_date.trim() !== "" ? (
										<Badge variant="outline">
											<time dateTime={entry.release_date}>
												{formatChangelogDate(entry.release_date)}
											</time>
										</Badge>
									) : (
										<Badge variant="outline">Unreleased</Badge>
									)}
								</div>
								<h2 className="text-2xl font-semibold tracking-tight">
									{entry.title}
								</h2>
								{entry.description && (
									<p className="text-muted-foreground text-sm">
										{entry.description}
									</p>
								)}
							</div>

							<div className="prose prose-sm max-w-none dark:prose-invert text-sm flex flex-col gap-0">
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
							<Separator className="absolute -bottom-8 left-0 right-0" />
						)}
					</article>
				))}
			</div>
		</main>
	);
}
