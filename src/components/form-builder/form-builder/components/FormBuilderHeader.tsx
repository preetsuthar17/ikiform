import {
  BarChart3,
  Code,
  EyeOff,
  FileText,
  Globe,
  Layers,
  MoreHorizontal,
  Save,
  Settings as SettingsIcon,
  Share,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FORM_BUILDER_CONSTANTS } from "../constants";

import type { FormBuilderHeaderProps } from "../types";
import { Loader } from "@/components/ui";

export const FormBuilderHeader: React.FC<FormBuilderHeaderProps> = ({
  formSchema,
  autoSaving,
  saving,
  publishing,
  isPublished,
  formId,
  onModeToggle,
  onJsonView,
  onAnalytics,
  onShare,
  onSettings,
  onPublish,
  onSave,
}) => {
  const fieldCount = formSchema.fields.length;

  return (
    <header
      className="z-20 flex-shrink-0 border-border border-b bg-card px-4 py-3 md:py-4"
      style={{ minHeight: FORM_BUILDER_CONSTANTS.HEADER_HEIGHT }}
    >
      <div className="flex h-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <h1
            aria-hidden="true"
            className="absolute font-semibold text-foreground text-xl opacity-0"
          >
            Form Builder
          </h1>
          <div className="flex items-center gap-2 md:gap-3 px-2">
            <Button
              asChild
              className="font-medium text-xs md:text-sm"
              variant="outline"
            >
              <Link className="z-1 flex items-center" href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <div className="text-muted-foreground text-xs md:text-sm">
              {fieldCount} field{fieldCount !== 1 ? "s" : ""}
            </div>
            {autoSaving && (
              <div aria-live="polite" role="status" className="flex items-center gap-1 text-muted-foreground text-xs">
                <div className="h-1.5 w-1.5 animate-pulse rounded-2xl bg-primary" />
                <span>Saving</span>
              </div>
            )}
          </div>
        </div>

        <nav aria-label="Form builder actions" className="relative w-full md:hidden px-2">
        
          <ScrollArea className="w-full">
            <div className="flex items-center justify-start gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-label="More actions" size="icon" variant="outline">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-xs">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex w-full items-center justify-between gap-4">
                      <span>Multi-step form</span>
                      <Switch
                        aria-label="Toggle multi-step mode"
                        checked={formSchema.settings.multiStep}
                        onCheckedChange={() => onModeToggle()}
                      />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onClick={onJsonView}>
                    <Code className="size-4" /> View JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!formId} onClick={onAnalytics}>
                    <BarChart3 className="size-4" /> Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!formId} onClick={onShare}>
                    <Share className="size-4" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ai-builder">
                      <Sparkles className="size-4" /> Use Kiko
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={onSettings}
                variant="outline"
                aria-label="Settings"
                size="icon"
              >
                <SettingsIcon className="size-4" />
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!formId || publishing}
                    onClick={onPublish}
                    className="flex items-center justify-center gap-2"
                    variant={isPublished ? "secondary" : "warning"}
                    aria-label={
                      isPublished
                        ? publishing
                          ? "Unpublishing..."
                          : "Published"
                        : publishing
                          ? "Publishing..."
                          : "Publish"
                    }
                  >
                    <span className="relative inline-flex size-4 items-center justify-center" aria-hidden>
                      <AnimatePresence mode="wait" initial={false}>
                        {isPublished ? (
                          <motion.span
                            key="published"
                            initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.85, opacity: 0, rotate: 8 }}
                            transition={{ duration: 0.10, ease: "easeOut" }}
                            className="absolute inset-0 grid place-items-center"
                          >
                            <Globe className="size-4" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="unpublished"
                            initial={{ scale: 0.85, opacity: 0, rotate: 8 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.85, opacity: 0, rotate: -8 }}
                            transition={{ duration: 0.10, ease: "easeOut" }}
                            className="absolute inset-0 grid place-items-center"
                          >
                            <EyeOff className="size-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>
                      {isPublished
                        ? publishing
                          ? "Unpublishing.."
                          : "Published"
                        : publishing
                          ? "Publishing.."
                          : "Publish"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="font-medium">
                  {publishing
                    ? isPublished
                      ? "Unpublishing.."
                      : "Publishing.."
                    : isPublished
                      ? "Unpublish form"
                      : "Publish form"}
                </TooltipContent>
              </Tooltip>
              
              <Button
                disabled={saving}
                loading={saving}
                onClick={onSave}
              >
                {!saving && <Save className="h-3 w-3" />}
                {saving ? "Saving" : "Save Form"}
              </Button>
            </div>
          </ScrollArea>
        </nav>

        <nav aria-label="Form builder actions" className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2">
            <Button disabled={!formId} onClick={onAnalytics} variant="outline">
              <BarChart3 className="size-4 shrink-0" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button disabled={!formId} onClick={onShare} variant="outline">
              <Share className="size-4 shrink-0" />
              <span className="text-sm">Share</span>
            </Button>
            <Button onClick={onSettings} variant="outline">
              <SettingsIcon className="size-4 shrink-0" />
              <span className="text-sm">Settings</span>
            </Button>
                <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label="More actions" size="icon" variant="outline">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center" className="font-medium">
                More actions
              </TooltipContent>
            </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onJsonView}>
                      <Code className="size-4.5" />
                      <span className="text-sm">View JSON</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="font-medium">Multi-step form</span>
                        <Switch
                          aria-label="Toggle multi-step mode"
                          checked={formSchema.settings.multiStep}
                          onCheckedChange={() => onModeToggle()}
                          />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                          </DropdownMenu>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={!formId || publishing}
                onClick={onPublish}
                size={"icon"}
                variant={isPublished ? "secondary" : "warning"}
                aria-label={
                  isPublished
                    ? publishing
                      ? "Unpublishing..."
                      : "Published"
                    : publishing
                      ? "Publishing..."
                      : "Publish"
                }
              >
                <span className="relative inline-flex size-4 items-center justify-center" aria-hidden>
                  <AnimatePresence mode="wait" initial={false}>
                    {isPublished ? (
                      <motion.span
                        key="published"
                        initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.85, opacity: 0, rotate: 8 }}
                        transition={{ duration: 0.10, ease: "easeOut" }}
                        className="absolute inset-0 grid place-items-center"
                      >
                        <Globe className="size-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="unpublished"
                        initial={{ scale: 0.85, opacity: 0, rotate: 8 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.85, opacity: 0, rotate: -8 }}
                        transition={{ duration: 0.10, ease: "easeOut" }}
                        className="absolute inset-0 grid place-items-center"
                      >
                        <EyeOff className="size-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="sr-only">
                  {isPublished
                    ? publishing
                      ? "Unpublishing..."
                      : "Published"
                    : publishing
                      ? "Publishing..."
                      : "Publish"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="font-medium">
              {publishing
                ? isPublished
                  ? "Unpublishing..."
                  : "Publishing..."
                : isPublished
                  ? "Unpublish form"
                  : "Publish form"}
            </TooltipContent>
          </Tooltip>

          <Button disabled={saving} loading={saving} onClick={onSave}>
            {!saving && <Save className="size-4" />}
            {saving ? "Saving.." : "Save Form"}
          </Button>
        </nav>
      </div>
    </header>
  );
};
