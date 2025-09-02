import {
  BarChart3,
  Code,
  Container,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Layers,
  Save,
  Settings as SettingsIcon,
  Share,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FORM_BUILDER_CONSTANTS } from "../constants";

import type { FormBuilderHeaderProps } from "../types";

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
    <div
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
          <div className="flex items-center gap-2 md:gap-3">
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
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <div className="h-1.5 w-1.5 animate-pulse rounded-card bg-primary" />
                <span>Saving</span>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="w-full md:hidden" orientation="horizontal">
          <div className="flex gap-2 pb-4">
            <Button
              className="gap-1"
              onClick={onModeToggle}
              variant={formSchema.settings.multiStep ? "default" : "outline"}
            >
              {formSchema.settings.multiStep ? (
                <Layers className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {formSchema.settings.multiStep ? "Multi-Step" : "Single Page"}
            </Button>
            <Button
              className="h-8 w-8"
              onClick={onJsonView}
              size="icon"
              variant="outline"
            >
              <Code className="h-3 w-3 shrink-0" />
            </Button>
            <Button
              className="h-8 w-8"
              disabled={!formId}
              onClick={onAnalytics}
              size="icon"
              variant="outline"
            >
              <BarChart3 className="h-3 w-3 shrink-0" />
            </Button>
            <Button
              className="h-8 w-8"
              disabled={!formId}
              onClick={onShare}
              size="icon"
              variant="outline"
            >
              <Share className="h-3 w-3 shrink-0" />
            </Button>
            <Button
              className="h-8 w-8"
              onClick={onSettings}
              size="icon"
              variant="outline"
            >
              <SettingsIcon className="h-3 w-3 shrink-0" />
            </Button>

            <Button asChild className="text-xs" size="sm" variant="default">
              <Link href="/ai-builder">
                <Sparkles className="h-3 w-3 shrink-0" /> Use Kiko
              </Link>
            </Button>

            <Button
              className="text-xs"
              disabled={!formId || publishing}
              loading={publishing}
              onClick={onPublish}
              size="sm"
              variant="outline"
            >
              {isPublished ? (
                <>
                  {!publishing && <Globe className="h-3 w-3 shrink-0" />}
                  {publishing ? "Unpublishing" : "Published"}
                </>
              ) : (
                <>
                  {!publishing && <EyeOff className="h-3 w-3 shrink-0" />}
                  {publishing ? "Publishing" : "Publish"}
                </>
              )}
            </Button>

            <Button
              className="text-xs"
              disabled={saving}
              loading={saving}
              onClick={onSave}
              size="sm"
            >
              {!saving && <Save className="h-3 w-3" />}
              {saving ? "Saving" : "Save"}
            </Button>
          </div>
        </ScrollArea>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            className="gap-2"
            onClick={onModeToggle}
            size="sm"
            variant={formSchema.settings.multiStep ? "default" : "outline"}
          >
            {formSchema.settings.multiStep ? (
              <Layers className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {formSchema.settings.multiStep ? "Multi-Step" : "Single Page"}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onJsonView} size="icon" variant="outline">
                  <Code className="h-4 w-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">View JSON</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!formId}
                  onClick={onAnalytics}
                  size="icon"
                  variant="outline"
                >
                  <BarChart3 className="h-4 w-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={!formId}
                  onClick={onShare}
                  size="icon"
                  variant="outline"
                >
                  <Share className="h-4 w-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Share</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onSettings} size="icon" variant="outline">
                  <SettingsIcon className="h-4 w-4 shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="sm" variant="default">
                  <Link href="/ai-builder">
                    <Sparkles className="h-4 w-4 shrink-0" /> Use Kiko
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent size="sm">AI Form builder</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            disabled={!formId || publishing}
            loading={publishing}
            onClick={onPublish}
            size="sm"
            variant="outline"
          >
            {isPublished ? (
              <>
                {!publishing && <Globe className="h-4 w-4 shrink-0" />}
                {publishing ? "Unpublishing" : "Published"}
              </>
            ) : (
              <>
                {!publishing && <EyeOff className="h-4 w-4 shrink-0" />}
                {publishing ? "Publishing" : "Publish"}
              </>
            )}
          </Button>

          <Button disabled={saving} loading={saving} onClick={onSave} size="sm">
            {!saving && <Save className="h-4 w-4" />}
            {saving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
