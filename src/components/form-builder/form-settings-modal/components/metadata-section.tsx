"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { formsDb } from "@/lib/database";
import type { MetadataSectionProps } from "../types";

export function MetadataSection({
	localSettings,
	updateSettings,
	formId,
	schema,
	onSchemaUpdate,
}: MetadataSectionProps & {
	formId?: string;
	schema?: any;
	onSchemaUpdate?: (updates: Partial<any>) => void;
}) {
	const { user } = useAuth();
	const metadata = localSettings.metadata || {};
	const [hasBasicChanges, setHasBasicChanges] = useState(false as boolean);
	const [hasIndexingChanges, setHasIndexingChanges] = useState(
		false as boolean,
	);
	const [hasSocialChanges, setHasSocialChanges] = useState(false as boolean);
	const [savingBasic, setSavingBasic] = useState(false as boolean);
	const [savingIndexing, setSavingIndexing] = useState(false as boolean);
	const [savingSocial, setSavingSocial] = useState(false as boolean);
	const [savedBasic, setSavedBasic] = useState(false as boolean);
	const [savedIndexing, setSavedIndexing] = useState(false as boolean);
	const [savedSocial, setSavedSocial] = useState(false as boolean);

	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasBasicChanges || hasIndexingChanges || hasSocialChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () =>
			window.removeEventListener(
				"beforeunload",
				onBeforeUnload as unknown as EventListener,
			);
	}, [hasBasicChanges, hasIndexingChanges, hasSocialChanges]);

	const updateBasicMetadata = (updates: Partial<typeof metadata>) => {
		updateSettings({ metadata: { ...metadata, ...updates } });
		setHasBasicChanges(true);
		setSavedBasic(false);
	};

	const updateIndexingMetadata = (updates: Partial<typeof metadata>) => {
		updateSettings({ metadata: { ...metadata, ...updates } });
		setHasIndexingChanges(true);
		setSavedIndexing(false);
	};

	const updateSocialMetadata = (updates: Partial<typeof metadata>) => {
		updateSettings({ metadata: { ...metadata, ...updates } });
		setHasSocialChanges(true);
		setSavedSocial(false);
	};

	const handleRobotsChange = (value: string) => {
		const robotsMap: Record<string, { noIndex?: boolean; noFollow?: boolean }> =
			{
				index: { noIndex: false, noFollow: false },
				noindex: { noIndex: true, noFollow: false },
				nofollow: { noIndex: false, noFollow: true },
				"noindex,nofollow": { noIndex: true, noFollow: true },
			};

		const robotsValue = robotsMap[value];
		if (robotsValue) {
			updateIndexingMetadata({
				robots: value as any,
				...robotsValue,
			});
		}
	};

	const getRobotsValue = () => {
		if (metadata.noIndex && metadata.noFollow) return "noindex,nofollow";
		if (metadata.noIndex) return "noindex";
		if (metadata.noFollow) return "nofollow";
		return "index";
	};

	const resetBasic = () => {
		const original = (schema?.settings as any)?.metadata || {};
		updateSettings({
			metadata: {
				...metadata,
				title: original.title || "",
				description: original.description || "",
				keywords: original.keywords || "",
				author: original.author || "",
				canonicalUrl: original.canonicalUrl || "",
			},
		});
		setHasBasicChanges(false);
	};

	const resetIndexing = () => {
		const original = (schema?.settings as any)?.metadata || {};
		updateSettings({
			metadata: {
				...metadata,
				robots: original.robots,
				noIndex: original.noIndex,
				noFollow: original.noFollow,
				noArchive: original.noArchive,
				noSnippet: original.noSnippet,
				noImageIndex: original.noImageIndex,
				noTranslate: original.noTranslate,
			},
		});
		setHasIndexingChanges(false);
	};

	const resetSocial = () => {
		const original = (schema?.settings as any)?.metadata || {};
		updateSettings({
			metadata: {
				...metadata,
				ogTitle: original.ogTitle || "",
				ogDescription: original.ogDescription || "",
				ogImage: original.ogImage || "",
				ogType: original.ogType || undefined,
				twitterCard: original.twitterCard || "summary",
				twitterTitle: original.twitterTitle || "",
				twitterDescription: original.twitterDescription || "",
				twitterImage: original.twitterImage || "",
				twitterSite: original.twitterSite || "",
				twitterCreator: original.twitterCreator || "",
			},
		});
		setHasSocialChanges(false);
	};

	const saveBasic = async () => {
		if (!formId) {
			toast.error("Form ID is required to save settings");
			return;
		}
		setSavingBasic(true);
		try {
			const trimmed = {
				...localSettings.metadata,
				title: (localSettings.metadata?.title || "").trim(),
				description: (localSettings.metadata?.description || "").trim(),
				keywords: (localSettings.metadata?.keywords || "").trim(),
				author: (localSettings.metadata?.author || "").trim(),
				canonicalUrl: (localSettings.metadata?.canonicalUrl || "").trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						metadata: trimmed,
					},
				});
			}
			setSavedBasic(true);
			setHasBasicChanges(false);
			toast.success("Basic SEO saved");
			setTimeout(() => setSavedBasic(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error("Failed to save Basic SEO");
		} finally {
			setSavingBasic(false);
		}
	};

	const saveIndexing = async () => {
		if (!formId) {
			toast.error("Form ID is required to save settings");
			return;
		}
		setSavingIndexing(true);
		try {
			const newSchema = {
				...schema,
				settings: {
					...schema.settings,
					metadata: { ...localSettings.metadata },
				},
			};
			if (!user) return;
			await formsDb.updateForm(formId, user.id, { schema: newSchema as any });
			setSavedIndexing(true);
			setHasIndexingChanges(false);
			toast.success("Indexing settings saved");
			setTimeout(() => setSavedIndexing(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error("Failed to save indexing settings");
		} finally {
			setSavingIndexing(false);
		}
	};

	const saveSocial = async () => {
		if (!formId) {
			toast.error("Form ID is required to save settings");
			return;
		}
		setSavingSocial(true);
		try {
			const trimmed = {
				...localSettings.metadata,
				ogTitle: (localSettings.metadata?.ogTitle || "").trim(),
				ogDescription: (localSettings.metadata?.ogDescription || "").trim(),
				ogImage: (localSettings.metadata?.ogImage || "").trim(),
				twitterTitle: (localSettings.metadata?.twitterTitle || "").trim(),
				twitterDescription: (
					localSettings.metadata?.twitterDescription || ""
				).trim(),
				twitterImage: (localSettings.metadata?.twitterImage || "").trim(),
				twitterSite: (localSettings.metadata?.twitterSite || "").trim(),
				twitterCreator: (localSettings.metadata?.twitterCreator || "").trim(),
			};
			if (onSchemaUpdate) {
				await onSchemaUpdate({
					settings: {
						...schema.settings,
						metadata: trimmed,
					},
				});
			}
			setSavedSocial(true);
			setHasSocialChanges(false);
			toast.success("Social metadata saved");
			setTimeout(() => setSavedSocial(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error("Failed to save social metadata");
		} finally {
			setSavingSocial(false);
		}
	};

	useEffect(() => {
		if (savedBasic || savedIndexing || savedSocial) {
			const announcement = document.createElement("div");
			announcement.setAttribute("aria-live", "polite");
			announcement.setAttribute("aria-atomic", "true");
			announcement.className = "sr-only";
			announcement.textContent = "Metadata updated";
			document.body.appendChild(announcement);
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [savedBasic, savedIndexing, savedSocial]);

	return (
		<div
			className="flex flex-col gap-4"
			onKeyDown={(e) => {
				const target = e.target as HTMLElement;
				const isTextarea = target.tagName === "TEXTAREA";
				if (isTextarea && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					if (hasBasicChanges) saveBasic();
					else if (hasSocialChanges) saveSocial();
				}
			}}
			style={{
				overscrollBehavior: "contain",
			}}
		>
			<Card
				aria-labelledby="basic-seo-title"
				className="shadow-none"
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="basic-seo-title"
							>
								Basic SEO{" "}
								{hasBasicChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										Unsaved changes
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								Titles, descriptions and canonical URL
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="meta-title">Page Title</Label>
						<Input
							className="text-base shadow-none md:text-sm"
							id="meta-title"
							maxLength={60}
							name="meta-title"
							onChange={(e) => updateBasicMetadata({ title: e.target.value })}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="Enter page title (max 60 characters)"
							value={metadata.title || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{metadata.title?.length || 0}/60 characters
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="meta-description">Meta Description</Label>
						<Textarea
							className="text-base shadow-none md:text-sm"
							id="meta-description"
							maxLength={160}
							name="meta-description"
							onChange={(e) =>
								updateBasicMetadata({ description: e.target.value })
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="Enter meta description (max 160 characters)"
							rows={3}
							value={metadata.description || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{metadata.description?.length || 0}/160 characters
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="meta-keywords">Keywords</Label>
							<Input
								className="text-base shadow-none md:text-sm"
								id="meta-keywords"
								name="meta-keywords"
								onChange={(e) =>
									updateBasicMetadata({ keywords: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder="Enter keywords separated by commas"
								value={metadata.keywords || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="meta-author">Author</Label>
							<Input
								className="text-base shadow-none md:text-sm"
								id="meta-author"
								name="meta-author"
								onChange={(e) =>
									updateBasicMetadata({ author: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder="Enter author name"
								value={metadata.author || ""}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="canonical-url">Canonical URL</Label>
						<Input
							autoComplete="url"
							className="text-base shadow-none md:text-sm"
							id="canonical-url"
							inputMode="url"
							name="canonical-url"
							onChange={(e) =>
								updateBasicMetadata({ canonicalUrl: e.target.value })
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="https://example.com/form"
							type="url"
							value={metadata.canonicalUrl || ""}
						/>
						<p className="text-muted-foreground text-xs">
							The preferred URL for this form page
						</p>
					</div>
					<div
						aria-label="Basic SEO actions"
						className="flex items-center justify-between"
						role="group"
					>
						<div className="flex items-center gap-2">
							{hasBasicChanges && (
								<Button
									className="gap-2 text-muted-foreground hover:text-foreground"
									onClick={resetBasic}
									size="sm"
									variant="ghost"
								>
									Reset
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label="Save basic SEO settings"
								disabled={savingBasic || !hasBasicChanges}
								loading={savingBasic}
								onClick={saveBasic}
							>
								Save
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card
				aria-labelledby="social-meta-title"
				className="shadow-none"
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="social-meta-title"
							>
								Social Metadata{" "}
								{hasSocialChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										Unsaved changes
									</Badge>
								)}
							</CardTitle>
							<CardDescription>Open Graph and Twitter settings</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="og-title">Open Graph Title</Label>
						<Input
							className="text-base shadow-none md:text-sm"
							id="og-title"
							name="og-title"
							onChange={(e) =>
								updateSocialMetadata({ ogTitle: e.target.value })
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="Enter Open Graph title"
							value={metadata.ogTitle || ""}
						/>
						<p className="text-muted-foreground text-xs">
							Title shown when shared on Facebook, LinkedIn, etc.
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="og-description">Open Graph Description</Label>
						<Textarea
							className="text-base shadow-none md:text-sm"
							id="og-description"
							name="og-description"
							onChange={(e) =>
								updateSocialMetadata({ ogDescription: e.target.value })
							}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLElement).blur();
								}
							}}
							placeholder="Enter Open Graph description"
							rows={3}
							value={metadata.ogDescription || ""}
						/>
						<p className="text-muted-foreground text-xs">
							Description shown when shared on social media
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="og-image">Open Graph Image URL</Label>
							<Input
								autoComplete="url"
								className="text-base shadow-none md:text-sm"
								id="og-image"
								inputMode="url"
								name="og-image"
								onChange={(e) =>
									updateSocialMetadata({ ogImage: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Escape") {
										(e.target as HTMLElement).blur();
									}
								}}
								placeholder="https://example.com/image.jpg"
								type="url"
								value={metadata.ogImage || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="og-type">Open Graph Type</Label>
							<Select
								onValueChange={(value) =>
									updateSocialMetadata({ ogType: value })
								}
								value={metadata.ogType || "website"}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Open Graph type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="website">Website</SelectItem>
									<SelectItem value="article">Article</SelectItem>
									<SelectItem value="profile">Profile</SelectItem>
									<SelectItem value="video">Video</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="twitter-card">Twitter Card Type</Label>
						<Select
							onValueChange={(value) =>
								updateSocialMetadata({ twitterCard: value as any })
							}
							value={metadata.twitterCard || "summary"}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Twitter card type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="summary">Summary</SelectItem>
								<SelectItem value="summary_large_image">
									Summary Large Image
								</SelectItem>
								<SelectItem value="app">App</SelectItem>
								<SelectItem value="player">Player</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-title">Twitter Title</Label>
							<Input
								className="shadow-none"
								id="twitter-title"
								onChange={(e) =>
									updateSocialMetadata({ twitterTitle: e.target.value })
								}
								placeholder="Enter Twitter title"
								value={metadata.twitterTitle || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-image">Twitter Image URL</Label>
							<Input
								className="shadow-none"
								id="twitter-image"
								onChange={(e) =>
									updateSocialMetadata({ twitterImage: e.target.value })
								}
								placeholder="https://example.com/twitter-image.jpg"
								value={metadata.twitterImage || ""}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="twitter-description">Twitter Description</Label>
						<Textarea
							className="shadow-none"
							id="twitter-description"
							onChange={(e) =>
								updateSocialMetadata({ twitterDescription: e.target.value })
							}
							placeholder="Enter Twitter description"
							rows={3}
							value={metadata.twitterDescription || ""}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-site">Twitter Site</Label>
							<Input
								className="shadow-none"
								id="twitter-site"
								onChange={(e) =>
									updateSocialMetadata({ twitterSite: e.target.value })
								}
								placeholder="@yourhandle"
								value={metadata.twitterSite || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-creator">Twitter Creator</Label>
							<Input
								className="shadow-none"
								id="twitter-creator"
								onChange={(e) =>
									updateSocialMetadata({ twitterCreator: e.target.value })
								}
								placeholder="@creatorhandle"
								value={metadata.twitterCreator || ""}
							/>
						</div>
					</div>
					<div
						aria-label="Social metadata actions"
						className="flex items-center justify-between"
						role="group"
					>
						<div className="flex items-center gap-2">
							{hasSocialChanges && (
								<Button
									className="gap-2 text-muted-foreground hover:text-foreground"
									onClick={resetSocial}
									size="sm"
									variant="ghost"
								>
									Reset
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label="Save social metadata settings"
								disabled={savingSocial || !hasSocialChanges}
								loading={savingSocial}
								onClick={saveSocial}
							>
								Save
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card
				aria-labelledby="indexing-title"
				className="shadow-none"
				role="region"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle
								className="flex items-center gap-2 text-lg tracking-tight"
								id="indexing-title"
							>
								Search Engine Indexing{" "}
								{hasIndexingChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										Unsaved changes
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								Control how search engines crawl this form
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label>Search Engine Indexing</Label>
						<Select onValueChange={handleRobotsChange} value={getRobotsValue()}>
							<SelectTrigger>
								<SelectValue placeholder="Select indexing behavior" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="index">
									Index and Follow (Default)
								</SelectItem>
								<SelectItem value="noindex">No Index</SelectItem>
								<SelectItem value="nofollow">No Follow</SelectItem>
								<SelectItem value="noindex,nofollow">
									No Index, No Follow
								</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground text-xs">
							Controls whether search engines can index and follow links on this
							page
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<Switch
								checked={metadata.noArchive}
								id="no-archive"
								onCheckedChange={(checked) =>
									updateIndexingMetadata({ noArchive: checked })
								}
							/>
							<Label className="text-sm" htmlFor="no-archive">
								No Archive
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={metadata.noSnippet}
								id="no-snippet"
								onCheckedChange={(checked) =>
									updateIndexingMetadata({ noSnippet: checked })
								}
							/>
							<Label className="text-sm" htmlFor="no-snippet">
								No Snippet
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={metadata.noImageIndex}
								id="no-image-index"
								onCheckedChange={(checked) =>
									updateIndexingMetadata({ noImageIndex: checked })
								}
							/>
							<Label className="text-sm" htmlFor="no-image-index">
								No Image Index
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								checked={metadata.noTranslate}
								id="no-translate"
								onCheckedChange={(checked) =>
									updateIndexingMetadata({ noTranslate: checked })
								}
							/>
							<Label className="text-sm" htmlFor="no-translate">
								No Translate
							</Label>
						</div>
					</div>
					<div
						aria-label="Indexing actions"
						className="flex items-center justify-between"
						role="group"
					>
						<div className="flex items-center gap-2">
							{hasIndexingChanges && (
								<Button
									className="gap-2 text-muted-foreground hover:text-foreground"
									onClick={resetIndexing}
									size="sm"
									variant="ghost"
								>
									Reset
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label="Save indexing settings"
								disabled={savingIndexing || !hasIndexingChanges}
								loading={savingIndexing}
								onClick={saveIndexing}
							>
								Save
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
