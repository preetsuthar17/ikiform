"use client";

import { Check, ChevronDown, Type } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { loadGoogleFont } from "@/lib/utils/google-fonts";
import { Input } from "./input";
import { Label } from "./label";
import { Loader } from "./loader";

interface GoogleFont {
	family: string;
	variants: string[];
	subsets: string[];
	version: string;
	lastModified: string;
	files: Record<string, string>;
	category: "serif" | "sans-serif" | "monospace" | "display" | "handwriting";
	kind: string;
	menu: string;
	axes?: Array<{
		tag: string;
		start: number;
		end: number;
	}>;
}

interface GoogleFontsResponse {
	kind: string;
	items: GoogleFont[];
}

const CATEGORY_MAP = {
	"sans-serif": "Sans Serif",
	serif: "Serif",
	monospace: "Monospace",
	display: "Display",
	handwriting: "Handwriting",
} as const;

const FONT_CATEGORIES = [
	{ id: "all", label: "All Fonts" },
	{ id: "Sans Serif", label: "Sans Serif" },
	{ id: "Serif", label: "Serif" },
	{ id: "Display", label: "Display" },
	{ id: "Monospace", label: "Monospace" },
	{ id: "Handwriting", label: "Handwriting" },
] as const;

interface GoogleFontPickerProps {
	value?: string;
	onChange: (fontFamily: string) => void;
	label?: string;
	placeholder?: string;
	showPreview?: boolean;
}

