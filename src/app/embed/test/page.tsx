import {
	Code2,
	ExternalLink,
	Eye,
	Monitor,
	Settings,
	Smartphone,
	Tablet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("product.embed.testPage.metadata");
	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function EmbedTestPage() {
	const t = await getTranslations("product.embed.testPage");
	const sampleFormId = "182fa915-7656-4489-bf51-5145984d4094";

	return (
		<div className="min-h-screen bg-background py-12">
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<div className="gradient-bg mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl">
							<Code2 className="size-8 text-accent-foreground" />
						</div>
						<h1 className="mb-4 font-semibold text-3xl text-foreground">
							{t("title")}
						</h1>
						<p className="mx-auto mb-6 max-w-3xl text-muted-foreground">
							{t("descriptionPrefix")}{" "}
							<code className="rounded-xl bg-muted px-2 py-1 text-foreground">
								/embed?formid=YOUR_FORM_ID
							</code>{" "}
							{t("descriptionSuffix")}
						</p>
						<Button asChild className="gap-2" variant="default">
							<Link href={`/embed?formid=${sampleFormId}`}>
								<Settings className="size-4" />
								{t("tryCustomizer")}
								<ExternalLink className="size-4" />
							</Link>
						</Button>
					</div>

					<div className="flex flex-col gap-8">
						{}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Monitor className="size-5" />
											{t("cards.standard.title")}
										</CardTitle>
										<CardDescription>
											{t("cards.standard.description")}
										</CardDescription>
									</div>
									<Badge variant="outline">{t("cards.standard.badge")}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="rounded-xl border-2 border-border/50 border-dashed bg-accent/5 p-4">
									<iframe
										allow="clipboard-write; camera; microphone"
										height="600px"
										loading="lazy"
										sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
										src={`/forms/${sampleFormId}`}
										style={{
											border: "1px solid hsl(var(--border))",
											borderRadius: "8px",
										}}
										title={t("cards.standard.iframeTitle")}
										width="100%"
									/>
								</div>
								<Card className="mt-4 bg-muted/50">
									<CardContent className="p-3">
										<pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
											{`<iframe src="/forms/${sampleFormId}" width="100%" height="600px" frameborder="0"></iframe>`}
										</pre>
									</CardContent>
								</Card>
							</CardContent>
						</Card>

						{}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Tablet className="size-5" />
											{t("cards.compact.title")}
										</CardTitle>
										<CardDescription>
											{t("cards.compact.description")}
										</CardDescription>
									</div>
									<Badge variant="secondary">{t("cards.compact.badge")}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="rounded-xl border-2 border-border/50 border-dashed bg-accent/5 p-4">
									<iframe
										allow="clipboard-write; camera; microphone"
										height="400px"
										loading="lazy"
										sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
										src={`/forms/${sampleFormId}`}
										style={{ border: "none", borderRadius: "12px" }}
										title={t("cards.compact.iframeTitle")}
										width="100%"
									/>
								</div>
								<Card className="mt-4 bg-muted/50">
									<CardContent className="p-3">
										<pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
											{`<iframe src="/forms/${sampleFormId}" width="100%" height="400px" style="border: none; border-radius: 12px;"></iframe>`}
										</pre>
									</CardContent>
								</Card>
							</CardContent>
						</Card>

						{}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Smartphone className="size-5" />
											{t("cards.fixed.title")}
										</CardTitle>
										<CardDescription>
											{t("cards.fixed.description")}
										</CardDescription>
									</div>
									<Badge variant="outline">{t("cards.fixed.badge")}</Badge>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex justify-center rounded-xl border-2 border-border/50 border-dashed bg-accent/5 p-4">
									<iframe
										allow="clipboard-write; camera; microphone"
										height="500px"
										loading="lazy"
										sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
										src={`/forms/${sampleFormId}`}
										style={{
											border: "2px solid hsl(var(--primary))",
											borderRadius: "16px",
											backgroundColor: "hsl(var(--background))",
										}}
										title={t("cards.fixed.iframeTitle")}
										width="800px"
									/>
								</div>
								<Card className="mt-4 bg-muted/50">
									<CardContent className="p-3">
										<pre className="overflow-x-auto font-mono text-muted-foreground text-sm">
											{`<iframe src="/forms/${sampleFormId}" width="800px" height="500px" style="border: 2px solid #3b82f6; border-radius: 16px;"></iframe>`}
										</pre>
									</CardContent>
								</Card>
							</CardContent>
						</Card>

						{}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Code2 className="size-5" />
									{t("cards.react.title")}
								</CardTitle>
								<CardDescription>
									{t("cards.react.description")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Card className="bg-muted/30">
									<CardContent className="p-4">
										<pre className="overflow-x-auto font-mono text-foreground text-sm">
											{`import React from 'react';

export default function EmbeddedForm() {
  const iframeStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
  };

  return (
    <iframe
      src="/forms/${sampleFormId}"
      style={iframeStyle}
      title="${t("cards.react.codeIframeTitle")}"
      loading="lazy"
      allow="clipboard-write; camera; microphone"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      frameBorder="0"
    />
  );
}`}
										</pre>
									</CardContent>
								</Card>
							</CardContent>
						</Card>

						{}
						<Card className="bg-accent/5">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Eye className="size-5" />
									{t("guide.title")}
								</CardTitle>
								<CardDescription>
									{t("guide.description")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-6 md:grid-cols-2">
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="outline">1</Badge>
											<h3 className="font-semibold">
												{t("guide.steps.step1.title")}
											</h3>
										</div>
										<p className="text-muted-foreground">
											{t("guide.steps.step1.prefix")}{" "}
											<code className="rounded-xl bg-muted px-2 py-1 text-foreground">
												/embed?formid=YOUR_FORM_ID
											</code>{" "}
											{t("guide.steps.step1.suffix")}
										</p>
									</div>
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="outline">2</Badge>
											<h3 className="font-semibold">
												{t("guide.steps.step2.title")}
											</h3>
										</div>
										<ul className="flex flex-col gap-1 text-muted-foreground">
											<li>• {t("guide.steps.step2.item1")}</li>
											<li>• {t("guide.steps.step2.item2")}</li>
											<li>• {t("guide.steps.step2.item3")}</li>
											<li>• {t("guide.steps.step2.item4")}</li>
										</ul>
									</div>
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="outline">3</Badge>
											<h3 className="font-semibold">
												{t("guide.steps.step3.title")}
											</h3>
										</div>
										<p className="text-muted-foreground">
											{t("guide.steps.step3.description")}
										</p>
									</div>
									<div>
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="outline">4</Badge>
											<h3 className="font-semibold">
												{t("guide.steps.step4.title")}
											</h3>
										</div>
										<p className="text-muted-foreground">
											{t("guide.steps.step4.description")}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
