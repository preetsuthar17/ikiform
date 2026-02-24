"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("product.formBuilder.formSettings.metadataSection");
	const tCommon = useTranslations("product.formBuilder.formSettings.common");
	const { user } = useAuth();
	const metadata = localSettings.metadata || {};
	const [hasBasicChanges, setHasBasicChanges] = useState(false as boolean);
	const [hasIndexingChanges, setHasIndexingChanges] = useState(
		false as boolean
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
				onBeforeUnload as unknown as EventListener
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
			toast.error(tCommon("formIdRequiredToSaveSettings"));
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
			toast.success(t("basicSaved"));
			setTimeout(() => setSavedBasic(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error(t("basicSaveFailed"));
		} finally {
			setSavingBasic(false);
		}
	};

	const saveIndexing = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
			return;
		}
		if (!user) {
			toast.error(t("authRequired"));
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
			await formsDb.updateForm(formId, user.id, { schema: newSchema as any });
			setSavedIndexing(true);
			setHasIndexingChanges(false);
			toast.success(t("indexingSaved"));
			setTimeout(() => setSavedIndexing(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error(t("indexingSaveFailed"));
		} finally {
			setSavingIndexing(false);
		}
	};

	const saveSocial = async () => {
		if (!formId) {
			toast.error(tCommon("formIdRequiredToSaveSettings"));
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
			toast.success(t("socialSaved"));
			setTimeout(() => setSavedSocial(false), 2000);
		} catch (e) {
			console.error(e);
			toast.error(t("socialSaveFailed"));
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
			announcement.textContent = t("updatedAnnouncement");
			document.body.appendChild(announcement);
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
	}, [savedBasic, savedIndexing, savedSocial, t]);

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
								{t("basicTitle")}{" "}
								{hasBasicChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								{t("basicDescription")}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="meta-title">{t("pageTitleLabel")}</Label>
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
							placeholder={t("pageTitlePlaceholder")}
							value={metadata.title || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{t("characterCount", {
								count: metadata.title?.length || 0,
								max: 60,
							})}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="meta-description">{t("metaDescriptionLabel")}</Label>
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
							placeholder={t("metaDescriptionPlaceholder")}
							rows={3}
							value={metadata.description || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{t("characterCount", {
								count: metadata.description?.length || 0,
								max: 160,
							})}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="meta-keywords">{t("keywordsLabel")}</Label>
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
								placeholder={t("keywordsPlaceholder")}
								value={metadata.keywords || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="meta-author">{t("authorLabel")}</Label>
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
								placeholder={t("authorPlaceholder")}
								value={metadata.author || ""}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="canonical-url">{t("canonicalUrlLabel")}</Label>
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
							placeholder={t("canonicalUrlPlaceholder")}
							type="url"
							value={metadata.canonicalUrl || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{t("canonicalUrlDescription")}
						</p>
					</div>
					<div
						aria-label={t("basicActionsAria")}
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
									{tCommon("reset")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label={t("saveBasicAria")}
								disabled={savingBasic || !hasBasicChanges}
								loading={savingBasic}
								onClick={saveBasic}
							>
								{tCommon("save")}
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
								{t("socialTitle")}{" "}
								{hasSocialChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription>{t("socialDescription")}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="og-title">{t("ogTitleLabel")}</Label>
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
							placeholder={t("ogTitlePlaceholder")}
							value={metadata.ogTitle || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{t("ogTitleDescription")}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="og-description">{t("ogDescriptionLabel")}</Label>
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
							placeholder={t("ogDescriptionPlaceholder")}
							rows={3}
							value={metadata.ogDescription || ""}
						/>
						<p className="text-muted-foreground text-xs">
							{t("ogDescriptionDescription")}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="og-image">{t("ogImageLabel")}</Label>
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
								placeholder={t("ogImagePlaceholder")}
								type="url"
								value={metadata.ogImage || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="og-type">{t("ogTypeLabel")}</Label>
							<Select
								onValueChange={(value) =>
									updateSocialMetadata({ ogType: value })
								}
								value={metadata.ogType || "website"}
							>
								<SelectTrigger>
									<SelectValue placeholder={t("ogTypePlaceholder")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="website">{t("ogTypes.website")}</SelectItem>
									<SelectItem value="article">{t("ogTypes.article")}</SelectItem>
									<SelectItem value="profile">{t("ogTypes.profile")}</SelectItem>
									<SelectItem value="video">{t("ogTypes.video")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="twitter-card">{t("twitterCardLabel")}</Label>
						<Select
							onValueChange={(value) =>
								updateSocialMetadata({ twitterCard: value as any })
							}
							value={metadata.twitterCard || "summary"}
						>
							<SelectTrigger>
								<SelectValue placeholder={t("twitterCardPlaceholder")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="summary">{t("twitterCards.summary")}</SelectItem>
								<SelectItem value="summary_large_image">
									{t("twitterCards.summaryLargeImage")}
								</SelectItem>
								<SelectItem value="app">{t("twitterCards.app")}</SelectItem>
								<SelectItem value="player">{t("twitterCards.player")}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-title">{t("twitterTitleLabel")}</Label>
							<Input
								className="shadow-none"
								id="twitter-title"
								onChange={(e) =>
									updateSocialMetadata({ twitterTitle: e.target.value })
								}
								placeholder={t("twitterTitlePlaceholder")}
								value={metadata.twitterTitle || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-image">{t("twitterImageLabel")}</Label>
							<Input
								className="shadow-none"
								id="twitter-image"
								onChange={(e) =>
									updateSocialMetadata({ twitterImage: e.target.value })
								}
								placeholder={t("twitterImagePlaceholder")}
								value={metadata.twitterImage || ""}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="twitter-description">
							{t("twitterDescriptionLabel")}
						</Label>
						<Textarea
							className="shadow-none"
							id="twitter-description"
							onChange={(e) =>
								updateSocialMetadata({ twitterDescription: e.target.value })
							}
							placeholder={t("twitterDescriptionPlaceholder")}
							rows={3}
							value={metadata.twitterDescription || ""}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-site">{t("twitterSiteLabel")}</Label>
							<Input
								className="shadow-none"
								id="twitter-site"
								onChange={(e) =>
									updateSocialMetadata({ twitterSite: e.target.value })
								}
								placeholder={t("twitterSitePlaceholder")}
								value={metadata.twitterSite || ""}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="twitter-creator">{t("twitterCreatorLabel")}</Label>
							<Input
								className="shadow-none"
								id="twitter-creator"
								onChange={(e) =>
									updateSocialMetadata({ twitterCreator: e.target.value })
								}
								placeholder={t("twitterCreatorPlaceholder")}
								value={metadata.twitterCreator || ""}
							/>
						</div>
					</div>
					<div
						aria-label={t("socialActionsAria")}
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
									{tCommon("reset")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label={t("saveSocialAria")}
								disabled={savingSocial || !hasSocialChanges}
								loading={savingSocial}
								onClick={saveSocial}
							>
								{tCommon("save")}
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
								{t("indexingTitle")}{" "}
								{hasIndexingChanges && (
									<Badge className="gap-2" variant="secondary">
										<div className="size-2 rounded-full bg-orange-500" />
										{tCommon("unsavedChanges")}
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								{t("indexingDescription")}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label>{t("indexingBehaviorLabel")}</Label>
						<Select onValueChange={handleRobotsChange} value={getRobotsValue()}>
							<SelectTrigger>
								<SelectValue placeholder={t("indexingBehaviorPlaceholder")} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="index">
									{t("indexingOptions.index")}
								</SelectItem>
								<SelectItem value="noindex">{t("indexingOptions.noindex")}</SelectItem>
								<SelectItem value="nofollow">{t("indexingOptions.nofollow")}</SelectItem>
								<SelectItem value="noindex,nofollow">
									{t("indexingOptions.noindexNofollow")}
								</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-muted-foreground text-xs">
							{t("indexingBehaviorDescription")}
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
								{t("switches.noArchive")}
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
								{t("switches.noSnippet")}
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
								{t("switches.noImageIndex")}
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
								{t("switches.noTranslate")}
							</Label>
						</div>
					</div>
					<div
						aria-label={t("indexingActionsAria")}
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
									{tCommon("reset")}
								</Button>
							)}
						</div>
						<div className="flex items-center gap-2">
							<Button
								aria-label={t("saveIndexingAria")}
								disabled={savingIndexing || !hasIndexingChanges}
								loading={savingIndexing}
								onClick={saveIndexing}
							>
								{tCommon("save")}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
