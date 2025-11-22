"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TagInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"size" | "value" | "onChange"
	> {
	tags: string[];
	onTagsChange: (tags: string[]) => void;
	maxTags?: number;
	placeholder?: string;
	tagVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
	tagSize?: "sm" | "default" | "lg";
	allowDuplicates?: boolean;
	onTagAdd?: (tag: string) => void;
	onTagRemove?: (tag: string) => void;
	separator?: string | RegExp;
	clearAllButton?: boolean;
	onClearAll?: () => void;
	disabled?: boolean;
	error?: boolean;
}

const tagBadgeVariantMap = {
	default: "default",
	secondary: "secondary",
	destructive: "destructive",
	outline: "outline",
	ghost: "ghost",
};

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
	(
		{
			className,
			tags,
			onTagsChange,
			maxTags,
			placeholder = "Type and press Enter to add tags…",
			tagVariant = "secondary",
			tagSize = "sm",
			allowDuplicates = false,
			onTagAdd,
			onTagRemove,
			separator = /[\s,]+/,
			clearAllButton = false,
			onClearAll,
			disabled,
			error,
			...props
		},
		ref,
	) => {
		const [inputValue, setInputValue] = React.useState("");
		const inputRef = React.useRef<HTMLInputElement>(null);

		const safeTags = Array.isArray(tags) ? tags : [];

		const addTag = React.useCallback(
			(tag: string) => {
				const trimmedTag = tag.trim();
				if (!trimmedTag) return;
				if (!allowDuplicates && safeTags.includes(trimmedTag)) return;
				if (maxTags && safeTags.length >= maxTags) return;

				const newTags = [...safeTags, trimmedTag];
				onTagsChange(newTags);
				onTagAdd?.(trimmedTag);
				setInputValue("");
			},
			[safeTags, onTagsChange, onTagAdd, allowDuplicates, maxTags],
		);

		const removeTag = React.useCallback(
			(tagToRemove: string) => {
				const newTags = safeTags.filter((tag) => tag !== tagToRemove);
				onTagsChange(newTags);
				onTagRemove?.(tagToRemove);
			},
			[safeTags, onTagsChange, onTagRemove],
		);

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;

			if (separator instanceof RegExp) {
				const parts = value.split(separator);
				if (parts.length > 1) {
					parts.slice(0, -1).forEach((part) => addTag(part));
					setInputValue(parts[parts.length - 1]);
					return;
				}
			} else if (typeof separator === "string" && value.includes(separator)) {
				const parts = value.split(separator);
				parts.slice(0, -1).forEach((part) => addTag(part));
				setInputValue(parts[parts.length - 1]);
				return;
			}

			setInputValue(value);
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault();
				addTag(inputValue);
			} else if (
				e.key === "Backspace" &&
				inputValue === "" &&
				safeTags.length > 0
			) {
				removeTag(safeTags[safeTags.length - 1]);
			}
		};

		const handleClearAll = () => {
			onTagsChange([]);
			onClearAll?.();
			setInputValue("");
		};

		const handleContainerClick = () => {
			inputRef.current?.focus();
		};

		return (
			<div className="relative">
				<div
					aria-invalid={!!error}
					className={cn(
						"w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
						"focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
						"aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
						className,
						error &&
							"border-destructive ring-destructive focus-within:ring-destructive",
					)}
					data-slot="input"
					onClick={handleContainerClick}
					tabIndex={-1}
				>
					<div className="flex min-h-[32px] flex-1 flex-wrap items-center gap-1.5">
						{safeTags.map((tag, idx) => (
							<Badge
								className={cn(
									"inline-flex select-none items-center gap-0.5 font-medium",
									disabled ? "pointer-events-none opacity-60" : "",
								)}
								data-testid="tag-badge"
								key={`${tag}-${idx}`}
								variant={
									(tagBadgeVariantMap[tagVariant] as
										| "default"
										| "destructive"
										| "secondary"
										| "outline"
										| "pending"
										| null
										| undefined) || "secondary"
								}
							>
								<span className="max-w-[120px] truncate">{tag}</span>
								<Button
									aria-label={`Remove tag ${tag}`}
									className={cn("ml-1 size-4 rounded-full p-0.5")}
									disabled={disabled}
									onClick={(e) => {
										e.stopPropagation();
										removeTag(tag);
									}}
									size="icon-sm"
									tabIndex={-1}
									type="button"
									variant="ghost"
								>
									<X className="size-4" />
									<span className="sr-only">{`Remove tag ${tag}`}</span>
								</Button>
							</Badge>
						))}
						<input
							aria-label="Add tag"
							autoComplete="off"
							className={cn(
								"min-w-[120px] flex-1 border-0 bg-transparent p-0 px-1 text-foreground shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:text-sm",
								"disabled:pointer-events-none disabled:cursor-not-allowed",
							)}
							disabled={
								disabled || (maxTags ? safeTags.length >= maxTags : false)
							}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							placeholder={safeTags.length === 0 ? placeholder : ""}
							ref={(node) => {
								inputRef.current = node as HTMLInputElement | null;
								if (typeof ref === "function") {
									ref(node);
								} else if (ref && typeof ref === "object") {
									(
										ref as React.MutableRefObject<HTMLInputElement | null>
									).current = node;
								}
							}}
							spellCheck={false}
							type="text"
							value={inputValue}
							{...props}
						/>
					</div>
				</div>
				{clearAllButton && safeTags.length > 0 && (
					<Button
						aria-label="Clear all tags"
						className="-translate-y-1/2 absolute top-1/2 right-2 size-7 rounded-full p-0"
						disabled={disabled}
						onClick={handleClearAll}
						size="icon"
						tabIndex={0}
						type="button"
						variant="ghost"
					>
						<X className="size-4" />
						<span className="sr-only">Clear all tags</span>
					</Button>
				)}
			</div>
		);
	},
);

TagInput.displayName = "TagInput";

export { TagInput };
