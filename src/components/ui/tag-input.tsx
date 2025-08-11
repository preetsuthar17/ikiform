"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

const tagInputVariants = cva(
  "min-h-9 w-full rounded-ele border border-border bg-input px-3 py-2 text-sm ring-offset-background transition-all focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive focus-within:ring-destructive",
      },
      size: {
        sm: "min-h-8 px-2 py-1 text-xs",
        default: "min-h-9 px-3 py-2 text-sm",
        lg: "min-h-10 px-4 py-2",
        xl: "min-h-12 px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface TagInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "value" | "onChange"
    >,
    VariantProps<typeof tagInputVariants> {
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

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      className,
      variant,
      size,
      tags,
      onTagsChange,
      maxTags,
      placeholder = "Type and press Enter to add tags...",
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

    const chipSizeMapping = {
      sm: "sm" as const,
      default: "sm" as const,
      lg: "default" as const,
      xl: "default" as const,
    };

    return (
      <div className="relative">
        <div
          className={cn(
            tagInputVariants({
              variant: error ? "destructive" : variant,
              size,
            }),
            "cursor-text",
            className,
          )}
          onClick={handleContainerClick}
        >
          <div className="flex flex-wrap gap-1.5">
            <AnimatePresence>
              {safeTags.map((tag, index) => (
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  key={`${tag}-${index}`}
                  layout
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <Chip
                    className="pointer-events-auto"
                    dismissible
                    onDismiss={() => removeTag(tag)}
                    size={chipSizeMapping[size || "default"]}
                    variant={tagVariant}
                  >
                    {tag}
                  </Chip>
                </motion.div>
              ))}
            </AnimatePresence>
            <input
              className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              disabled={
                disabled || (maxTags ? safeTags.length >= maxTags : false)
              }
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={safeTags.length === 0 ? placeholder : ""}
              ref={inputRef}
              type="text"
              value={inputValue}
              {...props}
            />
          </div>
        </div>
        {clearAllButton && safeTags.length > 0 && (
          <button
            aria-label="Clear all tags"
            className="-translate-y-1/2 absolute top-1/2 right-2 rounded-card p-1 transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
            disabled={disabled}
            onClick={handleClearAll}
            type="button"
          >
            <X className="text-muted-foreground" size={14} />
          </button>
        )}
      </div>
    );
  },
);

TagInput.displayName = "TagInput";

export { TagInput, tagInputVariants };
