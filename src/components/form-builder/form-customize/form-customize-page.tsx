"use client";

import { ArrowLeft, Layout, Palette, Pencil, Type } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LocalSettings } from "@/components/form-builder/form-settings-modal/types";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import type { FormSchema } from "@/lib/database";
import { formsDb } from "@/lib/database";
import { getInternalFormTitle } from "@/lib/utils/form-utils";

import {
	ActualFormPreview,
	ColorCustomizationSection,
	LayoutCustomizationSection,
	PresetsSection,
	TypographyCustomizationSection,
} from "./components";

interface FormCustomizePageProps {
	formId: string;
	schema: FormSchema;
}

type CustomizeSection = "presets" | "layout" | "colors" | "typography";

export function FormCustomizePage({ formId, schema }: FormCustomizePageProps) {
	const t = useTranslations("product.formBuilder.customize.page");
	const router = useRouter();
	const { user } = useAuth();
	const [activeSection, setActiveSection] =
		useState<CustomizeSection>("presets");

	const [previewMode, setPreviewMode] = useState(false);
	const [saving, setSaving] = useState(false);
	const [settingsVersion, setSettingsVersion] = useState(0);
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

	const [localSettings, setLocalSettings] = useState<LocalSettings>(() => ({
		...schema.settings,
		layout: (schema.settings as any).layout || {},
		colors: (schema.settings as any).colors || {},
		typography: (schema.settings as any).typography || {},
		branding: (schema.settings as any).branding || {},
	}));

	const updateSettings = (updates: Partial<LocalSettings>) => {
		const newSettings = { ...localSettings, ...updates };
		setLocalSettings(newSettings);
	};

	const handleSave = async () => {
		if (!user) return;
		try {
			setSaving(true);
			const newSchema = { ...schema, settings: localSettings };
			await formsDb.updateForm(formId, user.id, { schema: newSchema as any });
			toast.success(t("savedCustomization"));
		} catch (error) {
			toast.error(t("saveFailed"));
		} finally {
			setSaving(false);
		}
	};

	const handleBack = () => {
		router.push(`/form-builder/${formId}`);
	};

	const CustomizationPanel = ({
		className = "",
		isMobile = false,
	}: {
		className?: string;
		isMobile?: boolean;
	}) => {
		if (isMobile) {
			return (
				<div className={`flex h-full flex-col ${className}`}>
					<Tabs
						className="flex h-full flex-col"
						onValueChange={(value) =>
							setActiveSection(value as CustomizeSection)
						}
						value={activeSection}
					>
						<div className="shrink-0 p-4">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger className="gap-2" value="presets">
									<Palette className="size-4" />
									{t("tabs.presets")}
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="layout">
									<Layout className="size-4" />
									{t("tabs.layout")}
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="colors">
									<Palette className="size-4" />
									{t("tabs.colors")}
								</TabsTrigger>
								<TabsTrigger className="gap-2" value="typography">
									<Type className="size-4" />
									{t("tabs.text")}
								</TabsTrigger>
							</TabsList>
						</div>

						<div className="flex-1 overflow-auto">
							<TabsContent className="h-full" value="presets">
								<div className="p-6" key={`presets-${settingsVersion}`}>
									<PresetsSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</TabsContent>
							<TabsContent className="h-full" value="layout">
								<div className="p-6" key={`layout-${settingsVersion}`}>
									<LayoutCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</TabsContent>
							<TabsContent className="h-full" value="colors">
								<div className="p-6" key={`colors-${settingsVersion}`}>
									<ColorCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</TabsContent>
							<TabsContent className="h-full" value="typography">
								<div className="p-6" key={`typography-${settingsVersion}`}>
									<TypographyCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			);
		}

		return (
			<div className={`flex h-full flex-col ${className}`}>
				<Tabs
					className="flex h-full flex-col"
					onValueChange={(value) => setActiveSection(value as CustomizeSection)}
					value={activeSection}
				>
					<div className="shrink-0 p-4">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger className="gap-2" value="presets">
								<Palette className="size-4" />
								{t("tabs.presets")}
							</TabsTrigger>
							<TabsTrigger className="gap-2" value="layout">
								<Layout className="size-4" />
								{t("tabs.layout")}
							</TabsTrigger>
							<TabsTrigger className="gap-2" value="colors">
								<Palette className="size-4" />
								{t("tabs.colors")}
							</TabsTrigger>
							<TabsTrigger className="gap-2" value="typography">
								<Type className="size-4" />
								{t("tabs.text")}
							</TabsTrigger>
						</TabsList>
					</div>

					<div className="flex-1 overflow-hidden">
						<TabsContent className="h-full" value="presets">
							<ScrollArea className="h-full">
								<div className="p-6" key={`presets-${settingsVersion}`}>
									<PresetsSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent className="h-full" value="layout">
							<ScrollArea className="h-full">
								<div className="p-6" key={`layout-${settingsVersion}`}>
									<LayoutCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent className="h-full" value="colors">
							<ScrollArea className="h-full">
								<div className="p-6" key={`colors-${settingsVersion}`}>
									<ColorCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent className="h-full" value="typography">
							<ScrollArea className="h-full">
								<div className="p-6" key={`typography-${settingsVersion}`}>
									<TypographyCustomizationSection
										localSettings={localSettings}
										updateSettings={updateSettings}
									/>
								</div>
							</ScrollArea>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		);
	};

	const internalTitle = getInternalFormTitle(schema);
	const hasPublicTitle =
		schema.settings?.publicTitle &&
		schema.settings.publicTitle !== schema.settings?.title;

	if (previewMode) {
		return (
			<div className="flex h-screen flex-col bg-background">
				{}
				<div className="shrink-0 border-b bg-background p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								className="gap-2"
								onClick={() => setPreviewMode(false)}
								size="sm"
								variant="outline"
							>
								<ArrowLeft className="size-4" />
								{t("backToCustomize")}
							</Button>
							<div>
								<h1 className="font-semibold text-xl">{t("previewForm")}</h1>
								<p className="text-muted-foreground text-sm">{internalTitle}</p>
							</div>
						</div>
					</div>
				</div>

				{}
				<div className="flex-1 overflow-auto">
					<ActualFormPreview
						className="min-h-full"
						localSettings={localSettings}
						schema={schema}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col bg-background">
			{}
			<header className="z-20 shrink-0 border-border border-b bg-card px-4 py-3 md:py-4">
				<div className="flex h-full flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3 md:gap-4">
						<h1 aria-hidden="true" className="sr-only">
							{t("customizeForm")}
						</h1>
						<div className="flex flex-col gap-1">
							<p className="font-semibold text-xl">{internalTitle}</p>
							{hasPublicTitle && (
								<p className="text-muted-foreground text-xs">
									{t("publicTitle", { title: schema.settings?.publicTitle ?? "" })}
								</p>
							)}
							<div className="text-muted-foreground text-sm">
								{t("customizeForm")}
							</div>
						</div>
					</div>

					<nav
						aria-label={t("customizationActions")}
						className="flex items-center gap-2"
					>
						<div className="flex items-center gap-2">
							<Button className="gap-2" onClick={handleBack} variant="outline">
								<ArrowLeft className="size-4" />
								{t("back")}
							</Button>
							<Button disabled={saving} loading={saving} onClick={handleSave}>
								{t("save")}
							</Button>
						</div>
					</nav>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{}
				<div className="hidden w-110 shrink-0 border-r bg-background lg:block">
					{CustomizationPanel({})}
				</div>

				{}
				<div className="absolute right-6 bottom-6 z-10 lg:hidden">
					<Drawer onOpenChange={setMobileDrawerOpen} open={mobileDrawerOpen}>
						<DrawerTrigger asChild>
							<Button className="gap-2 shadow-lg" variant="default">
								<Pencil className="size-4" />
								{t("customize")}
							</Button>
						</DrawerTrigger>
						<DrawerContent className="max-h-[80vh]">
							{CustomizationPanel({ isMobile: true })}
						</DrawerContent>
					</Drawer>
				</div>

				{}
				<div className="min-w-0 flex-1">
					<ScrollArea className="h-full items-center justify-center p-4 lg:p-8">
						<ActualFormPreview
							className="min-h-full"
							localSettings={localSettings}
							schema={schema}
						/>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