export function GoogleFontPicker({
	value,
	onChange,
	label = "Font Family",
	placeholder = "Select a font...",
	showPreview = true,
}: GoogleFontPickerProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		"all" | "Sans Serif" | "Serif" | "Display" | "Monospace" | "Handwriting"
	>("all");
	const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
	const [fonts, setFonts] = useState<GoogleFont[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFonts = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/google-fonts");

				if (!response.ok) {
					throw new Error("Failed to fetch fonts");
				}

				const data: GoogleFontsResponse = await response.json();
				setFonts(data.items || []);
			} catch (err) {
				console.error("Error fetching fonts:", err);
				setError("Failed to load fonts. Please try again.");

				setFonts(getFallbackFonts());
			} finally {
				setLoading(false);
			}
		};

		fetchFonts();
	}, []);

	const getFallbackFonts = (): GoogleFont[] => [
		{
			family: "Inter",
			category: "sans-serif",
			variants: ["400", "500", "600", "700"],
			subsets: ["latin"],
			version: "v12",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Roboto",
			category: "sans-serif",
			variants: ["300", "400", "500", "700"],
			subsets: ["latin"],
			version: "v30",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Open Sans",
			category: "sans-serif",
			variants: ["400", "600", "700"],
			subsets: ["latin"],
			version: "v34",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Lato",
			category: "sans-serif",
			variants: ["400", "700"],
			subsets: ["latin"],
			version: "v23",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Montserrat",
			category: "sans-serif",
			variants: ["400", "500", "600", "700"],
			subsets: ["latin"],
			version: "v25",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Poppins",
			category: "sans-serif",
			variants: ["400", "500", "600", "700"],
			subsets: ["latin"],
			version: "v20",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Playfair Display",
			category: "serif",
			variants: ["400", "500", "600", "700"],
			subsets: ["latin"],
			version: "v30",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Merriweather",
			category: "serif",
			variants: ["400", "700"],
			subsets: ["latin"],
			version: "v30",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "Fira Code",
			category: "monospace",
			variants: ["400", "500", "700"],
			subsets: ["latin"],
			version: "v14",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
		{
			family: "JetBrains Mono",
			category: "monospace",
			variants: ["400", "500", "700"],
			subsets: ["latin"],
			version: "v13",
			lastModified: "2022-09-22",
			files: {},
			kind: "webfonts#webfont",
			menu: "",
		},
	];

	const filteredFonts = React.useMemo(() => {
		let filtered = fonts;

		if (selectedCategory !== "all") {
			const categoryKey = Object.entries(CATEGORY_MAP).find(
				([_, value]) => value === selectedCategory,
			)?.[0];
			if (categoryKey) {
				filtered = filtered.filter((font) => font.category === categoryKey);
			}
		}

		if (search) {
			const lowercaseSearch = search.toLowerCase();
			filtered = filtered.filter((font) =>
				font.family.toLowerCase().includes(lowercaseSearch),
			);
		}

		filtered.sort((a, b) => b.variants.length - a.variants.length);

		return filtered.slice(0, 100);
	}, [fonts, search, selectedCategory]);

	const preloadFont = async (fontFamily: string) => {
		if (!loadedFonts.has(fontFamily)) {
			try {
				await loadGoogleFont(fontFamily);
				setLoadedFonts((prev) => new Set([...prev, fontFamily]));
			} catch (error) {
				console.warn("Failed to load font:", fontFamily, error);
			}
		}
	};

	useEffect(() => {
		if (value && !loadedFonts.has(value)) {
			preloadFont(value);
		}
	}, [value, loadedFonts]);

	const selectedFont = fonts.find((font) => font.family === value);

	const handleFontSelect = (fontFamily: string) => {
		console.log("Font selected:", fontFamily);
		onChange(fontFamily);
		setOpen(false);
	};

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<Label className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					{label}
				</Label>
			)}

			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild>
					<Button
						aria-expanded={open}
						className="w-full justify-between font-normal"
						role="combobox"
						variant="outline"
					>
						<div className="flex items-center gap-2">
							<Type className="size-4 text-muted-foreground" />
							{value ? (
								<div className="flex items-center gap-2">
									<span
										className="font-medium"
										style={{
											fontFamily: loadedFonts.has(value)
												? `"${value}", system-ui, sans-serif`
												: undefined,
										}}
									>
										{value}
									</span>
									{selectedFont && (
										<Badge className="text-xs" variant="secondary">
											{CATEGORY_MAP[selectedFont.category]}
										</Badge>
									)}
								</div>
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}
						</div>
						<ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>

				<PopoverContent align="start" className="w-[320px] p-0 md:w-[400px]">
					<Card className="border-0 shadow-none">
						<CardContent className="p-3 md:p-4">
							<div className="flex flex-col gap-3 md:gap-4">
								{}
								<div className="flex items-center">
									<Input
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search fonts..."
										value={search}
									/>
								</div>

								<Separator />

								{}
								<div className="flex flex-wrap gap-1.5 md:gap-2">
									{FONT_CATEGORIES.map((category) => (
										<Button
											className="h-7 px-2 text-xs md:h-8 md:px-3"
											key={category.id}
											onClick={() => setSelectedCategory(category.id)}
											size="sm"
											variant={
												selectedCategory === category.id ? "default" : "ghost"
											}
										>
											{category.label}
										</Button>
									))}
								</div>

								<Separator />

								{}
								{loading && (
									<div className="flex flex-col items-center gap-4 py-8">
										<Loader />
										<div className="flex flex-col items-center gap-2">
											<p className="font-medium text-foreground text-sm">
												Loading fonts...
											</p>
											<p className="text-muted-foreground text-xs">
												Fetching from Google Fonts
											</p>
										</div>
									</div>
								)}

								{error && (
									<div className="flex flex-col items-center gap-4 py-8">
										<div className="flex size-12 items-center justify-center rounded-full bg-muted">
											<Type className="size-6 text-muted-foreground" />
										</div>
										<div className="flex flex-col items-center gap-2 text-center">
											<p className="font-medium text-foreground text-sm">
												Failed to load fonts
											</p>
											<p className="text-muted-foreground text-xs">
												Using fallback fonts
											</p>
										</div>
									</div>
								)}

								{!(loading || error) && (
									<ScrollArea className="h-[180px] md:h-[350px]">
										{filteredFonts.length === 0 ? (
											<div className="flex flex-col items-center gap-3 py-6 md:py-8">
												<div className="flex size-10 items-center justify-center rounded-full bg-muted md:size-12">
													<Type className="size-5 text-muted-foreground md:size-6" />
												</div>
												<div className="flex flex-col items-center gap-1.5 text-center">
													<p className="font-medium text-foreground text-sm">
														No fonts found
													</p>
													<p className="text-muted-foreground text-xs">
														Try a different search term or category
													</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col gap-1">
												{filteredFonts.map((font) => (
													<Card
														className={cn(
															"cursor-pointer p-0 shadow-none transition-all duration-200 hover:bg-accent/50",
															value === font.family &&
																"border-primary/20 bg-accent/30 ring-2 ring-primary/20",
														)}
														key={font.family}
														onClick={() => handleFontSelect(font.family)}
														onMouseEnter={() => preloadFont(font.family)}
													>
														<CardContent className="p-3 md:p-4">
															<div className="flex items-center justify-between">
																<div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
																	<span
																		className="truncate font-medium text-sm md:text-base"
																		style={{
																			fontFamily: loadedFonts.has(font.family)
																				? `"${font.family}", system-ui, sans-serif`
																				: undefined,
																		}}
																	>
																		{font.family}
																	</span>
																	<div className="flex flex-shrink-0 items-center gap-1.5 md:gap-2">
																		<Badge
																			className="hidden text-xs md:inline-flex"
																			variant="outline"
																		>
																			{CATEGORY_MAP[font.category]}
																		</Badge>
																		<Badge
																			className="text-xs"
																			variant="secondary"
																		>
																			{font.variants.length}
																		</Badge>
																	</div>
																</div>
																<Check
																	className={cn(
																		"size-4 shrink-0 transition-opacity",
																		value === font.family
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										)}
									</ScrollArea>
								)}
							</div>
						</CardContent>
					</Card>
				</PopoverContent>
			</Popover>
		</div>
	);
}
